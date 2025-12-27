export default function LegalBasisSection() {
  return (
    <section id="legal-basis" className="scroll-mt-8">
      <div className="card-premium p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
          <i className="fas fa-gavel"></i>
          Căn cứ pháp lý
        </h2>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-secondary">Luật và Thông tư áp dụng</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <i className="fas fa-check-circle text-success mt-1"></i>
              <div>
                <span className="font-medium">Luật Bảo hiểm xã hội năm 2014</span>
                <span className="text-text-secondary"> - Khoản 2 Điều 60</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <i className="fas fa-check-circle text-success mt-1"></i>
              <div>
                <span className="font-medium">Thông tư 59/2015/TT-BLĐTBXH</span>
                <span className="text-text-secondary"> - Hướng dẫn thực hiện</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <i className="fas fa-check-circle text-success mt-1"></i>
              <div>
                <span className="font-medium">Thông tư 42/2016/TT-BLĐTBXH</span>
                <span className="text-text-secondary"> - Mức điều chỉnh hệ số trượt giá</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <i className="fas fa-check-circle text-success mt-1"></i>
              <div>
                <span className="font-medium">Thông tư 20/2023/TT-BLĐTBXH</span>
                <span className="text-text-secondary"> - Hệ số trượt giá năm 2024</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
