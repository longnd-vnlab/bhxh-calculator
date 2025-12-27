import { Section } from './guide-data';

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export default function TableOfContents({ sections, activeSection, onSectionClick }: TableOfContentsProps) {
  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="lg:sticky lg:top-8">
        <div className="card-premium p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
            <i className="fas fa-list"></i>
            Mục lục
          </h2>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                  activeSection === section.id
                    ? 'bg-primary text-white shadow-glow'
                    : 'hover:bg-surface text-text-secondary hover:text-primary'
                }`}
              >
                <i className={`fas ${section.icon} text-sm`}></i>
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
