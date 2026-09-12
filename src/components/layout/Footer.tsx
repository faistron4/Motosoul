'use client';

import Link from 'next/link';
const FOOTER_SECTIONS = [
  {
    title: 'Explore',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Guides', href: '/guides' },
      { label: 'Circuits', href: '/circuits' },
      { label: 'Build Diaries', href: '/build-diaries' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Power-to-weight', href: '/tools/power-to-weight-calculator' },
      { label: 'Corner Weight', href: '/tools/corner-weight-calculator' },
      { label: 'Engine Displacement', href: '/tools/engine-displacement-calculator' },
      { label: 'All Tools', href: '/tools' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact-us' },
      { label: 'Advertise', href: '/advertise' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'fa-brands fa-instagram' },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'fa-brands fa-youtube' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'fa-brands fa-facebook-f' },
  { label: 'Reddit', href: 'https://reddit.com', icon: 'fa-brands fa-reddit-alien' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">

      {/* ============ TOP SECTION ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* -------- Brand Column -------- */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-gauge-high text-white text-sm" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Motoristo
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
              The online community for car enthusiasts. Features, guides, circuit
              intelligence, and engineering tools — all in one place.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-900 group transition-colors flex items-center justify-center"
                >
                  <i className={`${social.icon} text-slate-500 group-hover:text-white text-sm transition-colors`} />
                </a>
              ))}
            </div>
          </div>

          {/* -------- Link Columns -------- */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {FOOTER_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-xs text-slate-400 text-center sm:text-left">
              © {new Date().getFullYear()} Motoristo. All rights reserved.
            </p>

            {/* Small links */}
            <div className="flex items-center gap-5 text-xs">
              <Link href="/privacy-policy" className="text-slate-400 hover:text-slate-900 transition-colors">
                Privacy
              </Link>
              <Link href="/terms-and-conditions" className="text-slate-400 hover:text-slate-900 transition-colors">
                Terms
              </Link>
              <Link href="/sitemap.xml" className="text-slate-400 hover:text-slate-900 transition-colors">
                Sitemap
              </Link>
            </div>

            {/* "Back to top" */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Back to top"
            >
              <i className="fa-solid fa-arrow-up text-[10px]" />
              Back to top
            </button>

          </div>
        </div>
      </div>

    </footer>
  );
}