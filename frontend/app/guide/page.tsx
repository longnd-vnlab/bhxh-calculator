'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sections } from '@/components/guide/guide-data';
import TableOfContents from '@/components/guide/table-of-contents';
import LegalBasisSection from '@/components/guide/legal-basis-section';
import EligibilitySection from '@/components/guide/eligibility-section';

// Lazy load heavy components
import dynamic from 'next/dynamic';

const FormulaSection = dynamic(() => import('@/components/guide/formula-section'), { ssr: true });
const StepsSection = dynamic(() => import('@/components/guide/steps-section'), { ssr: true });
const ExampleSection = dynamic(() => import('@/components/guide/example-section'), { ssr: true });
const ImportantNotesSection = dynamic(() => import('@/components/guide/important-notes-section'), { ssr: true });
const FAQSection = dynamic(() => import('@/components/guide/faq-section'), { ssr: true });
const ReferencesSection = dynamic(() => import('@/components/guide/references-section'), { ssr: true });
const ConclusionSection = dynamic(() => import('@/components/guide/conclusion-section'), { ssr: true });

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState<string>('legal-basis');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/20 to-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="aurora-bg absolute inset-0" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }} />

      {/* Hero Header */}
      <div className="relative z-10 bg-gradient-to-r from-primary via-secondary to-accent text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-glow">
              <i className="fas fa-book-open text-3xl"></i>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold">
                Hướng Dẫn Tính Bảo Hiểm Xã Hội Một Lần
              </h1>
              <p className="text-white/90 text-sm md:text-base mt-1">
                Tài liệu tham khảo chi tiết về quy trình và công thức tính BHXH theo quy định
              </p>
            </div>
          </div>

          {/* Quick Action */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/manual" className="btn btn-accent flex items-center gap-2">
              <i className="fas fa-calculator"></i>
              Tính toán ngay
            </Link>
            <Link href="/" className="btn btn-glass">
              <i className="fas fa-home"></i>
              Trang chủ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents */}
          <TableOfContents
            sections={sections}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <LegalBasisSection />
            <EligibilitySection />
            <FormulaSection />
            <StepsSection />
            <ExampleSection />
            <ImportantNotesSection />
            <FAQSection />
            <ReferencesSection />
            <ConclusionSection />
          </main>
        </div>
      </div>
    </div>
  );
}
