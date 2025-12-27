export interface Section {
  id: string;
  title: string;
  icon: string;
}

export interface Coefficient {
  year: string;
  value: string;
}

export const sections: Section[] = [
  { id: 'legal-basis', title: 'Căn cứ pháp lý', icon: 'fa-gavel' },
  { id: 'eligibility', title: 'Đối tượng được hưởng', icon: 'fa-users' },
  { id: 'formula', title: 'Công thức tính', icon: 'fa-calculator' },
  { id: 'steps', title: 'Các bước tính toán', icon: 'fa-list-check' },
  { id: 'example', title: 'Ví dụ minh họa', icon: 'fa-file-lines' },
  { id: 'important-notes', title: 'Lưu ý quan trọng', icon: 'fa-triangle-exclamation' },
  { id: 'faq', title: 'Câu hỏi thường gặp', icon: 'fa-circle-question' },
  { id: 'references', title: 'Tài liệu tham khảo', icon: 'fa-book' },
];

export const coefficients: Coefficient[] = [
  { year: 'Trước 1995', value: '5.43' },
  { year: '1995', value: '4.61' },
  { year: '1996', value: '4.36' },
  { year: '1997', value: '4.22' },
  { year: '1998', value: '3.92' },
  { year: '1999', value: '3.75' },
  { year: '2000', value: '3.82' },
  { year: '2001', value: '3.83' },
  { year: '2002', value: '3.68' },
  { year: '2003', value: '3.57' },
  { year: '2004', value: '3.31' },
  { year: '2005', value: '3.06' },
  { year: '2006', value: '2.85' },
  { year: '2007', value: '2.63' },
  { year: '2008', value: '2.14' },
  { year: '2009', value: '2.00' },
  { year: '2010', value: '1.83' },
  { year: '2011', value: '1.54' },
  { year: '2012', value: '1.41' },
  { year: '2013', value: '1.33' },
  { year: '2014', value: '1.27' },
  { year: '2015', value: '1.27' },
  { year: '2016', value: '1.23' },
  { year: '2017', value: '1.19' },
  { year: '2018', value: '1.15' },
  { year: '2019', value: '1.12' },
  { year: '2020', value: '1.08' },
  { year: '2021', value: '1.07' },
  { year: '2022', value: '1.03' },
  { year: '2023', value: '1.00' },
  { year: '2024', value: '1.00' },
  { year: 'Sau 2024', value: '1.00' },
];
