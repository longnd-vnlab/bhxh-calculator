'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculationStore } from '@/lib/store/calculationStore';
import { calculationApi } from '@/lib/services/api';
import type { Period } from '@/lib/types';
import MonthYearInput from '@/components/MonthYearInput';
import {
  validatePeriods,
  getFieldError,
  hasPeriodErrors,
  type ValidationResult,
} from '@/lib/utils/periodValidation';

export default function ManualInputPage() {
  const router = useRouter();
  const { periods, addPeriod, removePeriod, updatePeriod, setCalculationResult, setLoading } = useCalculationStore();
  const [error, setError] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleAddPeriod = () => {
    const newPeriod: Period = {
      id: crypto.randomUUID(),
      start_date: '',
      end_date: '',
      monthly_salary: 0,
    };
    addPeriod(newPeriod);

    if (hasAttemptedSubmit) {
      setValidationResult({ isValid: true, errors: [] });
      setError('');
      setHasAttemptedSubmit(false);
    }
  };

  const formatMonthForAPI = (monthValue: string): string => {
    if (!monthValue) return '';
    const [year, month] = monthValue.split('-');
    return `${month}/${year}`;
  };

  const handleCalculate = async () => {
    setError('');
    setHasAttemptedSubmit(true);

    const result = validatePeriods(periods);
    setValidationResult(result);

    if (result.globalError) {
      setError(result.globalError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!result.isValid) {
      setError(
        `Có ${result.errors.length} lỗi cần sửa. Vui lòng kiểm tra các giai đoạn bên dưới.`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);

      const formattedPeriods = periods.map((period) => ({
        start_date: formatMonthForAPI(period.start_date),
        end_date: formatMonthForAPI(period.end_date),
        monthly_salary: period.monthly_salary,
      }));

      const apiResult = await calculationApi.calculate({
        periods: formattedPeriods,
        calculation_year: '2025',
      });
      setCalculationResult(apiResult);
      router.push('/result');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra khi tính toán');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 to-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="aurora-bg absolute inset-0" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <i className="fas fa-keyboard text-primary"></i>
              <span className="text-sm font-semibold text-primary">NHẬP THỦ CÔNG</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="text-text-primary">Nhập Thông Tin</span>
              <span className="block mt-2 text-gradient">BHXH Chi Tiết</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Nhập từng giai đoạn đóng BHXH và mức lương để tính toán chính xác
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 card-glass p-5 rounded-2xl border-l-4 border-error" role="alert">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-error/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-error text-xl"></i>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-error mb-1">Có lỗi xảy ra</p>
                  <p className="text-error text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Validation Summary */}
          {!validationResult.isValid && validationResult.errors.length > 0 && (
            <div className="mb-6 card-glass p-5 rounded-2xl border-l-4 border-warning">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-triangle-exclamation text-warning text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-warning mb-3">
                    Phát hiện {validationResult.errors.length} lỗi cần sửa:
                  </h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    {validationResult.errors.slice(0, 5).map((err, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <i className="fas fa-circle text-warning text-xs mt-1"></i>
                        <span>{err.message}</span>
                      </li>
                    ))}
                    {validationResult.errors.length > 5 && (
                      <li className="text-warning italic">
                        ... và {validationResult.errors.length - 5} lỗi khác
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Periods List */}
          <div className="space-y-6 mb-8">
            {periods.length === 0 && (
              <div className="card-premium p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <i className="fas fa-folder-open text-white text-3xl"></i>
                </div>
                <p className="text-text-muted text-lg mb-6">Chưa có giai đoạn nào</p>
                <button onClick={handleAddPeriod} className="btn btn-primary">
                  <i className="fas fa-plus mr-2"></i>
                  Thêm giai đoạn đầu tiên
                </button>
              </div>
            )}

            {periods.map((period, index) => {
              const hasErrors = hasPeriodErrors(period.id, validationResult);
              const startDateError = getFieldError(period.id, 'start_date', validationResult);
              const endDateError = getFieldError(period.id, 'end_date', validationResult);
              const salaryError = getFieldError(period.id, 'monthly_salary', validationResult);

              return (
                <div
                  key={period.id}
                  className={`card-premium p-6 ${
                    hasErrors ? 'border-2 border-error/50' : ''
                  }`}
                >
                  {/* Period Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-glow">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-text-primary">
                          Giai đoạn {index + 1}
                        </h3>
                        {hasErrors && (
                          <span className="flex items-center gap-1 text-error text-sm mt-1">
                            <i className="fas fa-triangle-exclamation"></i>
                            Có lỗi cần sửa
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removePeriod(period.id)}
                      className="w-10 h-10 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>

                  {/* Input Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <MonthYearInput
                      label="Từ tháng/năm"
                      value={period.start_date}
                      onChange={(value) =>
                        updatePeriod(period.id, { start_date: value })
                      }
                      placeholder="01/2021"
                      error={startDateError}
                    />

                    <MonthYearInput
                      label="Đến tháng/năm"
                      value={period.end_date}
                      onChange={(value) =>
                        updatePeriod(period.id, { end_date: value })
                      }
                      placeholder="12/2021"
                      error={endDateError}
                    />

                    <div className="md:col-span-2">
                      <label className="label flex items-center gap-2">
                        <i className="fas fa-dollar-sign text-primary"></i>
                        Mức lương tháng (VNĐ)
                      </label>
                      <input
                        type="number"
                        value={period.monthly_salary || ''}
                        onChange={(e) =>
                          updatePeriod(period.id, {
                            monthly_salary: parseFloat(e.target.value) || 0,
                          })
                        }
                        className={`input-field ${
                          salaryError ? 'border-error' : ''
                        }`}
                        placeholder="5,000,000"
                      />
                      {salaryError ? (
                        <p className="text-xs text-error mt-2 flex items-center gap-1">
                          <i className="fas fa-circle-exclamation"></i>
                          {salaryError}
                        </p>
                      ) : (
                        <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                          <i className="fas fa-info-circle"></i>
                          Ví dụ: 5000000 (5 triệu đồng)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          {periods.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddPeriod}
                className="btn btn-outline flex-1 flex items-center justify-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Thêm giai đoạn
              </button>

              <button
                onClick={handleCalculate}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <i className="fas fa-calculator"></i>
                Tính toán ngay
              </button>
            </div>
          )}

          {/* Help Section */}
          <div className="card-glass p-8 rounded-3xl">
            <h3 className="font-heading font-bold text-2xl mb-6 flex items-center gap-3 text-text-primary">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-glow">
                <i className="fas fa-lightbulb text-white"></i>
              </div>
              Hướng dẫn nhập liệu
            </h3>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li className="flex items-start gap-3 bg-surface/60 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-keyboard text-primary"></i>
                </div>
                <div>
                  <strong className="text-text-primary">Gõ trực tiếp</strong> định dạng MM/YYYY (ví dụ: 01/2021) - Dấu / sẽ tự động xuất hiện khi bạn gõ
                </div>
              </li>
              <li className="flex items-start gap-3 bg-surface/60 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-calendar-check text-success"></i>
                </div>
                <div>
                  Hệ thống tự động tính từ đầu tháng đến cuối tháng (ví dụ: 01/2021 = từ 01/01/2021 đến 31/01/2021)
                </div>
              </li>
              <li className="flex items-start gap-3 bg-surface/60 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-list-check text-accent"></i>
                </div>
                <div>
                  Nhập từng giai đoạn đóng BHXH từ tháng bắt đầu đến tháng kết thúc
                </div>
              </li>
              <li className="flex items-start gap-3 bg-surface/60 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-ban text-warning"></i>
                </div>
                <div>
                  Các giai đoạn không được chồng lấp thời gian
                </div>
              </li>
              <li className="flex items-start gap-3 bg-surface/60 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-chart-line text-secondary"></i>
                </div>
                <div>
                  Hệ số trượt giá sẽ được tự động áp dụng theo năm đóng
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
