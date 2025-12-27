"""
Test với ví dụ chính thức từ BHXH Việt Nam
Công nhân A - 01/2013 đến 07/2016
"""

import sys
sys.path.append('/home/dinhlongit/Documents/bhxh-calculator/backend')

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


# Copy calculation engine
class CalculationEngine:
    """Core calculation engine for BHXH one-time payment"""

    CUTOFF_DATE = datetime(2014, 1, 1)
    MULTIPLIER_PRE_2014 = 1.5
    MULTIPLIER_FROM_2014 = 2.0

    def __init__(self):
        self.coefficients_cache: Dict[int, float] = {}

    def calculate(self, periods: List[PeriodSchema], coefficients: List[Coefficient]) -> dict:
        """Calculate BHXH one-time payment amount"""
        self._build_coefficient_cache(coefficients)
        split_periods = self._split_periods_by_cutoff(periods)

        period_data = []
        total_adjusted_salary_months = 0.0
        total_months = 0
        total_months_pre_2014 = 0
        total_months_from_2014 = 0

        for period in split_periods:
            start_date = datetime.strptime(period.start_date, '%Y-%m-%d')
            end_date = datetime.strptime(period.end_date, '%Y-%m-%d')

            months = self._calculate_months(start_date, end_date)
            total_months += months

            is_pre_2014 = end_date < self.CUTOFF_DATE
            if is_pre_2014:
                total_months_pre_2014 += months
            else:
                total_months_from_2014 += months

            avg_coefficient = self._get_period_coefficient(start_date, end_date)
            adjusted_salary = period.monthly_salary * avg_coefficient
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

        mbqtl = total_adjusted_salary_months / total_months
        total_amount = 0.0

        if total_months < 12:
            amount_22_percent = 0.22 * total_adjusted_salary_months
            max_amount = 2 * mbqtl
            total_amount = min(amount_22_percent, max_amount)
        else:
            years_pre_2014 = self._round_fractional_years(total_months_pre_2014)
            years_from_2014 = self._round_fractional_years(total_months_from_2014)

            amount_pre_2014 = 0
            amount_from_2014 = 0

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
                'years_pre_2014': years_pre_2014,
                'years_from_2014': years_from_2014,
                'amount_pre_2014': round(amount_pre_2014, 2),
                'amount_from_2014': round(amount_from_2014, 2),
                'period_data': period_data
            }

    def _split_periods_by_cutoff(self, periods: List[PeriodSchema]) -> List[PeriodSchema]:
        result = []
        for period in periods:
            start_date = datetime.strptime(period.start_date, '%Y-%m-%d')
            end_date = datetime.strptime(period.end_date, '%Y-%m-%d')

            if end_date < self.CUTOFF_DATE or start_date >= self.CUTOFF_DATE:
                result.append(period)
            else:
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
        full_years = months // 12
        remaining_months = months % 12

        if remaining_months == 0:
            return float(full_years)
        elif 1 <= remaining_months <= 6:
            return full_years + 0.5
        else:
            return full_years + 1.0

    def _build_coefficient_cache(self, coefficients: List[Coefficient]):
        self.coefficients_cache = {
            coeff.year: coeff.coefficient
            for coeff in coefficients
            if coeff.is_active
        }

    def _get_period_coefficient(self, start_date: datetime, end_date: datetime) -> float:
        if start_date.year == end_date.year:
            return self.coefficients_cache.get(start_date.year, 1.0)

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
        months = (end_date.year - start_date.year) * 12
        months += end_date.month - start_date.month + 1
        return months


def test_official_example():
    """
    Test với ví dụ chính thức từ BHXH Việt Nam
    Công nhân A: 01/2013 - 07/2016 (có gián đoạn)
    """
    print("=" * 80)
    print("VÍ DỤ CHÍNH THỨC TỪ BHXH VIỆT NAM - CÔNG NHÂN A")
    print("=" * 80)

    # Periods của công nhân A (bỏ qua giai đoạn nghỉ không lương)
    periods = [
        PeriodSchema("2013-01-01", "2013-12-31", 1200000),
        PeriodSchema("2014-01-01", "2014-09-30", 1445000),
        PeriodSchema("2014-10-01", "2014-12-31", 2140000),
        # Nghỉ không lương 01/2015 - 06/2015 (không nhập)
        PeriodSchema("2015-07-01", "2015-12-31", 2140000),
        PeriodSchema("2016-01-01", "2016-02-29", 2140000),
        PeriodSchema("2016-03-01", "2016-07-31", 2515000),
    ]

    # Coefficients theo Thông tư 42/2016/TT-BLĐTBXH
    coefficients = [
        Coefficient(2013, 1.08),
        Coefficient(2014, 1.03),
        Coefficient(2015, 1.03),
        Coefficient(2016, 1.00),
    ]

    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)

    print("\n📊 KẾT QUẢ TÍNH TOÁN:")
    print(f"Tổng số tháng: {result['total_months']} tháng")
    print(f"  - Trước 2014: {result['total_months_pre_2014']} tháng = {result['years_pre_2014']} năm")
    print(f"  - Từ 2014: {result['total_months_from_2014']} tháng = {result['years_from_2014']} năm")
    print(f"\nMBQTL: {result['average_salary']:,.0f} VNĐ")
    print(f"\nTrợ cấp BHXH một lần:")
    print(f"  - Trước 2014: {result['average_salary']:,.0f} × {result['years_pre_2014']} × 1.5 = {result['amount_pre_2014']:,.0f} VNĐ")
    print(f"  - Từ 2014: {result['average_salary']:,.0f} × {result['years_from_2014']} × 2.0 = {result['amount_from_2014']:,.0f} VNĐ")
    print(f"\nTổng tiền: {result['total_amount']:,.0f} VNĐ")

    # Kết quả mong đợi từ ví dụ
    expected_mbqtl = 1774052
    expected_total = 11531338
    expected_months = 37
    expected_months_pre_2014 = 12
    expected_months_from_2014 = 25
    expected_years_pre_2014 = 1.0
    expected_years_from_2014 = 2.5

    print("\n" + "=" * 80)
    print("SO SÁNH VỚI KẾT QUẢ MONG ĐỢI (từ ví dụ BHXH):")
    print("=" * 80)

    # Verify
    months_ok = result['total_months'] == expected_months
    months_pre_ok = result['total_months_pre_2014'] == expected_months_pre_2014
    months_from_ok = result['total_months_from_2014'] == expected_months_from_2014
    years_pre_ok = result['years_pre_2014'] == expected_years_pre_2014
    years_from_ok = result['years_from_2014'] == expected_years_from_2014
    mbqtl_ok = abs(result['average_salary'] - expected_mbqtl) < 10
    total_ok = abs(result['total_amount'] - expected_total) < 100

    print(f"Tổng tháng: {result['total_months']} {'✓' if months_ok else '✗'} (mong đợi: {expected_months})")
    print(f"  - Tháng trước 2014: {result['total_months_pre_2014']} {'✓' if months_pre_ok else '✗'} (mong đợi: {expected_months_pre_2014})")
    print(f"  - Tháng từ 2014: {result['total_months_from_2014']} {'✓' if months_from_ok else '✗'} (mong đợi: {expected_months_from_2014})")
    print(f"Năm làm tròn:")
    print(f"  - Trước 2014: {result['years_pre_2014']} năm {'✓' if years_pre_ok else '✗'} (mong đợi: {expected_years_pre_2014})")
    print(f"  - Từ 2014: {result['years_from_2014']} năm {'✓' if years_from_ok else '✗'} (mong đợi: {expected_years_from_2014})")
    print(f"MBQTL: {result['average_salary']:,} {'✓' if mbqtl_ok else '✗'} (mong đợi: {expected_mbqtl:,})")
    print(f"Tổng tiền: {result['total_amount']:,} {'✓' if total_ok else '✗'} (mong đợi: {expected_total:,})")

    # Chi tiết từng giai đoạn
    print("\n📋 CHI TIẾT TÍNH TOÁN TỪNG GIAI ĐOẠN:")
    for i, data in enumerate(result['period_data']):
        start = data['start_date'].strftime('%m/%Y')
        end = data['end_date'].strftime('%m/%Y')
        print(f"\nGiai đoạn {i+1}: {start} - {end}")
        print(f"  Lương gốc: {data['period'].monthly_salary:,} VNĐ")
        print(f"  Hệ số: {data['coefficient']:.2f}")
        print(f"  Số tháng: {data['months']}")
        print(f"  Lương điều chỉnh × tháng: {data['period'].monthly_salary:,} × {data['months']} × {data['coefficient']:.2f} = {data['adjusted_salary'] * data['months']:,.0f}")

    all_ok = months_ok and months_pre_ok and months_from_ok and years_pre_ok and years_from_ok and mbqtl_ok and total_ok

    if all_ok:
        print("\n" + "=" * 80)
        print("✅ PASS - KẾT QUẢ KHỚP HOÀN TOÀN VỚI VÍ DỤ CHÍNH THỨC!")
        print("=" * 80)
    else:
        print("\n" + "=" * 80)
        print("❌ FAIL - CÓ SAI KHÁC SO VỚI VÍ DỤ CHÍNH THỨC")
        print("=" * 80)

    return all_ok


if __name__ == "__main__":
    print("\n🧪 KIỂM TRA VỚI VÍ DỤ CHÍNH THỨC TỪ BHXH VIỆT NAM\n")
    result = test_official_example()

    if result:
        print("\n🎉 Hệ thống đã tính ĐÚNG theo quy định của BHXH!")
    else:
        print("\n⚠️  Cần kiểm tra lại logic tính toán")
