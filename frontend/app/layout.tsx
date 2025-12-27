import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Tính BHXH Một Lần | BHXH Calculator - Fintech Edition',
  description:
    'Ứng dụng tính toán số tiền bảo hiểm xã hội một lần theo quy định mới nhất của Việt Nam năm 2025. Công nghệ AI, bảo mật cao cấp.',
  keywords: 'BHXH, bảo hiểm xã hội, tính BHXH, BHXH một lần, calculator, fintech, AI OCR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
