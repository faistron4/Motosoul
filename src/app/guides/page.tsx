import Link from 'next/link';
import { guides, guideCategories } from '@/data/guides';

export default function GuidesPage() {
  const featuredGuide = guides.find((g) => g.featured);
  const popularGuides = guides.filter((g) => g.popular);
  const regularGuides = guides.filter((g) => !g.featured);

  return (
    <div className="bg-white text-slate-900 min-h-screen">

      {/* ==================================================== */}
      {/* 1. HERO */}
      {/* ==================================================== */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
              <i className="fa-solid fa-book-open" />
              Motoring Guides
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
              Drive harder. <span className="text-blue-600">Wrench smarter.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              Every guide here is built to help you make better choices for your car.
              From wheel fitment and tyre sizing to engine tuning and track-day prep —
              no jargon, no filler. Just proper motoring knowledge you can actually use.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search guides, topics, keywords..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
                />
              </div>
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-lg text-sm transition-colors whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. CATEGORIES */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-slate-200">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900">Browse by Category</h2>
          <p className="text-sm text-slate-500 mt-1">Pick a topic and dive in.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {guideCategories.map((cat) => (
            <Link
              key={cat.name}
              href={`/guides?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-600 hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                <i className={`fa-solid ${cat.icon} text-slate-600 group-hover:text-white transition-colors`} />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                {cat.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                {cat.count} guides
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. FEATURED GUIDE */}
      {/* ==================================================== */}
      {featuredGuide && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Featured Guide</span>
          </div>

          <Link
            href={`/guides/${featuredGuide.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-900 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-64 lg:h-auto overflow-hidden bg-slate-100">
              <img
                src={featuredGuide.image}
                alt={featuredGuide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                Featured
              </span>
            </div>

            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
                <span className="bg-blue-50 border border-blue-200 text-blue-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {featuredGuide.category}
                </span>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <i className="fa-regular fa-clock" /> {featuredGuide.readTime} min read
                </span>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <i className="fa-solid fa-signal" /> {featuredGuide.difficulty}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                {featuredGuide.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {featuredGuide.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {featuredGuide.authorInitials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{featuredGuide.author}</div>
                    <div className="text-[10px] text-slate-400">{featuredGuide.publishedAt}</div>
                  </div>
                </div>
                <span className="text-blue-600 font-bold text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all">
                  Read guide <i className="fa-solid fa-arrow-right text-xs" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ==================================================== */}
      {/* 4. ALL GUIDES + POPULAR SIDEBAR */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Guides Grid */}
          <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">All Guides</h2>
                <p className="text-sm text-slate-500 mt-1">{regularGuides.length} guides and counting.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Newest', 'Popular', 'Beginner'].map((filter, i) => (
                  <button
                    key={filter}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${
                      i === 0
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {regularGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-900 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200">
                      {guide.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><i className="fa-regular fa-clock" /> {guide.readTime} min</span>
                      <span>·</span>
                      <span>{guide.difficulty}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                      {guide.excerpt}
                    </p>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
                        {guide.authorInitials}
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold">{guide.author}</span>
                      <span className="ml-auto text-blue-600 font-bold text-[11px] flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <i className="fa-solid fa-arrow-right text-[9px]" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Popular Guides */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                <i className="fa-solid fa-fire text-amber-500" /> Most Popular
              </h3>
              <div className="space-y-4">
                {popularGuides.slice(0, 4).map((guide, index) => (
                  <Link
                    key={guide.id}
                    href={`/guides/${guide.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="text-2xl font-black text-slate-300 leading-none shrink-0 w-6">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {guide.title}
                      </h4>
                      <div className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                        {guide.readTime} min · {guide.category}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <i className="fa-solid fa-lightbulb text-amber-500" /> Quick Answers
              </h3>
              <div className="space-y-3">
                {[
                  { q: 'What tyre pressure should I run?', icon: 'fa-gauge' },
                  { q: 'How often should I change oil?', icon: 'fa-oil-can' },
                  { q: 'Are wider tyres always better?', icon: 'fa-circle-dot' },
                  { q: 'Do I need a remap for a turbo?', icon: 'fa-microchip' },
                ].map((tip) => (
                  <Link
                    key={tip.q}
                    href="/guides"
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                      <i className={`fa-solid ${tip.icon} text-xs text-slate-500 group-hover:text-white transition-colors`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {tip.q}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <i className="fa-regular fa-envelope text-lg" />
              </div>
              <h3 className="text-base font-black mb-2">New guides every week</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Get the latest guides and tool updates in your inbox.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all mb-2"
              />
              <button className="w-full bg-white text-slate-900 font-bold py-2.5 rounded-lg text-xs hover:bg-slate-100 transition-colors">
                Subscribe
              </button>
            </div>

          </aside>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. BOTTOM CTA */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-14 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5 mx-auto">
              <i className="fa-solid fa-pen-fancy text-xl text-blue-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Want to write for us?
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Share your knowledge with thousands of enthusiasts. We&apos;re always looking
              for contributors who know their stuff.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa-solid fa-paper-plane" /> Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}