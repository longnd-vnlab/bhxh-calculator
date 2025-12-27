export default function FormulaSection() {
  return (
    <section id="formula" className="scroll-mt-8">
      <div className="card-premium p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
          <i className="fas fa-calculator"></i>
          Công thức tính
        </h2>

        {/* General Formula */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4 text-secondary">Công thức tổng quát</h3>
          <div className="bg-slate-900 p-6 rounded-2xl">
            <div className="font-mono text-white space-y-3">
              <div className="text-lg font-bold mb-4">
                Mức hưởng BHXH một lần = (Phần trước 2014) + (Phần từ 2014)
              </div>
              <div className="text-slate-300 space-y-2 text-sm">
                <div className="pl-4 border-l-2 border-success">
                  Phần trước 2014 = <span className="text-success font-bold">1.5</span> × MBQTL × Số năm trước 2014
                </div>
                <div className="pl-4 border-l-2 border-accent">
                  Phần từ 2014 = <span className="text-accent font-bold">2.0</span> × MBQTL × Số năm từ 2014
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MBQTL Formula */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4 text-secondary">
            Công thức tính MBQTL (Mức Bình Quân Tiền Lương)
          </h3>
          <div className="bg-slate-900 p-6 rounded-2xl">
            <div className="font-mono text-white space-y-3">
              <div className="text-base font-bold mb-3">
                MBQTL = Tổng tiền lương đã điều chỉnh / Tổng số tháng đóng
              </div>
              <div className="text-slate-300 text-sm pl-4 border-l-2 border-primary">
                Tổng tiền lương đã điều chỉnh = Σ(Lương tháng × Số tháng × Hệ số trượt giá)
              </div>
            </div>
          </div>
        </div>

        {/* Special Case Formula */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-secondary">Công thức cho trường hợp đặc biệt</h3>
          <div className="card-glass p-5 rounded-2xl">
            <p className="text-sm text-text-secondary mb-3">
              Nếu tổng thời gian đóng BHXH &lt; 12 tháng:
            </p>
            <div className="bg-slate-900 p-5 rounded-xl">
              <div className="font-mono text-white text-sm">
                <div className="mb-2">Mức hưởng = min(</div>
                <div className="pl-6 space-y-1 text-slate-300">
                  <div>22% × Tổng tiền lương đã điều chỉnh,</div>
                  <div>2 × MBQTL</div>
                </div>
                <div>)</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-warning/10 border-l-4 border-warning rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong className="text-warning">
                  <i className="fas fa-triangle-exclamation mr-1"></i>
                  Lưu ý:
                </strong> Mức hưởng BHXH một lần KHÔNG bao gồm số tiền Nhà nước hỗ trợ đóng BHXH tự nguyện (trừ trường hợp bệnh nguy hiểm đến tính mạng).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
