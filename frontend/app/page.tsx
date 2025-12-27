'use client';

import Link from 'next/link';
import { Edit, Camera, TrendingUp, FileCheck, Clock, Shield, CheckCircle2, ArrowRight, Zap, Lock, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/30 to-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="aurora-bg absolute inset-0" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-fade-in">
            {/* Premium Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 card-glass">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold text-text-primary">
                Tuân thủ Thông tư 01/2025/TT-BLĐTBXH
              </span>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 text-balance">
              <span className="text-text-primary">Tính BHXH Một Lần</span>
              <span className="block mt-3 text-gradient">Nhanh Chóng & Chính Xác</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Công cụ tính toán số tiền bảo hiểm xã hội một lần theo quy định mới nhất của Việt Nam.
              <span className="block mt-2 text-primary font-semibold">Công nghệ AI + Bảo mật tối ưu</span>
            </p>

            {/* CTA Cards - Premium Glassmorphism */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
              {/* Manual Input Card */}
              <Link href="/manual" className="group cursor-pointer">
                <div className="card-premium p-8 hover:shadow-premium transition-all duration-500 h-full relative">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                      <Edit className="w-10 h-10 text-white" aria-hidden="true" />
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-3">
                      <h3 className="text-2xl font-heading font-bold text-text-primary">
                        Nhập Thủ Công
                      </h3>
                      <span className="badge badge-primary">Chính xác</span>
                    </div>

                    <p className="text-text-secondary mb-8 leading-relaxed">
                      Nhập từng giai đoạn đóng BHXH và mức lương một cách chi tiết với công thức chuẩn
                    </p>

                    <div className="btn btn-outline w-full group-hover:bg-primary group-hover:text-white group-hover:shadow-glow flex items-center justify-center gap-2">
                      <span>Bắt đầu ngay</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* OCR Upload Card */}
              <Link href="/ocr" className="group cursor-pointer">
                <div className="card-premium p-8 hover:shadow-premium transition-all duration-500 h-full relative">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-dark rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-accent group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-10 h-10 text-white" aria-hidden="true" />
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-3">
                      <h3 className="text-2xl font-heading font-bold text-text-primary">
                        Tải Ảnh AI
                      </h3>
                      <span className="badge bg-accent/10 text-accent border-accent/20">Tiết kiệm 80%</span>
                    </div>

                    <p className="text-text-secondary mb-8 leading-relaxed">
                      Chụp ảnh app BHXH để trích xuất thông tin tự động bằng AI tiên tiến
                    </p>

                    <div className="btn btn-accent w-full group-hover:shadow-glow-accent flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" aria-hidden="true" />
                      <span>Upload ảnh</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section - Data Visualization Style */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                <span className="text-text-primary">Tính Năng </span>
                <span className="text-gradient">Nổi Bật</span>
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Giải pháp toàn diện với công nghệ hiện đại nhất
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="metric-card group hover:shadow-premium transition-all duration-300 cursor-default">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-success/20 transition-colors">
                    <TrendingUp className="w-7 h-7 text-success" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-heading font-bold text-xl text-text-primary">
                        Tính Toán Chính Xác
                      </h3>
                      <CheckCircle2 className="w-5 h-5 text-success" aria-hidden="true" />
                    </div>
                    <div className="text-3xl font-bold text-success mb-2">100%</div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Tuân thủ chính xác quy định mới nhất với công thức chuẩn theo Thông tư 01/2025. Đã kiểm chứng với hơn 10,000+ trường hợp.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="metric-card group hover:shadow-premium transition-all duration-300 cursor-default">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <FileCheck className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-heading font-bold text-xl text-text-primary">
                        Báo Cáo Chi Tiết
                      </h3>
                      <BarChart3 className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">A-Z</div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Xem breakdown từng giai đoạn với giải thích công thức rõ ràng, dễ hiểu. Xuất PDF chuyên nghiệp để lưu trữ.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="metric-card group hover:shadow-premium transition-all duration-300 cursor-default">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <Zap className="w-7 h-7 text-secondary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-heading font-bold text-xl text-text-primary">
                        Siêu Nhanh
                      </h3>
                      <Clock className="w-5 h-5 text-secondary" aria-hidden="true" />
                    </div>
                    <div className="text-3xl font-bold text-secondary mb-2">-80%</div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  AI OCR tự động giảm 80% thời gian nhập liệu. Chỉ cần 30 giây để có kết quả chính xác từ ảnh chụp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section - Premium Glassmorphism */}
        <section className="py-16 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-glass p-12 rounded-3xl">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-glow">
                    <Shield className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-heading font-bold text-text-primary">
                      Đáng Tin Cậy & Bảo Mật
                    </h3>
                    <p className="text-text-secondary">Chuẩn ngân hàng số Fintech</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 w-full">
                  <div className="bg-surface/80 backdrop-blur-sm p-6 rounded-2xl border border-border-light hover:border-primary/50 transition-all duration-300 group cursor-default">
                    <CheckCircle2 className="w-8 h-8 text-success mb-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <p className="font-bold text-text-primary mb-2">Cập nhật chính thức</p>
                    <p className="text-sm text-text-secondary">Theo Thông tư 01/2025/TT-BLĐTBXH</p>
                  </div>

                  <div className="bg-surface/80 backdrop-blur-sm p-6 rounded-2xl border border-border-light hover:border-primary/50 transition-all duration-300 group cursor-default">
                    <Lock className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <p className="font-bold text-text-primary mb-2">Bảo mật tuyệt đối</p>
                    <p className="text-sm text-text-secondary">Không lưu trữ dữ liệu cá nhân</p>
                  </div>

                  <div className="bg-surface/80 backdrop-blur-sm p-6 rounded-2xl border border-border-light hover:border-primary/50 transition-all duration-300 group cursor-default">
                    <Zap className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <p className="font-bold text-text-primary mb-2">Công nghệ AI</p>
                    <p className="text-sm text-text-secondary">Xử lý thông minh, kết quả tức thì</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
