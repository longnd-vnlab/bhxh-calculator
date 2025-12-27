'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export default function GuidePage() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['module-1']));
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const toggleCompleted = (moduleId: string) => {
    const newCompleted = new Set(completedModules);
    if (newCompleted.has(moduleId)) {
      newCompleted.delete(moduleId);
    } else {
      newCompleted.add(moduleId);
    }
    setCompletedModules(newCompleted);
  };

  const modules: Module[] = [
    {
      id: 'module-1',
      title: 'Giới thiệu và Lưu ý quan trọng',
      description: 'Hiểu rõ BHXH một lần là gì và những điều cần biết trước khi quyết định',
      icon: 'fa-triangle-exclamation',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      id: 'module-2',
      title: 'Công thức tính BHXH một lần',
      description: 'Nắm vững công thức tính toán mức hưởng BHXH',
      icon: 'fa-calculator',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      id: 'module-3',
      title: 'Các bước tính toán chi tiết',
      description: 'Hướng dẫn từng bước để tính chính xác',
      icon: 'fa-list-check',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'module-4',
      title: 'Ví dụ minh họa thực tế',
      description: 'Áp dụng công thức với ví dụ cụ thể từ BHXH',
      icon: 'fa-file-lines',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      id: 'module-5',
      title: 'Quy tắc làm tròn thời gian',
      description: 'Cách làm tròn tháng lẻ thành năm theo quy định',
      icon: 'fa-clock',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      id: 'module-6',
      title: 'Câu hỏi thường gặp',
      description: 'Giải đáp các thắc mắc phổ biến về BHXH một lần',
      icon: 'fa-circle-question',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const completionPercentage = Math.round((completedModules.size / modules.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/20 to-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="aurora-bg absolute inset-0" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }} />

      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-r from-primary via-secondary to-accent text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-glow">
              <i className="fas fa-graduation-cap text-4xl"></i>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">
                Hướng Dẫn Tính BHXH Một Lần
              </h1>
              <p className="text-white/90 text-lg">
                Học cách tính mức hưởng Bảo hiểm xã hội một lần theo quy định chính thức
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card-glass p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-book text-2xl"></i>
                </div>
                <div>
                  <div className="text-3xl font-bold font-heading">{modules.length}</div>
                  <div className="text-sm text-white/80">Modules học tập</div>
                </div>
              </div>
            </div>
            <div className="card-glass p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-trophy text-2xl"></i>
                </div>
                <div>
                  <div className="text-3xl font-bold font-heading">{completionPercentage}%</div>
                  <div className="text-sm text-white/80">Hoàn thành</div>
                </div>
              </div>
            </div>
            <div className="card-glass p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-gift text-2xl"></i>
                </div>
                <div>
                  <div className="text-3xl font-bold font-heading">Miễn phí</div>
                  <div className="text-sm text-white/80">100% miễn phí</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-white/80">Tiến độ học tập</span>
              <span className="text-sm font-semibold">{completedModules.size}/{modules.length} modules</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500 shadow-glow"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/manual"
              className="btn btn-accent flex items-center gap-2"
            >
              <i className="fas fa-rocket"></i>
              Bắt đầu tính toán ngay
            </Link>
            <button
              onClick={() => {
                const firstIncomplete = modules.find(m => !completedModules.has(m.id));
                if (firstIncomplete) {
                  document.getElementById(firstIncomplete.id)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn btn-glass"
            >
              <i className="fas fa-play"></i>
              Tiếp tục học
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {modules.map((module, index) => {
            const isExpanded = expandedModules.has(module.id);
            const isCompleted = completedModules.has(module.id);

            return (
              <div
                key={module.id}
                id={module.id}
                className={`card-premium overflow-hidden ${
                  isCompleted ? 'border-2 border-success' : ''
                }`}
              >
                {/* Module Header */}
                <div
                  className={`${module.bgColor} p-6 cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-14 h-14 ${module.bgColor} rounded-2xl flex items-center justify-center border-2 ${isCompleted ? 'border-success' : 'border-border'} flex-shrink-0`}>
                        <i className={`fas ${module.icon} text-2xl ${module.color}`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`badge ${module.bgColor} ${module.color} border ${isCompleted ? 'border-success' : 'border-border'}`}>
                            Module {index + 1}
                          </span>
                          {isCompleted && (
                            <span className="badge badge-success">
                              <i className="fas fa-circle-check mr-1"></i>
                              Hoàn thành
                            </span>
                          )}
                        </div>
                        <h2 className={`text-2xl font-bold font-heading mb-2 ${module.color}`}>
                          {module.title}
                        </h2>
                        <p className="text-text-secondary">{module.description}</p>
                      </div>
                    </div>
                    <button className={`ml-4 p-2 hover:bg-white/50 rounded-lg transition-colors ${module.color}`}>
                      <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-xl`}></i>
                    </button>
                  </div>
                </div>

                {/* Module Content */}
                {isExpanded && (
                  <div className="p-6 bg-surface/50 backdrop-blur-sm animate-fade-in">
                    {/* Module 1: Giới thiệu */}
                    {module.id === 'module-1' && (
                      <div className="space-y-4">
                        <div className="card-glass p-6 rounded-2xl border-l-4 border-warning">
                          <h3 className="font-bold text-lg text-warning mb-4 flex items-center gap-2">
                            <i className="fas fa-triangle-exclamation"></i>
                            Lưu ý quan trọng trước khi nhận BHXH một lần
                          </h3>
                          <ul className="space-y-3 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                              <i className="fas fa-xmark text-error text-xl mt-0.5"></i>
                              <span>Mất quyền hưởng lương hưu hàng tháng khi về già</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <i className="fas fa-xmark text-error text-xl mt-0.5"></i>
                              <span>Không được cộng dồn thêm thời gian đóng BHXH</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <i className="fas fa-xmark text-error text-xl mt-0.5"></i>
                              <span>Mất quyền lợi trợ cấp mai táng và tử tuất</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <i className="fas fa-exclamation text-warning text-xl mt-0.5"></i>
                              <span className="font-semibold">Số tiền nhận thường ÍT HƠN tổng số tiền đã đóng</span>
                            </li>
                          </ul>
                        </div>

                        <div className="card-glass p-6 rounded-2xl border-l-4 border-primary">
                          <h3 className="font-bold text-lg text-primary mb-3 flex items-center gap-2">
                            <i className="fas fa-lightbulb"></i>
                            Khuyến nghị
                          </h3>
                          <p className="text-text-secondary text-sm">
                            Nếu bạn đã có <strong>10 năm đóng BHXH</strong>, nên cân nhắc tiếp tục đóng thêm để đủ <strong>20 năm hưởng lương hưu suốt đời</strong> thay vì nhận một lần.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Module 2: Công thức */}
                    {module.id === 'module-2' && (
                      <div className="space-y-4">
                        <div className="card-glass p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-4 text-secondary">Công thức tổng quát:</h3>
                          <div className="bg-slate-900 p-5 rounded-xl font-mono text-sm text-secondary">
                            <div className="mb-3 text-white">
                              <strong>Mức hưởng BHXH một lần</strong> = (Phần trước 2014) + (Phần từ 2014)
                            </div>
                            <div className="space-y-2 text-slate-300">
                              <div>Phần trước 2014 = <span className="text-success font-semibold">1.5</span> × MBQTL × Số năm trước 2014</div>
                              <div>Phần từ 2014 = <span className="text-success font-semibold">2.0</span> × MBQTL × Số năm từ 2014</div>
                            </div>
                          </div>
                        </div>

                        <div className="card-glass p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-4 text-success">Tính MBQTL (Mức Bình Quân Tiền Lương):</h3>
                          <div className="bg-slate-900 p-5 rounded-xl font-mono text-sm text-secondary">
                            <div className="mb-2 text-white">
                              <strong>MBQTL</strong> = Tổng tiền lương đã điều chỉnh / Tổng số tháng
                            </div>
                            <div className="text-slate-300">
                              Tiền lương điều chỉnh = Lương × Số tháng × Hệ số trượt giá
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Module 3: Các bước */}
                    {module.id === 'module-3' && (
                      <div className="space-y-3">
                        {[
                          { step: 1, title: 'Thu thập dữ liệu', desc: 'Chuẩn bị thông tin các giai đoạn đóng BHXH', color: 'from-primary to-primary-dark' },
                          { step: 2, title: 'Tra cứu hệ số trượt giá', desc: 'Xác định hệ số điều chỉnh theo từng năm', color: 'from-secondary to-secondary-dark' },
                          { step: 3, title: 'Tính tiền lương điều chỉnh', desc: 'Lương × Số tháng × Hệ số trượt giá', color: 'from-success to-success' },
                          { step: 4, title: 'Tính MBQTL', desc: 'Tổng tiền điều chỉnh chia cho tổng số tháng', color: 'from-warning to-warning' },
                          { step: 5, title: 'Phân loại thời gian', desc: 'Chia thành phần trước 2014 và từ 2014 trở đi', color: 'from-accent to-accent-dark' },
                          { step: 6, title: 'Làm tròn số năm', desc: '1-6 tháng lẻ = 0.5 năm, 7-11 tháng lẻ = 1 năm', color: 'from-error to-error' },
                          { step: 7, title: 'Tính mức hưởng', desc: 'Áp dụng công thức với hệ số 1.5 và 2.0', color: 'from-primary to-accent' },
                        ].map((item) => (
                          <div key={item.step} className="flex gap-4 items-start card-premium p-5">
                            <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${item.color} text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-glow`}>
                              {item.step}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1 text-text-primary">{item.title}</h3>
                              <p className="text-sm text-text-secondary">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Module 4-6: Simplified versions */}
                    {(module.id === 'module-4' || module.id === 'module-5' || module.id === 'module-6') && (
                      <div className="card-glass p-6 rounded-2xl text-center">
                        <i className={`fas ${module.icon} text-6xl ${module.color} mb-4`}></i>
                        <h3 className="font-bold text-xl mb-3 text-text-primary">{module.title}</h3>
                        <p className="text-text-secondary mb-6">{module.description}</p>
                        <Link href="/manual" className="btn btn-primary inline-flex items-center gap-2">
                          <i className="fas fa-calculator"></i>
                          Thực hành ngay
                        </Link>
                      </div>
                    )}

                    {/* Mark Complete Button */}
                    <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                      <button
                        onClick={() => toggleCompleted(module.id)}
                        className={`btn ${
                          isCompleted
                            ? 'bg-success/10 text-success border-2 border-success hover:bg-success/20'
                            : 'btn-primary'
                        } flex items-center gap-2`}
                      >
                        <i className="fas fa-circle-check"></i>
                        {isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                      </button>

                      {index < modules.length - 1 && (
                        <button
                          onClick={() => {
                            const nextModule = modules[index + 1];
                            setExpandedModules(new Set([nextModule.id]));
                            document.getElementById(nextModule.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="btn btn-outline flex items-center gap-2"
                        >
                          Module tiếp theo
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Badge */}
        {completionPercentage === 100 && (
          <div className="mt-8 card-premium p-12 text-center bg-gradient-to-r from-success/10 to-primary/10 animate-fade-in">
            <i className="fas fa-trophy text-6xl text-gradient mb-4"></i>
            <h2 className="text-4xl font-bold font-heading mb-3 text-gradient">Chúc mừng!</h2>
            <p className="text-lg text-text-secondary mb-8">Bạn đã hoàn thành tất cả các module học tập</p>
            <Link
              href="/manual"
              className="btn btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              <i className="fas fa-rocket"></i>
              Bắt đầu tính toán BHXH của bạn
            </Link>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 card-glass p-6 rounded-2xl text-center">
          <p className="text-sm text-text-muted mb-2">
            <i className="fas fa-info-circle mr-2"></i>
            Tài liệu này chỉ mang tính chất tham khảo.
          </p>
          <p className="text-sm text-text-secondary">
            Nguồn: Tổng hợp từ{' '}
            <a
              href="https://baohiemxahoi.gov.vn"
              className="text-primary hover:text-primary-dark hover:underline font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bảo hiểm Xã hội Việt Nam
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
