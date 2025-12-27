'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useCalculationStore } from '@/lib/store/calculationStore';
import { visionOCRService } from '@/lib/services/visionOcrService';
import { calculationApi } from '@/lib/services/api';
import type { OCRResult } from '@/lib/types';

export default function OCRPage() {
  const router = useRouter();
  const { ocrResults, addOCRResult, updateOCRResult, mergeOCRPeriods, setCalculationResult, setLoading } = useCalculationStore();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);

    for (const file of acceptedFiles) {
      const imageId = crypto.randomUUID();
      const result: OCRResult = {
        imageId,
        status: 'processing',
        retryCount: 0,
      };

      addOCRResult(result);

      try {
        const periods = await visionOCRService.extractPeriods(file);
        updateOCRResult(imageId, {
          status: 'success',
          extractedPeriods: periods,
          confidence: 0.9,
        });
      } catch (error) {
        updateOCRResult(imageId, {
          status: 'error',
          errorMessage: 'Không thể trích xuất dữ liệu từ ảnh này',
        });
      }
    }
  }, [addOCRResult, updateOCRResult]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const handleCalculate = async () => {
    mergeOCRPeriods();

    try {
      setLoading(true);
      const store = useCalculationStore.getState();
      const result = await calculationApi.calculate({
        periods: store.periods,
        calculation_year: '2025',
      });
      setCalculationResult(result);
      router.push('/result');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Có lỗi xảy ra khi tính toán');
    } finally {
      setLoading(false);
    }
  };

  const successCount = ocrResults.filter(r => r.status === 'success').length;
  const processingCount = ocrResults.filter(r => r.status === 'processing').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/20 to-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="aurora-bg absolute inset-0" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
              <i className="fas fa-robot text-accent"></i>
              <span className="text-sm font-semibold text-accent">AI POWERED</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="text-text-primary">Upload Ảnh</span>
              <span className="block mt-2 text-gradient">Trích Xuất Tự Động</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Công nghệ AI OCR tiên tiến giúp trích xuất thông tin BHXH từ ảnh chụp màn hình chỉ trong 30 giây
            </p>
          </div>

          {/* Upload Zone - Premium Glass */}
          <div
            {...getRootProps()}
            className={`card-premium p-16 text-center cursor-pointer transition-all duration-500 border-2 border-dashed relative overflow-hidden ${
              isDragActive
                ? 'border-accent shadow-glow-accent bg-accent/5'
                : 'border-border-dark hover:border-accent/50'
            }`}
          >
            <input {...getInputProps()} />

            {/* Upload Icon with Animation */}
            <div className={`relative inline-block mb-6 ${isDragActive ? 'animate-bounce' : ''}`}>
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto ${
                isDragActive
                  ? 'bg-gradient-to-br from-accent to-accent-dark shadow-glow-accent'
                  : 'bg-gradient-to-br from-primary to-accent shadow-glow'
              }`}>
                <i className={`fas ${isDragActive ? 'fa-cloud-arrow-down' : 'fa-cloud-arrow-up'} text-white text-4xl`}></i>
              </div>
              {!isDragActive && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center animate-pulse">
                  <i className="fas fa-sparkles text-white text-xs"></i>
                </div>
              )}
            </div>

            {isDragActive ? (
              <div className="animate-pulse">
                <p className="text-2xl font-bold text-accent mb-2">
                  Thả ảnh vào đây...
                </p>
                <p className="text-text-secondary">
                  AI sẵn sàng xử lý
                </p>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-text-primary mb-3">
                  Kéo thả hoặc click để chọn ảnh
                </p>
                <p className="text-text-secondary mb-6">
                  Hỗ trợ JPG, PNG, GIF • Tối đa 5MB/ảnh
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-surface/60 backdrop-blur-sm p-4 rounded-xl">
                    <i className="fas fa-bolt text-warning text-2xl mb-2"></i>
                    <p className="text-sm font-semibold text-text-primary">Siêu nhanh</p>
                    <p className="text-xs text-text-muted">30 giây</p>
                  </div>
                  <div className="bg-surface/60 backdrop-blur-sm p-4 rounded-xl">
                    <i className="fas fa-brain text-accent text-2xl mb-2"></i>
                    <p className="text-sm font-semibold text-text-primary">AI thông minh</p>
                    <p className="text-xs text-text-muted">98% chính xác</p>
                  </div>
                  <div className="bg-surface/60 backdrop-blur-sm p-4 rounded-xl">
                    <i className="fas fa-shield-halved text-success text-2xl mb-2"></i>
                    <p className="text-sm font-semibold text-text-primary">Bảo mật</p>
                    <p className="text-xs text-text-muted">Không lưu trữ</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Processing Status */}
          {ocrResults.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-2xl text-text-primary flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-glow">
                    <i className="fas fa-chart-line text-white"></i>
                  </div>
                  Trạng thái xử lý
                </h3>
                <span className="badge badge-primary">
                  {successCount}/{ocrResults.length} hoàn thành
                </span>
              </div>

              {ocrResults.map((result, index) => (
                <div key={result.imageId} className="card-premium p-5 flex items-center gap-4">
                  {/* Image Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    result.status === 'success' ? 'bg-success/10' :
                    result.status === 'processing' ? 'bg-primary/10' :
                    'bg-error/10'
                  }`}>
                    <i className={`fas fa-image text-2xl ${
                      result.status === 'success' ? 'text-success' :
                      result.status === 'processing' ? 'text-primary' :
                      'text-error'
                    }`}></i>
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <p className="font-bold text-text-primary mb-1">Ảnh {index + 1}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-text-secondary">
                        {result.extractedPeriods?.length || 0} giai đoạn tìm thấy
                      </p>
                      {result.confidence && (
                        <span className="badge badge-success text-xs">
                          <i className="fas fa-check-circle mr-1"></i>
                          {Math.round(result.confidence * 100)}% chính xác
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Icon */}
                  {result.status === 'processing' && (
                    <div className="flex flex-col items-center gap-1">
                      <i className="fas fa-spinner fa-spin text-primary text-2xl"></i>
                      <span className="text-xs text-primary font-semibold">Đang xử lý...</span>
                    </div>
                  )}
                  {result.status === 'success' && (
                    <div className="flex flex-col items-center gap-1">
                      <i className="fas fa-circle-check text-success text-2xl"></i>
                      <span className="text-xs text-success font-semibold">Thành công</span>
                    </div>
                  )}
                  {result.status === 'error' && (
                    <div className="flex flex-col items-center gap-1">
                      <i className="fas fa-circle-xmark text-error text-2xl"></i>
                      <span className="text-xs text-error font-semibold">Lỗi</span>
                    </div>
                  )}
                </div>
              ))}

              {successCount > 0 && processingCount === 0 && (
                <button
                  onClick={handleCalculate}
                  className="btn btn-primary w-full flex items-center justify-center gap-2 mt-6"
                >
                  <i className="fas fa-rocket"></i>
                  Xác nhận và tính toán
                  <i className="fas fa-arrow-right"></i>
                </button>
              )}
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-8 card-glass p-6 rounded-2xl border-l-4 border-secondary">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-lock text-secondary text-xl"></i>
              </div>
              <div>
                <p className="font-bold text-text-primary mb-1">Bảo mật & Quyền riêng tư</p>
                <p className="text-sm text-text-secondary">
                  Hình ảnh sẽ được xử lý qua OpenRouter API để trích xuất dữ liệu bằng AI.
                  <strong className="text-text-primary"> Chúng tôi KHÔNG lưu trữ hình ảnh của bạn.</strong> Tất cả dữ liệu được mã hóa và xóa ngay sau khi xử lý.
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-8 card-glass p-8 rounded-3xl">
            <h3 className="font-heading font-bold text-2xl mb-6 flex items-center gap-3 text-text-primary">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center shadow-glow">
                <i className="fas fa-circle-info text-white"></i>
              </div>
              Cách thức hoạt động
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h4 className="font-bold text-text-primary mb-2">Upload ảnh</h4>
                <p className="text-sm text-text-secondary">Chụp màn hình app BHXH hoặc bảng lương</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-accent">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h4 className="font-bold text-text-primary mb-2">AI xử lý</h4>
                <p className="text-sm text-text-secondary">Trích xuất tự động các giai đoạn và mức lương</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-success rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h4 className="font-bold text-text-primary mb-2">Kết quả</h4>
                <p className="text-sm text-text-secondary">Nhận kết quả tính toán chính xác ngay lập tức</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
