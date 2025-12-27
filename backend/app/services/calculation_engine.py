from datetime import datetime
from typing import List, Dict, Tuple
from app.schemas.period import PeriodSchema
from app.schemas.calculation_response import (
    CalculationResponse, PeriodBreakdown, FormulaExplanation, Step
)
from app.models.coefficient import Coefficient


class CalculationEngine:
    """Core calculation engine for BHXH one-time payment"""

    CUTOFF_DATE = datetime(2014, 1, 1)
    MULTIPLIER_PRE_2014 = 1.5
    MULTIPLIER_FROM_2014 = 2.0

    def __init__(self):
        self.coefficients_cache: Dict[int, float] = {}

    def calculate(
        self,
        periods: List[PeriodSchema],
        coefficients: List[Coefficient]
    ) -> CalculationResponse:
        """
        Calculate BHXH one-time payment amount

        Formula:
        - If total_months < 12:
            Amount = min(22% × Σ(adjusted_salary), 2 × Mbqtl)
        - Otherwise:
            Amount = (1.5 × Mbqtl × Years_Pre2014) + (2.0 × Mbqtl × Years_From2014)

        Where Mbqtl = Σ(adjusted_salary × months) / Σ(months)
        """
        # Build coefficient lookup
        self._build_coefficient_cache(coefficients)

        # Split periods that cross the 2014 cutoff
        split_periods = self._split_periods_by_cutoff(periods)

        # Calculate adjusted salaries and months for each period
        period_data = []
        total_adjusted_salary_months = 0.0
        total_months = 0
        total_months_pre_2014 = 0
        total_months_from_2014 = 0

        for period in split_periods:
            start_date = datetime.strptime(period.start_date, '%Y-%m-%d')
            end_date = datetime.strptime(period.end_date, '%Y-%m-%d')

            # Calculate months
            months = self._calculate_months(start_date, end_date)
            total_months += months

            # Track months by era
            is_pre_2014 = end_date < self.CUTOFF_DATE
            if is_pre_2014:
                total_months_pre_2014 += months
            else:
                total_months_from_2014 += months

            # Get average coefficient for the period (weighted if spans multiple years)
            avg_coefficient = self._get_period_coefficient(start_date, end_date)

            # Calculate adjusted salary
            adjusted_salary = period.monthly_salary * avg_coefficient

            # Accumulate
            total_adjusted_salary_months += adjusted_salary * months

            period_data.append({
                'period': period,
                'start_date': start_date,
                'end_date': end_date,
                'months': months,
                'coefficient': avg_coefficient,
                'adjusted_salary': adjusted_salary,
                'is_pre_2014': is_pre_2014
            })

        # Calculate Mbqtl (average adjusted salary)
        mbqtl = total_adjusted_salary_months / total_months

        # Prepare explanation steps
        explanation_steps = []
        step_number = 1

        # Step 1: Show coefficient adjustments for each period
        for i, data in enumerate(period_data):
            period = data['period']
            start_str = data['start_date'].strftime('%m/%Y')
            end_str = data['end_date'].strftime('%m/%Y')
            explanation_steps.append(Step(
                step=step_number,
                description="Điều chỉnh lương theo hệ số trượt giá",
                calculation=f"Giai đoạn từ {start_str} đến {end_str}: {self._format_currency(period.monthly_salary)} × {data['coefficient']:.2f} × {data['months']} tháng = {self._format_currency(data['adjusted_salary'] * data['months'])}"
            ))
            step_number += 1

        # Step 2: Calculate Mbqtl
        explanation_steps.append(Step(
            step=step_number,
            description="Tính mức bình quân tiền lương tháng đóng BHXH (Mbqtl)",
            calculation=f"Mbqtl = {self._format_currency(total_adjusted_salary_months)} ÷ {total_months} tháng = {self._format_currency(mbqtl)}"
        ))
        step_number += 1

        # Calculate total amount based on total months
        total_amount = 0.0
        period_breakdowns = []

        if total_months < 12:
            # Special case: less than 1 year
            # Mức hưởng = 22% × tổng tiền lương đã điều chỉnh, tối đa 2 × Mbqtl
            amount_22_percent = 0.22 * total_adjusted_salary_months
            max_amount = 2 * mbqtl
            total_amount = min(amount_22_percent, max_amount)

            explanation_steps.append(Step(
                step=step_number,
                description="Thời gian đóng BHXH dưới 1 năm - Áp dụng công thức đặc biệt",
                calculation=f"Mức hưởng = min(22% × {self._format_currency(total_adjusted_salary_months)}, 2 × {self._format_currency(mbqtl)}) = {self._format_currency(total_amount)}"
            ))
            step_number += 1

            # Create single breakdown for display
            for data in period_data:
                period_breakdowns.append(PeriodBreakdown(
                    start_date=data['period'].start_date,
                    end_date=data['period'].end_date,
                    months=data['months'],
                    years=round(data['months'] / 12, 2),
                    original_salary=data['period'].monthly_salary,
                    coefficient=data['coefficient'],
                    adjusted_salary=round(data['adjusted_salary'], 2),
                    multiplier=0.22,  # Special multiplier for < 1 year
                    amount=0,  # Will show total in summary
                    is_pre_2014=data['is_pre_2014']
                ))

        else:
            # Normal case: >= 1 year
            # Apply fractional year rounding rule
            years_pre_2014 = self._round_fractional_years(total_months_pre_2014)
            years_from_2014 = self._round_fractional_years(total_months_from_2014)

            # Calculate amounts for each era
            amount_pre_2014 = 0.0
            amount_from_2014 = 0.0

            if years_pre_2014 > 0:
                amount_pre_2014 = self.MULTIPLIER_PRE_2014 * mbqtl * years_pre_2014
                total_amount += amount_pre_2014

                explanation_steps.append(Step(
                    step=step_number,
                    description="Tính số tiền giai đoạn trước 2014",
                    calculation=f"{self.MULTIPLIER_PRE_2014} × {self._format_currency(mbqtl)} × {years_pre_2014} năm = {self._format_currency(amount_pre_2014)}"
                ))
                step_number += 1

            if years_from_2014 > 0:
                amount_from_2014 = self.MULTIPLIER_FROM_2014 * mbqtl * years_from_2014
                total_amount += amount_from_2014

                explanation_steps.append(Step(
                    step=step_number,
                    description="Tính số tiền giai đoạn từ 2014",
                    calculation=f"{self.MULTIPLIER_FROM_2014} × {self._format_currency(mbqtl)} × {years_from_2014} năm = {self._format_currency(amount_from_2014)}"
                ))
                step_number += 1

            # Create breakdowns for each period
            for data in period_data:
                years = data['months'] / 12
                multiplier = self.MULTIPLIER_PRE_2014 if data['is_pre_2014'] else self.MULTIPLIER_FROM_2014

                # Proportional amount for this period (for display purposes)
                if data['is_pre_2014'] and years_pre_2014 > 0:
                    period_amount = (data['months'] / total_months_pre_2014) * amount_pre_2014
                elif not data['is_pre_2014'] and years_from_2014 > 0:
                    period_amount = (data['months'] / total_months_from_2014) * amount_from_2014
                else:
                    period_amount = 0

                period_breakdowns.append(PeriodBreakdown(
                    start_date=data['period'].start_date,
                    end_date=data['period'].end_date,
                    months=data['months'],
                    years=round(years, 2),
                    original_salary=data['period'].monthly_salary,
                    coefficient=data['coefficient'],
                    adjusted_salary=round(data['adjusted_salary'], 2),
                    multiplier=multiplier,
                    amount=round(period_amount, 2),
                    is_pre_2014=data['is_pre_2014']
                ))

        # Final step: Total
        explanation_steps.append(Step(
            step=step_number,
            description="Tổng số tiền BHXH một lần được nhận",
            calculation=f"Tổng = {self._format_currency(total_amount)}"
        ))

        # Create explanation
        explanation = FormulaExplanation(
            formula="Mức hưởng = (1.5 × Mbqtl × Năm trước 2014) + (2.0 × Mbqtl × Năm từ 2014)",
            steps=explanation_steps
        )

        return CalculationResponse(
            total_amount=round(total_amount, 2),
            average_salary=round(mbqtl, 2),
            total_months=total_months,
            period_breakdowns=period_breakdowns,
            explanation=explanation
        )

    def _split_periods_by_cutoff(self, periods: List[PeriodSchema]) -> List[PeriodSchema]:
        """Split periods that cross the 2014 cutoff date into two periods"""
        result = []

        for period in periods:
            start_date = datetime.strptime(period.start_date, '%Y-%m-%d')
            end_date = datetime.strptime(period.end_date, '%Y-%m-%d')

            # If period doesn't cross cutoff, keep as is
            if end_date < self.CUTOFF_DATE or start_date >= self.CUTOFF_DATE:
                result.append(period)
            else:
                # Split into two periods
                # Period 1: start_date to 2013-12-31
                cutoff_end = datetime(2013, 12, 31)
                result.append(PeriodSchema(
                    start_date=period.start_date,
                    end_date=cutoff_end.strftime('%Y-%m-%d'),
                    monthly_salary=period.monthly_salary
                ))

                # Period 2: 2014-01-01 to end_date
                result.append(PeriodSchema(
                    start_date=self.CUTOFF_DATE.strftime('%Y-%m-%d'),
                    end_date=period.end_date,
                    monthly_salary=period.monthly_salary
                ))

        return result

    def _round_fractional_years(self, months: int) -> float:
        """
        Round fractional years according to BHXH rules:
        - 1-6 months of remainder: round to 0.5 year
        - 7-11 months of remainder: round to 1 year
        - Full years: no rounding needed
        """
        full_years = months // 12
        remaining_months = months % 12

        if remaining_months == 0:
            return float(full_years)
        elif 1 <= remaining_months <= 6:
            return full_years + 0.5
        else:  # 7-11 months
            return full_years + 1.0

    def _build_coefficient_cache(self, coefficients: List[Coefficient]):
        """Build coefficient lookup cache"""
        self.coefficients_cache = {
            coeff.year: coeff.coefficient
            for coeff in coefficients
            if coeff.is_active
        }

    def _get_period_coefficient(self, start_date: datetime, end_date: datetime) -> float:
        """
        Get average coefficient for a period.
        If period spans multiple years, calculate weighted average.
        """
        if start_date.year == end_date.year:
            # Same year, simple lookup
            return self.coefficients_cache.get(start_date.year, 1.0)

        # Multiple years - calculate weighted average
        total_months = self._calculate_months(start_date, end_date)
        weighted_sum = 0.0

        current_date = start_date
        while current_date <= end_date:
            # Calculate months in this year
            year = current_date.year
            year_end = datetime(year, 12, 31)
            period_end = min(year_end, end_date)

            months_in_year = self._calculate_months(current_date, period_end)
            coefficient = self.coefficients_cache.get(year, 1.0)

            weighted_sum += coefficient * months_in_year

            # Move to next year
            current_date = datetime(year + 1, 1, 1)

        return weighted_sum / total_months

    def _calculate_months(self, start_date: datetime, end_date: datetime) -> int:
        """Calculate number of months between two dates (inclusive)"""
        months = (end_date.year - start_date.year) * 12
        months += end_date.month - start_date.month + 1  # +1 to include both start and end months
        return months

    def _format_currency(self, amount: float) -> str:
        """Format currency for Vietnamese display"""
        return f"{amount:,.0f}"
