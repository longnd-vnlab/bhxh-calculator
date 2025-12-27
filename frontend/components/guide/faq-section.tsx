export default function FAQSection() {
  const faqs = [
    {
      q: 'Tôi đã nghỉ việc 6 tháng, có được nhận BHXH một lần không?',
      a: 'Chưa được. Phải nghỉ việc ít nhất 12 tháng và không tiếp tục đóng BHXH mới được nhận BHXH một lần.',
      icon: 'fa-xmark',
      color: 'error'
    },
    {
      q: 'Tôi có 10 năm đóng BHXH, nên nhận một lần hay tiếp tục đóng?',
      a: 'Nên tiếp tục đóng! Chỉ cần đóng thêm 10 năm nữa là đủ 20 năm để hưởng lương hưu suốt đời.',
      icon: 'fa-lightbulb',
      color: 'success'
    }
  ];

  return (
    <section id="faq" className="scroll-mt-8">
      <div className="card-premium p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
          <i className="fas fa-circle-question"></i>
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card-glass p-5 rounded-2xl">
              <h4 className="font-semibold mb-3 flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary to-accent text-white rounded-lg flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-sm text-text-secondary pl-8 flex items-start gap-2">
                <i className={`fas ${faq.icon} text-${faq.color} mt-0.5`}></i>
                <span>{faq.a}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
