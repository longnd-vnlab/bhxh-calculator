import type { Period } from '@/lib/types';

export interface ValidationError {
  periodId: string;
  field?: 'start_date' | 'end_date' | 'monthly_salary';
  message: string;
  type: 'range' | 'overlap' | 'required' | 'invalid';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  globalError?: string;
}

/**
 * Convert MM/YYYY or YYYY-MM to Date object (first day of month)
 */
function parseMonthYear(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Handle YYYY-MM format
  if (dateStr.match(/^\d{4}-\d{2}/)) {
    const [year, month] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  }

  // Handle MM/YYYY format
  if (dateStr.match(/^\d{2}\/\d{4}/)) {
    const [month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  }

  return null;
}

/**
 * Get last day of month for a given date
 */
function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Format date for display in error messages
 */
function formatDateForDisplay(dateStr: string): string {
  const date = parseMonthYear(dateStr);
  if (!date) return dateStr;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${year}`;
}

/**
 * Check if two date ranges overlap
 */
function doPeriodsOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  // Get end of months
  const end1OfMonth = getEndOfMonth(end1);
  const end2OfMonth = getEndOfMonth(end2);

  // Check if ranges overlap
  // Range1: [start1, end1]
  // Range2: [start2, end2]
  // Overlap if: start1 <= end2 AND start2 <= end1
  return start1 <= end2OfMonth && start2 <= end1OfMonth;
}

/**
 * Validate all periods
 */
export function validatePeriods(periods: Period[]): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if there are any periods
  if (periods.length === 0) {
    return {
      isValid: false,
      errors: [],
      globalError: 'Vui lòng thêm ít nhất một giai đoạn đóng BHXH',
    };
  }

  // Validate each period individually
  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];

    // 1. Check required fields
    if (!period.start_date) {
      errors.push({
        periodId: period.id,
        field: 'start_date',
        message: `Giai đoạn ${i + 1}: Vui lòng nhập tháng bắt đầu`,
        type: 'required',
      });
    }

    if (!period.end_date) {
      errors.push({
        periodId: period.id,
        field: 'end_date',
        message: `Giai đoạn ${i + 1}: Vui lòng nhập tháng kết thúc`,
        type: 'required',
      });
    }

    if (!period.monthly_salary || period.monthly_salary <= 0) {
      errors.push({
        periodId: period.id,
        field: 'monthly_salary',
        message: `Giai đoạn ${i + 1}: Vui lòng nhập mức lương hợp lệ`,
        type: 'required',
      });
    }

    // 2. Check date range validity (start <= end)
    if (period.start_date && period.end_date) {
      const startDate = parseMonthYear(period.start_date);
      const endDate = parseMonthYear(period.end_date);

      if (!startDate) {
        errors.push({
          periodId: period.id,
          field: 'start_date',
          message: `Giai đoạn ${i + 1}: Tháng bắt đầu không hợp lệ`,
          type: 'invalid',
        });
      }

      if (!endDate) {
        errors.push({
          periodId: period.id,
          field: 'end_date',
          message: `Giai đoạn ${i + 1}: Tháng kết thúc không hợp lệ`,
          type: 'invalid',
        });
      }

      if (startDate && endDate && startDate > endDate) {
        errors.push({
          periodId: period.id,
          field: 'end_date',
          message: `Giai đoạn ${i + 1}: Tháng kết thúc phải sau hoặc bằng tháng bắt đầu (${formatDateForDisplay(
            period.start_date
          )} - ${formatDateForDisplay(period.end_date)})`,
          type: 'range',
        });
      }
    }

    // 3. Check for unrealistic date ranges
    if (period.start_date && period.end_date) {
      const startDate = parseMonthYear(period.start_date);
      const endDate = parseMonthYear(period.end_date);

      if (startDate && endDate) {
        // Check if date is too far in the past
        const minYear = 1990;
        if (startDate.getFullYear() < minYear) {
          errors.push({
            periodId: period.id,
            field: 'start_date',
            message: `Giai đoạn ${i + 1}: Năm không được trước ${minYear}`,
            type: 'invalid',
          });
        }

        // Check if date is in the future
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 12); // Allow up to 1 year in future

        if (endDate > maxDate) {
          errors.push({
            periodId: period.id,
            field: 'end_date',
            message: `Giai đoạn ${i + 1}: Tháng kết thúc không được quá xa trong tương lai`,
            type: 'invalid',
          });
        }

        // Check if period is too long (e.g., > 50 years)
        const monthsDiff =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());

        if (monthsDiff > 600) {
          // 50 years
          errors.push({
            periodId: period.id,
            field: 'end_date',
            message: `Giai đoạn ${i + 1}: Khoảng thời gian quá dài (vượt quá 50 năm)`,
            type: 'range',
          });
        }
      }
    }

    // 4. Check salary validity
    if (period.monthly_salary) {
      // Minimum wage check (adjust as needed)
      const minSalary = 1000000; // 1 million VND
      const maxSalary = 1000000000; // 1 billion VND

      if (period.monthly_salary < minSalary) {
        errors.push({
          periodId: period.id,
          field: 'monthly_salary',
          message: `Giai đoạn ${i + 1}: Mức lương quá thấp (tối thiểu ${minSalary.toLocaleString()} VNĐ)`,
          type: 'invalid',
        });
      }

      if (period.monthly_salary > maxSalary) {
        errors.push({
          periodId: period.id,
          field: 'monthly_salary',
          message: `Giai đoạn ${i + 1}: Mức lương quá cao (tối đa ${maxSalary.toLocaleString()} VNĐ)`,
          type: 'invalid',
        });
      }
    }
  }

  // 5. Check for overlapping periods
  for (let i = 0; i < periods.length; i++) {
    const period1 = periods[i];

    if (!period1.start_date || !period1.end_date) continue;

    const start1 = parseMonthYear(period1.start_date);
    const end1 = parseMonthYear(period1.end_date);

    if (!start1 || !end1) continue;

    for (let j = i + 1; j < periods.length; j++) {
      const period2 = periods[j];

      if (!period2.start_date || !period2.end_date) continue;

      const start2 = parseMonthYear(period2.start_date);
      const end2 = parseMonthYear(period2.end_date);

      if (!start2 || !end2) continue;

      if (doPeriodsOverlap(start1, end1, start2, end2)) {
        errors.push({
          periodId: period1.id,
          field: 'end_date',
          message: `Giai đoạn ${i + 1} (${formatDateForDisplay(
            period1.start_date
          )} - ${formatDateForDisplay(
            period1.end_date
          )}) bị chồng chéo với giai đoạn ${j + 1} (${formatDateForDisplay(
            period2.start_date
          )} - ${formatDateForDisplay(period2.end_date)})`,
          type: 'overlap',
        });

        errors.push({
          periodId: period2.id,
          field: 'start_date',
          message: `Giai đoạn ${j + 1} (${formatDateForDisplay(
            period2.start_date
          )} - ${formatDateForDisplay(
            period2.end_date
          )}) bị chồng chéo với giai đoạn ${i + 1} (${formatDateForDisplay(
            period1.start_date
          )} - ${formatDateForDisplay(period1.end_date)})`,
          type: 'overlap',
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get errors for a specific period
 */
export function getPeriodErrors(
  periodId: string,
  validationResult: ValidationResult
): ValidationError[] {
  return validationResult.errors.filter((error) => error.periodId === periodId);
}

/**
 * Get errors for a specific field in a period
 */
export function getFieldError(
  periodId: string,
  field: 'start_date' | 'end_date' | 'monthly_salary',
  validationResult: ValidationResult
): string | undefined {
  const error = validationResult.errors.find(
    (err) => err.periodId === periodId && err.field === field
  );
  return error?.message;
}

/**
 * Check if a period has any errors
 */
export function hasPeriodErrors(
  periodId: string,
  validationResult: ValidationResult
): boolean {
  return validationResult.errors.some((error) => error.periodId === periodId);
}
