import Link from 'next/link';

export default function ConclusionSection() {
  return (
    <div className="card-glass p-8 rounded-2xl text-center border-2 border-primary/20">
      <h3 className="text-xl font-bold mb-4 text-primary">Kết luận</h3>
      <div className="space-y-4 text-sm text-text-secondary max-w-3xl mx-auto">
        <div className="p-4 bg-success/10 rounded-xl">
          <h4 className="font-semibold text-success mb-2">
            <i className="fas fa-check-circle mr-2"></i>
            Những điều cần nhớ
          </h4>
          <ul className="space-y-1 text-left">
            <li>• BHXH một lần = Giải pháp ngắn hạn, mất quyền lợi dài hạn</li>
            <li>• Hãy cân nhắc kỹ trước khi quyết định nhận BHXH một lần</li>
            <li>• Kiểm tra thông tin đóng BHXH định kỳ qua VssID</li>
            <li>• Tư vấn chuyên gia nếu còn thắc mắc</li>
          </ul>
        </div>

        <div className="p-4 bg-primary/10 rounded-xl">
          <h4 className="font-semibold text-primary mb-2">
            <i className="fas fa-lightbulb mr-2"></i>
            Khuyến nghị
          </h4>
          <ul className="space-y-1 text-left">
            <li>• Nếu có thể: Tiếp tục đóng BHXH để hưởng lương hưu</li>
            <li>• Nếu cần gấp: Cân nhắc các phương án khác trước</li>
            <li>• Nếu quyết định nhận: Hiểu rõ quy trình và quyền lợi của mình</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-warning/10 border-l-4 border-warning rounded-lg">
          <p className="text-sm">
            <i className="fas fa-info-circle mr-2"></i>
            <strong><i className="fas fa-bookmark mr-1"></i>Lưu ý:</strong> Tài liệu này được biên soạn dựa trên các quy định hiện hành.
            Vui lòng tham khảo thêm tại{' '}
            <a href="https://baohiemxahoi.gov.vn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              baohiemxahoi.gov.vn
            </a>
          </p>
        </div>

        <p className="text-xs text-text-muted mt-6">
          Nguồn: Tổng hợp từ Bảo hiểm Xã hội Việt Nam • Cập nhật: Tháng 12/2025
        </p>
      </div>

      <div className="mt-8">
        <Link href="/manual" className="btn btn-primary inline-flex items-center gap-2">
          <i className="fas fa-calculator"></i>
          Bắt đầu tính toán BHXH của bạn
        </Link>
      </div>
    </div>
  );
}
