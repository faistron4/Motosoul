'use client';

import Link from 'next/link';

interface ComingSoonProps {
  title: string;
  icon?: string;
}

export default function ComingSoon({ title, icon = 'fa-clock' }: ComingSoonProps) {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-6">
          <i className={`fa-solid ${icon} text-3xl text-blue-600`} />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
          Coming Soon
        </span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          {title} is on its way
        </h1>

        {/* Subtext */}
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          We&apos;re building something worth waiting for. Check back soon.
        </p>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
          Back to Home
        </Link>

      </div>
    </div>
  );
}