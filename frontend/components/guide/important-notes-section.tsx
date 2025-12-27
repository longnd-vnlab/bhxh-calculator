export default function ImportantNotesSection() {
  return (
    <section id="important-notes" className="scroll-mt-8">
      <div className="card-premium p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-warning">
          <i className="fas fa-triangle-exclamation"></i>
          Lưu ý quan trọng
        </h2>
        <div className="card-glass p-6 rounded-2xl border-l-4 border-error">
          <h3 className="font-bold text-lg mb-4 text-error">
            <i className="fas fa-triangle-exclamation mr-2"></i>
            Những điều cần biết trước khi nhận BHXH một lần
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <i className="fas fa-xmark text-error text-lg mt-0.5"></i>
              <span>Mất quyền hưởng lương hưu hàng tháng khi về già</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-xmark text-error text-lg mt-0.5"></i>
              <span>Không được cộng dồn thêm thời gian đóng BHXH</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-xmark text-error text-lg mt-0.5"></i>
              <span>Mất quyền lợi trợ cấp mai táng và tử tuất</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
