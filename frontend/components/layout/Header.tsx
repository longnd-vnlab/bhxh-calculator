'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border-light/50">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-xl" />

      {/* Gradient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-premium opacity-50" />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-3 hover:opacity-90 transition-opacity cursor-pointer group"
          aria-label="BHXH Calculator Home"
        >
          <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-primary-dark to-accent rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <i className="fas fa-calculator text-white"></i>
            <i className="fas fa-sparkles absolute -top-1 -right-1 text-accent text-xs animate-pulse"></i>
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BHXH Calculator
            </h1>
            <p className="text-xs text-text-muted">Fintech Edition</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/')
                ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-sm'
                : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
            }`}
          >
            Trang chủ
          </Link>
          <Link
            href="/manual"
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/manual')
                ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-sm'
                : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
            }`}
          >
            Nhập liệu
          </Link>
          <Link
            href="/ocr"
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/ocr')
                ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-sm'
                : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
            }`}
          >
            AI Upload
          </Link>
          <Link
            href="/guide"
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/guide')
                ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-sm'
                : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
            }`}
          >
            Hướng dẫn
          </Link>
        </div>
      </nav>
    </header>
  );
}
