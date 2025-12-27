import Link from 'next/link';
import { coefficients } from './guide-data';

export default function StepsSection() {
  return (
    <section id="steps" className="scroll-mt-8">
      <div className="card-premium p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
          <i className="fas fa-list-check"></i>
          Các bước tính toán
        </h2>
        <p className="text-text-secondary mb-6">
          Hướng dẫn chi tiết 7 bước tính BHXH một lần. Vui lòng xem tài liệu đầy đủ hoặc sử dụng công cụ tính toán.
        </p>
        <div className="card-glass p-6 rounded-2xl">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Thu thập dữ liệu</h4>
                <p className="text-sm text-text-secondary">Chuẩn bị thông tin các giai đoạn đóng BHXH</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Tra cứu hệ số trượt giá</h4>
                <p className="text-sm text-text-secondary">Xác định hệ số điều chỉnh theo từng năm</p>
              </div>
            </div>
            {/* More steps... */}
          </div>
        </div>
        <Link href="/manual" className="btn btn-primary mt-6 inline-flex items-center gap-2">
          <i className="fas fa-calculator"></i>
          Sử dụng công cụ tính toán
        </Link>
      </div>
    </section>
  );
}
