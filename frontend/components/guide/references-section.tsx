export default function ReferencesSection() {
  return (
    <section id="references" className="scroll-mt-8">
      <div className="card-premium p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
          <i className="fas fa-book"></i>
          Tài liệu tham khảo
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-secondary">Văn bản pháp luật</h3>
            <ul className="space-y-3">
              <li className="card-glass p-4 rounded-xl">
                <a href="https://baohiemxahoi.gov.vn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  Luật Bảo hiểm xã hội 2014 (có sửa đổi 2024)
                </a>
              </li>
            </ul>
          </div>
          <div className="card-glass p-6 rounded-2xl border-l-4 border-primary">
            <h3 className="font-semibold text-lg mb-4 text-primary flex items-center gap-2">
              <i className="fas fa-building"></i>
              Liên hệ và hỗ trợ
            </h3>
            <div className="text-sm text-text-secondary space-y-1">
              <p><i className="fas fa-map-marker-alt text-primary mr-2"></i>Địa chỉ: Số 8 Tôn Thất Thuyết, Cầu Giấy, Hà Nội</p>
              <p><i className="fas fa-phone text-primary mr-2"></i>Tổng đài: 1900-6166</p>
              <p><i className="fas fa-globe text-primary mr-2"></i>Website: <a href="https://baohiemxahoi.gov.vn" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">baohiemxahoi.gov.vn</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
