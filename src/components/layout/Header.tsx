'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/guides', label: 'Guides' },
  { href: '/circuits', label: 'Circuits' },
  { href: '/tools', label: 'Tools' },
  { href: '/build-diaries', label: 'Build Diaries' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* -------- Logo -------- */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-gauge-high text-white text-sm" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              Motosoul
            </span>
          </Link>

          {/* -------- Desktop Nav -------- */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* -------- Right Actions -------- */}
          <div className="flex items-center gap-2">

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center"
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass text-slate-600 text-sm" />
            </button>

            {/* Sign In (desktop) */}
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>

            {/* Get Started CTA */}
            <Link
              href="/community"
              className="hidden sm:inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-md transition-colors"
            >
              Join
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center"
              aria-label="Menu"
            >
              <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-slate-600 text-sm`} />
            </button>
          </div>
        </div>
      </div>

      {/* -------- Search Bar (expandable) -------- */}
      {searchOpen && (
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                autoFocus
                placeholder="Search articles, tools, circuits..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* -------- Mobile Menu -------- */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="border-t border-slate-200 mt-2 pt-3 flex gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm font-semibold text-slate-700 px-3.5 py-2.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/community"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-3.5 py-2.5 rounded-md transition-colors"
                >
                  Join
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}