'use client';

export default function BackToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
    >
      <i className="fa-solid fa-arrow-up text-[10px]" />
      Back to top
    </button>
  );
}