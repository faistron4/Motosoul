'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'introduction', label: '1. Introduction' },
  { id: 'about-these-terms', label: '2. About These Terms' },
  { id: 'your-use', label: '3. Your Use of the Site' },
  { id: 'user-content', label: '4. User Content & Contributions' },
  { id: 'intellectual-property', label: '5. Intellectual Property' },
  { id: 'your-account', label: '6. Your Account' },
  { id: 'privacy', label: '7. Privacy & Cookies' },
  { id: 'third-party', label: '8. Third-Party Links' },
  { id: 'disclaimers', label: '9. Disclaimers' },
  { id: 'liability', label: '10. Limitation of Liability' },
  { id: 'changes', label: '11. Changes to These Terms' },
  { id: 'contact', label: '12. Contact Us' },
];

export default function TermsTOC() {
  const [activeId, setActiveId] = useState('introduction');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(id);
            }
          });
        },
        { rootMargin: '-20% 0px -70% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="space-y-1">
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`block text-xs py-1.5 px-3 rounded-md transition-colors ${
            activeId === section.id
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}