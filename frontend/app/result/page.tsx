'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, TrendingUp, Calendar, DollarSign, Sparkles, Award, ChevronRight } from 'lucide-react';
import { useCalculationStore } from '@/lib/store/calculationStore';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export default function ResultPage() {
  const router = useRouter();
  const { calculationResult } = useCalculationStore();

  useEffect(() => {
    if (!calculationResult) {
      router.push('/');
    }
  }, [calculationResult, router]);

  if (!calculationResult) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 to-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="aurora-bg absolute inset-0" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-success/20 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-text-secondary hover:text-primary mb-8 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span className="font-medium">Quay lại</span>
          </button>

          {/* Total Amount - Premium Card */}
          <div className="card-premium p-10 mb-8 text-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent opacity-90" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/20" />

            {/* Sparkle Effects */}
            <Sparkles className="absolute top-6 right-6 w-8 h-8 text-white/30 animate-pulse" aria-hidden="true" />
            <Sparkles className="absolute bottom-6 left-6 w-6 h-6 text-white/20 animate-pulse" style={{ animationDelay: '1s' }} aria-hidden="true" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Award className="w-5 h-5 text-white" aria-hidden="true" />
                <span className="text-sm font-semibold text-white">KẾT QUẢ TÍNH TOÁN</span>
              </div>

              <h2 className="text-lg font-medium mb-3 text-white/90 uppercase tracking-wide">
                Tổng số tiền nhận được
              </h2>

              <p className="text-6xl md:text-7xl font-heading font-bold mb-4 text-white text-gradient-white animate-pulse-glow">
                {formatCurrency(calculationResult.total_amount)}
              </p>

              <div className="flex items-center justify-center gap-2 text-white/80">
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
                <p className="text-lg">
                  Mức bình quân: <span className="font-bold text-white">{formatCurrency(calculationResult.average_salary)}</span> / tháng
                </p>
              </div>
            </div>
          </div>

          {/* Summary Stats - Fintech Metric Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="metric-card group hover:shadow-premium cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-7 h-7 text-primary" aria-hidden="true" />
                </div>
                <ChevronRight className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" aria-hidden="true" />
              </div>
              <p className="text-4xl font-heading font-bold text-text-primary mb-2">
                {calculationResult.total_months}
              </p>
              <p className="text-sm font-semibold text-text-secondary">Tổng tháng đóng góp</p>
              <div className="mt-3 pt-3 border-t border-border-light">
                <p className="text-xs text-text-muted">
                  ≈ {(calculationResult.total_months / 12).toFixed(1)} năm
                </p>
              </div>
            </div>

            <div className="metric-card group hover:shadow-premium cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <TrendingUp className="w-7 h-7 text-success" aria-hidden="true" />
                </div>
                <ChevronRight className="w-6 h-6 text-text-muted group-hover:text-success transition-colors" aria-hidden="true" />
              </div>
              <p className="text-4xl font-heading font-bold text-text-primary mb-2">
                {calculationResult.period_breakdowns.length}
              </p>
              <p className="text-sm font-semibold text-text-secondary">Giai đoạn đóng BHXH</p>
              <div className="mt-3 pt-3 border-t border-border-light">
                <p className="text-xs text-success font-medium">
                  Đã phân tích chi tiết
                </p>
              </div>
            </div>

            <div className="metric-card group hover:shadow-premium cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <DollarSign className="w-7 h-7 text-accent" aria-hidden="true" />
                </div>
                <ChevronRight className="w-6 h-6 text-text-muted group-hover:text-accent transition-colors" aria-hidden="true" />
              </div>
              <p className="text-4xl font-heading font-bold text-text-primary mb-2 overflow-hidden text-ellipsis">
                {formatCurrency(calculationResult.average_salary)}
              </p>
              <p className="text-sm font-semibold text-text-secondary">Lương bình quân</p>
              <div className="mt-3 pt-3 border-t border-border-light">
                <p className="text-xs text-text-muted">
                  Đã điều chỉnh hệ số
                </p>
              </div>
            </div>
          </div>

          {/* Period Breakdowns - Premium Glass Cards */}
          <div className="card-glass p-8 mb-8 rounded-3xl">
            <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-text-primary">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              Chi Tiết Từng Giai Đoạn
            </h3>

            <div className="space-y-4">
              {calculationResult.period_breakdowns.map((breakdown, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-premium cursor-default ${
                    breakdown.is_pre_2014
                      ? 'bg-gradient-to-br from-blue-50/50 to-blue-100/30 border-blue-300/50'
                      : 'bg-gradient-to-br from-green-50/50 to-green-100/30 border-green-300/50'
                  }`}
                >
                  {/* Top Gradient Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    breakdown.is_pre_2014 ? 'bg-gradient-to-r from-blue-500 to-blue-300' : 'bg-gradient-to-r from-green-500 to-green-300'
                  }`} />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-heading font-bold text-xl text-text-primary">
                          Giai đoạn {index + 1}
                        </h4>
                        <span
                          className={`badge ${
                            breakdown.is_pre_2014
                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                              : 'bg-green-100 text-green-700 border-green-300'
                          }`}
                        >
                          {breakdown.is_pre_2014 ? 'Trước 2014 (×1.5)' : 'Từ 2014 (×2.0)'}
                        </span>
                      </div>

                      <p className="text-sm text-text-secondary mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        {formatDate(breakdown.start_date)} - {formatDate(breakdown.end_date)}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-surface/60 backdrop-blur-sm p-3 rounded-xl">
                          <p className="text-xs text-text-muted mb-1">Số tháng</p>
                          <p className="text-lg font-bold text-text-primary">{breakdown.months}</p>
                        </div>
                        <div className="bg-surface/60 backdrop-blur-sm p-3 rounded-xl">
                          <p className="text-xs text-text-muted mb-1">Lương gốc</p>
                          <p className="text-lg font-bold text-text-primary">
                            {formatCurrency(breakdown.original_salary)}
                          </p>
                        </div>
                        <div className="bg-surface/60 backdrop-blur-sm p-3 rounded-xl">
                          <p className="text-xs text-text-muted mb-1">Hệ số</p>
                          <p className="text-lg font-bold text-accent">{breakdown.coefficient.toFixed(3)}</p>
                        </div>
                        <div className="bg-surface/60 backdrop-blur-sm p-3 rounded-xl">
                          <p className="text-xs text-text-muted mb-1">Sau điều chỉnh</p>
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(breakdown.adjusted_salary)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-text-muted mb-1">Số tiền giai đoạn</p>
                      <p className="text-3xl font-heading font-bold text-gradient">
                        {formatCurrency(breakdown.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formula Explanation - Glass Card */}
          <div className="card-glass p-8 mb-8 rounded-3xl">
            <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-text-primary">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              Giải Thích Công Thức
            </h3>

            <div className="bg-slate-900 p-6 rounded-2xl mb-6 border border-slate-700">
              <p className="font-mono text-sm text-secondary font-medium">
                {calculationResult.explanation.formula}
              </p>
            </div>

            <div className="space-y-4">
              {calculationResult.explanation.steps.map((step) => (
                <div key={step.step} className="flex gap-4 bg-surface/60 backdrop-blur-sm p-5 rounded-2xl border border-border-light hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-glow">
                    {step.step}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold mb-2 text-text-primary">{step.description}</p>
                    <p className="text-sm text-text-secondary font-mono bg-slate-50 p-3 rounded-lg border border-border-light">
                      {step.calculation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions - Premium Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => router.push('/')}
              className="btn btn-outline flex-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
              Tính lại
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              Xuất PDF
            </button>
          </div>

          {/* Disclaimer - Glass Badge */}
          <div className="card-glass p-6 rounded-2xl border-l-4 border-warning">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-warning" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-text-primary mb-1">Lưu ý quan trọng</p>
                <p className="text-sm text-text-secondary">
                  Kết quả tính toán chỉ mang tính chất tham khảo.
                  Vui lòng liên hệ cơ quan BHXH để được tư vấn chính thức và kiểm tra chính xác.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
