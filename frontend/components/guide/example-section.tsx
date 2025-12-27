export default function ExampleSection() {
  return (
    <section id="example" className="scroll-mt-8">
      <div className="card-premium p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
          <i className="fas fa-file-lines"></i>
          Ví dụ minh họa
        </h2>

        <div className="card-glass p-6 rounded-2xl mb-6">
          <h3 className="font-semibold text-lg mb-4 text-secondary">Ví dụ: Công nhân A</h3>

          <div className="space-y-4">
            {/* Thông tin */}
            <div>
              <p className="font-medium mb-2">Thông tin:</p>
              <ul className="text-sm space-y-1 text-text-secondary">
                <li className="flex items-start gap-2">
                  <i className="fas fa-circle text-xs text-primary mt-1.5"></i>
                  <span>Thời gian tham gia BHXH: 01/2013 - 07/2016</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-circle text-xs text-primary mt-1.5"></i>
                  <span>Nghỉ việc: 08/2016</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-circle text-xs text-primary mt-1.5"></i>
                  <span>Yêu cầu nhận BHXH một lần: 09/2017</span>
                </li>
              </ul>
            </div>

            {/* Chi tiết các giai đoạn */}
            <div>
              <p className="font-medium mb-3">Chi tiết các giai đoạn đóng BHXH:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/10">
                      <th className="px-3 py-2 text-left font-semibold">STT</th>
                      <th className="px-3 py-2 text-left font-semibold">Thời gian</th>
                      <th className="px-3 py-2 text-left font-semibold">Số tháng</th>
                      <th className="px-3 py-2 text-left font-semibold">Mức lương</th>
                      <th className="px-3 py-2 text-left font-semibold">Hệ số</th>
                      <th className="px-3 py-2 text-left font-semibold">Tính toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2">1</td>
                      <td className="px-3 py-2 whitespace-nowrap">01/2013 - 12/2013</td>
                      <td className="px-3 py-2">12</td>
                      <td className="px-3 py-2">1.200.000</td>
                      <td className="px-3 py-2 text-primary font-semibold">1.08</td>
                      <td className="px-3 py-2 text-xs">1.200.000 × 12 × 1.08 = 15.552.000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2">2</td>
                      <td className="px-3 py-2 whitespace-nowrap">01/2014 - 09/2014</td>
                      <td className="px-3 py-2">9</td>
                      <td className="px-3 py-2">1.445.000</td>
                      <td className="px-3 py-2 text-primary font-semibold">1.03</td>
                      <td className="px-3 py-2 text-xs">1.445.000 × 9 × 1.03 = 13.395.150</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2">3</td>
                      <td className="px-3 py-2 whitespace-nowrap">10/2014 - 12/2014</td>
                      <td className="px-3 py-2">3</td>
                      <td className="px-3 py-2">2.140.000</td>
                      <td className="px-3 py-2 text-primary font-semibold">1.03</td>
                      <td className="px-3 py-2 text-xs">2.140.000 × 3 × 1.03 = 6.612.600</td>
                    </tr>
                    <tr className="border-t border-border bg-warning/5">
                      <td className="px-3 py-2">4</td>
                      <td className="px-3 py-2 whitespace-nowrap">01/2015 - 06/2015</td>
                      <td className="px-3 py-2">-</td>
                      <td className="px-3 py-2">-</td>
                      <td className="px-3 py-2">-</td>
                      <td className="px-3 py-2 text-xs text-warning">Nghỉ không lương (KHÔNG tính)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2">5</td>
                      <td className="px-3 py-2 whitespace-nowrap">07/2015 - 12/2015</td>
                      <td className="px-3 py-2">6</td>
                      <td className="px-3 py-2">2.140.000</td>
                      <td className="px-3 py-2 text-primary font-semibold">1.03</td>
                      <td className="px-3 py-2 text-xs">2.140.000 × 6 × 1.03 = 13.225.200</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2">6</td>
                      <td className="px-3 py-2 whitespace-nowrap">01/2016 - 02/2016</td>
                      <td className="px-3 py-2">2</td>
                      <td className="px-3 py-2">2.140.000</td>
                      <td className="px-3 py-2 text-primary font-semibold">1.00</td>
                      <td className="px-3 py-2 text-xs">2.140.000 × 2 × 1.00 = 4.280.000</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2">7</td>
                      <td className="px-3 py-2 whitespace-nowrap">03/2016 - 07/2016</td>
                      <td className="px-3 py-2">5</td>
                      <td className="px-3 py-2">2.515.000</td>
                      <td className="px-3 py-2 text-primary font-semibold">1.00</td>
                      <td className="px-3 py-2 text-xs">2.515.000 × 5 × 1.00 = 12.575.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tính toán chi tiết */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white">
              <p className="font-bold mb-4 text-xl">Tính toán:</p>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-primary mb-2">1. Tổng số tháng:</p>
                  <p className="pl-4">12 + 9 + 3 + 6 + 2 + 5 = <span className="font-bold text-success">37 tháng</span></p>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-2">2. Tổng tiền lương điều chỉnh:</p>
                  <p className="pl-4 text-slate-300">15.552.000 + 13.395.150 + 6.612.600 + 13.225.200 + 4.280.000 + 12.575.000</p>
                  <p className="pl-4 mt-1">= <span className="font-bold text-success">65.639.950 đồng</span></p>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-2">3. MBQTL:</p>
                  <p className="pl-4">65.639.950 / 37 = <span className="font-bold text-success">1.774.052 đồng</span></p>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-2">4. Phân loại thời gian:</p>
                  <div className="pl-4 space-y-1 text-slate-300">
                    <p className="flex items-start gap-2">
                      <i className="fas fa-circle text-xs mt-1.5"></i>
                      <span>Trước 2014: 12 tháng = 1 năm</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <i className="fas fa-circle text-xs mt-1.5"></i>
                      <span>Từ 2014: 25 tháng = 2 năm 1 tháng → <span className="font-bold text-success">2.5 năm</span> (làm tròn)</span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-2">5. Tính mức hưởng:</p>
                  <div className="pl-4 space-y-3">
                    <div>
                      <p className="text-slate-300">Trước 2014:</p>
                      <p>1.774.052 × 1 × 1.5 = <span className="font-bold text-success">2.661.078 đồng</span></p>
                    </div>
                    <div>
                      <p className="text-slate-300">Từ 2014:</p>
                      <p>1.774.052 × 2.5 × 2 = <span className="font-bold text-success">8.870.260 đồng</span></p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="font-semibold text-primary mb-2">6. Tổng cộng:</p>
                  <p className="pl-4 text-lg">2.661.078 + 8.870.260 = <span className="font-bold text-success text-2xl">11.531.338 đồng</span></p>
                </div>
              </div>
            </div>

            {/* Kết quả */}
            <div className="p-5 bg-success/10 border-2 border-success rounded-2xl">
              <p className="font-bold text-lg text-success flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Kết quả: Công nhân A được nhận 11.531.338 đồng
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
