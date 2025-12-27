"""
Simple standalone test for calculation engine without database dependencies
"""

from datetime import datetime
from typing import List, Dict


class Coefficient:
    """Mock Coefficient class"""
    def __init__(self, year: int, coefficient: float, is_active: bool = True):
        self.year = year
        self.coefficient = coefficient
        self.is_active = is_active


class PeriodSchema:
    """Mock Period schema"""
    def __init__(self, start_date: str, end_date: str, monthly_salary: float):
        self.start_date = start_date
        self.end_date = end_date
        self.monthly_salary = monthly_salary


# Copy the calculation engine logic inline for testing
class CalculationEngine:
    """Core calculation engine for BHXH one-time payment"""

    CUTOFF_DATE = datetime(2014, 1, 1)
    MULTIPLIER_PRE_2014 = 1.5
    MULTIPLIER_FROM_2014 = 2.0

    def __init__(self):
        self.coefficients_cache: Dict[int, float] = {}

    def calculate(self, periods: List[PeriodSchema], coefficients: List[Coefficient]) -> dict:
        """Calculate BHXH one-time payment amount"""
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

            # Get average coefficient for the period
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

        # Calculate total amount
        total_amount = 0.0

        if total_months < 12:
            # Special case: less than 1 year
            amount_22_percent = 0.22 * total_adjusted_salary_months
            max_amount = 2 * mbqtl
            total_amount = min(amount_22_percent, max_amount)
        else:
            # Normal case: >= 1 year
            # Apply fractional year rounding rule
            years_pre_2014 = self._round_fractional_years(total_months_pre_2014)
            years_from_2014 = self._round_fractional_years(total_months_from_2014)

            # Calculate amounts for each era
            if years_pre_2014 > 0:
                amount_pre_2014 = self.MULTIPLIER_PRE_2014 * mbqtl * years_pre_2014
                total_amount += amount_pre_2014

            if years_from_2014 > 0:
                amount_from_2014 = self.MULTIPLIER_FROM_2014 * mbqtl * years_from_2014
                total_amount += amount_from_2014

        return {
            'total_amount': round(total_amount, 2),
            'average_salary': round(mbqtl, 2),
            'total_months': total_months,
            'total_months_pre_2014': total_months_pre_2014,
            'total_months_from_2014': total_months_from_2014,
            'period_data': period_data
        }

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
                cutoff_end = datetime(2013, 12, 31)
                result.append(PeriodSchema(
                    start_date=period.start_date,
                    end_date=cutoff_end.strftime('%Y-%m-%d'),
                    monthly_salary=period.monthly_salary
                ))

                result.append(PeriodSchema(
                    start_date=self.CUTOFF_DATE.strftime('%Y-%m-%d'),
                    end_date=period.end_date,
                    monthly_salary=period.monthly_salary
                ))

        return result

    def _round_fractional_years(self, months: int) -> float:
        """Round fractional years according to BHXH rules"""
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
        """Get average coefficient for a period"""
        if start_date.year == end_date.year:
            return self.coefficients_cache.get(start_date.year, 1.0)

        # Multiple years - calculate weighted average
        total_months = self._calculate_months(start_date, end_date)
        weighted_sum = 0.0

        current_date = start_date
        while current_date <= end_date:
            year = current_date.year
            year_end = datetime(year, 12, 31)
            period_end = min(year_end, end_date)

            months_in_year = self._calculate_months(current_date, period_end)
            coefficient = self.coefficients_cache.get(year, 1.0)

            weighted_sum += coefficient * months_in_year

            current_date = datetime(year + 1, 1, 1)

        return weighted_sum / total_months

    def _calculate_months(self, start_date: datetime, end_date: datetime) -> int:
        """Calculate number of months between two dates (inclusive)"""
        months = (end_date.year - start_date.year) * 12
        months += end_date.month - start_date.month + 1
        return months


def test_mai_example():
    """Test with Mai's example from documentation"""
    print("=" * 80)
    print("VÍ DỤ ĐỖ QUỲNH MAI")
    print("=" * 80)

    periods = [
        PeriodSchema("2021-01-01", "2021-12-31", 5000000),
        PeriodSchema("2022-01-01", "2022-12-31", 6000000),
        PeriodSchema("2023-01-01", "2023-04-30", 6000000),
        PeriodSchema("2023-05-01", "2023-12-31", 7000000),
        PeriodSchema("2024-01-01", "2024-04-30", 7000000),
    ]

    coefficients = [
        Coefficient(2021, 1.07),
        Coefficient(2022, 1.03),
        Coefficient(2023, 1.0),
        Coefficient(2024, 1.0),
    ]

    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)

    print(f"\nTổng số tháng: {result['total_months']} tháng")
    print(f"MBQTL: {result['average_salary']:,.0f} VND")
    print(f"Tổng tiền: {result['total_amount']:,.0f} VND")

    # Expected values
    expected_months = 40
    expected_mbqtl = 6159000
    expected_total = 43113000

    # Verify
    months_ok = result['total_months'] == expected_months
    mbqtl_ok = abs(result['average_salary'] - expected_mbqtl) < 100
    total_ok = abs(result['total_amount'] - expected_total) < 100

    print(f"\n✓ KẾT QUẢ SO SÁNH:")
    print(f"  Tổng tháng: {'✓' if months_ok else '✗'} (mong đợi: {expected_months})")
    print(f"  MBQTL: {'✓' if mbqtl_ok else '✗'} (mong đợi: {expected_mbqtl:,})")
    print(f"  Tổng tiền: {'✓' if total_ok else '✗'} (mong đợi: {expected_total:,})")

    # Show calculation details
    print(f"\n📋 CHI TIẾT TÍNH TOÁN:")
    for i, data in enumerate(result['period_data']):
        start = data['start_date'].strftime('%m/%Y')
        end = data['end_date'].strftime('%m/%Y')
        print(f"\nGiai đoạn {i+1}: {start} - {end}")
        print(f"  Lương: {data['period'].monthly_salary:,.0f} VND")
        print(f"  Hệ số: {data['coefficient']:.3f}")
        print(f"  Số tháng: {data['months']}")
        print(f"  Lương điều chỉnh × tháng: {data['adjusted_salary'] * data['months']:,.0f}")

    # Show year rounding
    years_from_2014 = engine._round_fractional_years(result['total_months_from_2014'])
    print(f"\n📊 ÁP DỤNG QUY TẮC LÀM TRÒN:")
    print(f"  Tổng tháng từ 2014: {result['total_months_from_2014']} tháng")
    print(f"  Làm tròn thành: {years_from_2014} năm")
    print(f"  (Quy tắc: 1-6 tháng → 0.5 năm, 7-11 tháng → 1 năm)")

    print(f"\n💰 TÍNH TOÁN CUỐI CÙNG:")
    print(f"  {result['average_salary']:,.0f} × {years_from_2014} × 2.0 = {result['total_amount']:,.0f} VND")

    return months_ok and mbqtl_ok and total_ok


def test_simple_1_year():
    """Test 1 year simple example"""
    print("\n\n" + "=" * 80)
    print("VÍ DỤ ĐƠN GIẢN: 1 NĂM 50 TRIỆU")
    print("=" * 80)

    periods = [PeriodSchema("2025-01-01", "2025-12-31", 50000000)]
    coefficients = [Coefficient(2025, 1.0)]

    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)

    print(f"\nTổng tháng: {result['total_months']}")
    print(f"MBQTL: {result['average_salary']:,.0f} VND")
    print(f"Tổng tiền: {result['total_amount']:,.0f} VND")

    # Expected: 50M × 1 × 2.0 = 100M
    expected = 100000000
    match = abs(result['total_amount'] - expected) < 100

    print(f"\nMong đợi: {expected:,} VND")
    print(f"Kết quả: {'✓ PASS' if match else '✗ FAIL'}")

    return match


def test_less_than_1_year():
    """Test < 1 year case"""
    print("\n\n" + "=" * 80)
    print("TRƯỜNG HỢP ĐẶC BIỆT: DƯỚI 1 NĂM")
    print("=" * 80)

    periods = [PeriodSchema("2024-01-01", "2024-06-30", 10000000)]
    coefficients = [Coefficient(2024, 1.0)]

    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)

    print(f"\nTổng tháng: {result['total_months']}")
    print(f"MBQTL: {result['average_salary']:,.0f} VND")
    print(f"Tổng tiền: {result['total_amount']:,.0f} VND")

    # min(22% × 60M, 2 × 10M) = min(13.2M, 20M) = 13.2M
    expected = 13200000
    match = abs(result['total_amount'] - expected) < 100

    print(f"\nCông thức: min(22% × 60,000,000, 2 × 10,000,000)")
    print(f"Mong đợi: {expected:,} VND")
    print(f"Kết quả: {'✓ PASS' if match else '✗ FAIL'}")

    return match


if __name__ == "__main__":
    print("\n🧪 KIỂM TRA CALCULATION ENGINE\n")

    tests = [
        ("Ví dụ Đỗ Quỳnh Mai", test_mai_example),
        ("Ví dụ 1 năm đơn giản", test_simple_1_year),
        ("Trường hợp < 1 năm", test_less_than_1_year),
    ]

    results = []
    for name, func in tests:
        try:
            passed = func()
            results.append((name, passed))
        except Exception as e:
            print(f"\n❌ LỖI: {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))

    # Summary
    print("\n\n" + "=" * 80)
    print("TÓM TẮT")
    print("=" * 80)

    for name, passed in results:
        print(f"{'✅' if passed else '❌'} {name}")

    passed = sum(1 for _, p in results if p)
    total = len(results)
    print(f"\n{passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 TẤT CẢ TESTS PASSED!")
