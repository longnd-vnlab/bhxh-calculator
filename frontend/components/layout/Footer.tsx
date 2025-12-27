export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-heading font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-shield-halved text-primary"></i>
              BHXH Calculator
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Ứng dụng tính toán số tiền BHXH một lần theo quy định mới nhất của Việt
              Nam năm 2025.
            </p>
          </div>

          <div>
            <h3 className="text-white font-heading font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-book-open text-primary"></i>
              Liên kết
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/"
                  className="hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="/manual"
                  className="hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  Nhập thủ công
                </a>
              </li>
              <li>
                <a
                  href="/ocr"
                  className="hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  Tải ảnh tự động
                </a>
              </li>
              <li>
                <a
                  href="/guide"
                  className="hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  Hướng dẫn sử dụng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-file-lines text-primary"></i>
              Thông tin
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Cập nhật theo <span className="text-primary font-medium">Thông tư 01/2025/TT-BLĐTBXH</span>
              <br />
              <span className="text-xs text-slate-500 mt-2 block">
                Kết quả chỉ mang tính tham khảo
              </span>
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            &copy; 2025 BHXH Calculator - Fintech Edition. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
