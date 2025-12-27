export default function EligibilitySection() {
  return (
    <section id="eligibility" className="scroll-mt-8">
      <div className="card-premium p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
          <i className="fas fa-users"></i>
          Đối tượng được hưởng
        </h2>

        <p className="text-text-secondary mb-6">
          Người lao động được nhận BHXH một lần trong các trường hợp sau:
        </p>

        {/* General Case */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-secondary">
            <span className="badge badge-primary">1</span>
            Trường hợp chung (áp dụng từ 01/07/2025)
          </h3>
          <div className="card-glass p-6 rounded-2xl">
            <p className="font-medium mb-3 text-success">
              <i className="fas fa-check-circle mr-2"></i>
              Điều kiện:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <i className="fas fa-circle text-xs text-primary mt-1.5"></i>
                <span>Đã tham gia BHXH bắt buộc hoặc tự nguyện trước ngày 01/07/2025</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-circle text-xs text-primary mt-1.5"></i>
                <span>Đã nghỉ việc ít nhất 12 tháng</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-circle text-xs text-primary mt-1.5"></i>
                <span>Không tiếp tục tham gia đóng BHXH (bắt buộc hoặc tự nguyện)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-circle text-xs text-primary mt-1.5"></i>
                <span>Chưa đủ 20 năm đóng BHXH</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-circle text-xs text-primary mt-1.5"></i>
                <span>Phải nộp đơn yêu cầu hưởng BHXH một lần</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Special Cases */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-secondary">
            <span className="badge badge-accent">2</span>
            Trường hợp đặc biệt (áp dụng cho mọi người)
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Người tham gia BHXH từ ngày 01/07/2025 vẫn được rút BHXH một lần nếu thuộc các trường hợp:
          </p>
          <div className="grid gap-3">
            <div className="card-glass p-4 rounded-xl">
              <p className="font-medium text-success flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Đủ tuổi nghỉ hưu nhưng thời gian đóng BHXH dưới 15 năm
              </p>
            </div>
            <div className="card-glass p-4 rounded-xl">
              <p className="font-medium text-success flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Ra nước ngoài để định cư
              </p>
            </div>
            <div className="card-glass p-4 rounded-xl">
              <div className="font-medium text-success flex items-center gap-2 mb-2">
                <i className="fas fa-check-circle"></i>
                Mắc các bệnh hiểm nghèo:
              </div>
              <div className="ml-6 text-sm text-text-secondary space-y-1">
                <div>• Ung thư</div>
                <div>• Bại liệt</div>
                <div>• Xơ gan mất bù</div>
                <div>• Lao nặng</div>
                <div>• AIDS</div>
              </div>
            </div>
            <div className="card-glass p-4 rounded-xl">
              <p className="font-medium text-success flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Suy giảm khả năng lao động từ 81% trở lên
              </p>
            </div>
            <div className="card-glass p-4 rounded-xl">
              <p className="font-medium text-success flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Thuộc nhóm người khuyết tật đặc biệt nặng
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
