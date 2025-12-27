"""
Test script to verify BHXH calculation matches documentation example

Example from documentation:
- Person: Đỗ Quỳnh Mai
- Periods:
  - 01/2021-12/2021: 5,000,000 VND
  - 01/2022-12/2022: 6,000,000 VND
  - 01/2023-04/2023: 6,000,000 VND
  - 05/2023-12/2023: 7,000,000 VND
  - 01/2024-04/2024: 7,000,000 VND

Expected Result:
- Total months: 40 (3 years 4 months)
- MBQTL: 6,159,000 VND
- Total amount: 43,113,000 VND (after rounding 4 months -> 0.5 year)
"""

import sys
sys.path.append('/home/dinhlongit/Documents/bhxh-calculator/backend')

from app.services.calculation_engine import CalculationEngine
from app.schemas.period import PeriodSchema
from app.models.coefficient import Coefficient


def test_mai_example():
    """Test with Mai's example from documentation"""
    print("=" * 80)
    print("Testing với ví dụ Đỗ Quỳnh Mai từ tài liệu")
    print("=" * 80)

    # Create periods
    periods = [
        PeriodSchema(
            start_date="2021-01-01",
            end_date="2021-12-31",
            monthly_salary=5000000
        ),
        PeriodSchema(
            start_date="2022-01-01",
            end_date="2022-12-31",
            monthly_salary=6000000
        ),
        PeriodSchema(
            start_date="2023-01-01",
            end_date="2023-04-30",
            monthly_salary=6000000
        ),
        PeriodSchema(
            start_date="2023-05-01",
            end_date="2023-12-31",
            monthly_salary=7000000
        ),
        PeriodSchema(
            start_date="2024-01-01",
            end_date="2024-04-30",
            monthly_salary=7000000
        ),
    ]

    # Create coefficients (from documentation)
    coefficients = [
        Coefficient(year=2021, coefficient=1.07, is_active=True),
        Coefficient(year=2022, coefficient=1.03, is_active=True),
        Coefficient(year=2023, coefficient=1.0, is_active=True),
        Coefficient(year=2024, coefficient=1.0, is_active=True),
    ]

    # Create engine and calculate
    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)

    # Print results
    print("\n📊 KẾT QUẢ TÍNH TOÁN:")
    print(f"Tổng số tháng: {result.total_months} tháng")
    print(f"MBQTL: {result.average_salary:,.0f} VND")
    print(f"Tổng số tiền nhận được: {result.total_amount:,.0f} VND")

    print("\n📝 CHI TIẾT TỪNG GIAI ĐOẠN:")
    for i, breakdown in enumerate(result.period_breakdowns):
        print(f"\nGiai đoạn {i+1}: {breakdown.start_date} đến {breakdown.end_date}")
        print(f"  - Số tháng: {breakdown.months}")
        print(f"  - Lương gốc: {breakdown.original_salary:,.0f} VND")
        print(f"  - Hệ số: {breakdown.coefficient:.3f}")
        print(f"  - Lương điều chỉnh: {breakdown.adjusted_salary:,.0f} VND")
        print(f"  - Hệ số nhân: {breakdown.multiplier}")
        print(f"  - Số tiền: {breakdown.amount:,.0f} VND")

    print("\n📋 DIỄN GIẢI TÍNH TOÁN:")
    print(f"Công thức: {result.explanation.formula}\n")
    for step in result.explanation.steps:
        print(f"{step.step}. {step.description}")
        print(f"   {step.calculation}\n")

    # Verify results
    print("\n" + "=" * 80)
    print("SO SÁNH VỚI KẾT QUẢ MONG ĐỢI:")
    print("=" * 80)

    expected_months = 40
    expected_mbqtl = 6159000
    expected_total = 43113000

    months_match = result.total_months == expected_months
    mbqtl_match = abs(result.average_salary - expected_mbqtl) < 100  # Allow small rounding difference
    total_match = abs(result.total_amount - expected_total) < 100

    print(f"Tổng số tháng: {result.total_months} {'✓' if months_match else '✗'} (mong đợi: {expected_months})")
    print(f"MBQTL: {result.average_salary:,.0f} {'✓' if mbqtl_match else '✗'} (mong đợi: {expected_mbqtl:,})")
    print(f"Tổng tiền: {result.total_amount:,.0f} {'✓' if total_match else '✗'} (mong đợi: {expected_total:,})")

    if months_match and mbqtl_match and total_match:
        print("\n✅ PASS - Tất cả kết quả khớp với tài liệu!")
    else:
        print("\n❌ FAIL - Có sự khác biệt so với tài liệu")

    return months_match and mbqtl_match and total_match


def test_simple_example():
    """Test with simple example from documentation header"""
    print("\n\n" + "=" * 80)
    print("Testing với ví dụ đơn giản: 1 năm, 50 triệu/tháng")
    print("=" * 80)

    periods = [
        PeriodSchema(
            start_date="2025-01-01",
            end_date="2025-12-31",
            monthly_salary=50000000
        ),
    ]

    coefficients = [
        Coefficient(year=2025, coefficient=1.0, is_active=True),
    ]

    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)

    print(f"\nTổng số tháng: {result.total_months}")
    print(f"MBQTL: {result.average_salary:,.0f} VND")
    print(f"Tổng tiền: {result.total_amount:,.0f} VND")

    # For 1 year from 2025, should use multiplier 2.0
    # Expected: 50,000,000 × 1 × 2.0 = 100,000,000
    expected = 100000000
    match = abs(result.total_amount - expected) < 100

    print(f"\nKết quả mong đợi: {expected:,} VND")
    print(f"Kết quả: {'✓ PASS' if match else '✗ FAIL'}")

    return match


def test_less_than_1_year():
    """Test special case: less than 1 year"""
    print("\n\n" + "=" * 80)
    print("Testing trường hợp đặc biệt: Dưới 1 năm (6 tháng)")
    print("=" * 80)

    periods = [
        PeriodSchema(
            start_date="2024-01-01",
            end_date="2024-06-30",
            monthly_salary=10000000
        ),
    ]

    coefficients = [
        Coefficient(year=2024, coefficient=1.0, is_active=True),
    ]

    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)

    print(f"\nTổng số tháng: {result.total_months}")
    print(f"MBQTL: {result.average_salary:,.0f} VND")
    print(f"Tổng tiền: {result.total_amount:,.0f} VND")

    # For < 1 year: min(22% × total_adjusted, 2 × MBQTL)
    # total_adjusted = 10M × 1.0 × 6 = 60M
    # 22% × 60M = 13.2M
    # 2 × 10M = 20M
    # Result should be 13.2M (min of two)
    expected = 13200000
    match = abs(result.total_amount - expected) < 100

    print(f"\nCông thức đặc biệt: min(22% × tổng lương điều chỉnh, 2 × MBQTL)")
    print(f"Kết quả mong đợi: {expected:,} VND")
    print(f"Kết quả: {'✓ PASS' if match else '✗ FAIL'}")

    return match


def test_period_crossing_2014():
    """Test period that crosses the 2014 cutoff"""
    print("\n\n" + "=" * 80)
    print("Testing giai đoạn vượt qua năm 2014")
    print("=" * 80)

    periods = [
        PeriodSchema(
            start_date="2013-01-01",
            end_date="2015-12-31",
            monthly_salary=5000000
        ),
    ]

    # Use realistic coefficients for those years
    coefficients = [
        Coefficient(year=2013, coefficient=1.33, is_active=True),
        Coefficient(year=2014, coefficient=1.27, is_active=True),
        Coefficient(year=2015, coefficient=1.27, is_active=True),
    ]

    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)

    print(f"\nTổng số tháng: {result.total_months}")
    print(f"Số giai đoạn sau khi split: {len(result.period_breakdowns)}")

    for i, breakdown in enumerate(result.period_breakdowns):
        era = "trước 2014" if breakdown.is_pre_2014 else "từ 2014"
        print(f"\nGiai đoạn {i+1} ({era}): {breakdown.start_date} đến {breakdown.end_date}")
        print(f"  - Số tháng: {breakdown.months}")
        print(f"  - Hệ số nhân: {breakdown.multiplier}")

    print(f"\nMBQTL: {result.average_salary:,.0f} VND")
    print(f"Tổng tiền: {result.total_amount:,.0f} VND")

    # Should have been split into 2 periods: 2013 (12 months) and 2014-2015 (24 months)
    has_split = len(result.period_breakdowns) == 2
    print(f"\nĐã split giai đoạn: {'✓ PASS' if has_split else '✗ FAIL'}")

    return has_split


if __name__ == "__main__":
    print("\n🧪 BẮT ĐẦU KIỂM TRA CÁC TÍNH NĂNG\n")

    tests = [
        ("Ví dụ Đỗ Quỳnh Mai", test_mai_example),
        ("Ví dụ đơn giản 1 năm", test_simple_example),
        ("Trường hợp < 1 năm", test_less_than_1_year),
        ("Giai đoạn vượt 2014", test_period_crossing_2014),
    ]

    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"\n❌ LỖI: {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))

    # Summary
    print("\n\n" + "=" * 80)
    print("TÓM TẮT KẾT QUẢ")
    print("=" * 80)

    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {name}")

    total_tests = len(results)
    passed_tests = sum(1 for _, p in results if p)
    print(f"\nTổng: {passed_tests}/{total_tests} tests passed")

    if passed_tests == total_tests:
        print("\n🎉 TẤT CẢ TESTS PASSED!")
    else:
        print(f"\n⚠️  {total_tests - passed_tests} tests failed")
