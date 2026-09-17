import Link from 'next/link';
import { featuredArticles, toolsList, circuitsList, buildDiaries } from '@/data/homepage';

export default function HomePage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">

      {/* ==================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================== */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              The online community for car enthusiasts
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
              Motoring features,{' '}
              <span className="text-blue-600">engineering tools</span>{' '}
              & circuit intelligence.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              Covered by passionate experts and industry veterans. Track information,
              track day details, noise limits, and local tips for the world&apos;s best circuits.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-10">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles, tools, circuits..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
                />
              </div>
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-lg text-sm transition-colors whitespace-nowrap">
                Search
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-10">
              {[
                { value: '11+', label: 'Calculators' },
                { value: '50+', label: 'Articles' },
                { value: '20+', label: 'Circuit Guides' },
                { value: '100%', label: 'Free Tools' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </section>

      {/* ==================================================== */}
      {/* 2. FEATURED ARTICLES */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">Features</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Latest Motoring Features</h2>
            <p className="text-slate-500 text-sm mt-2">Covered by passionate experts and industry veterans.</p>
          </div>
          <Link
            href="/features"
            className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            View all features <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/features/${article.slug}`}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-900 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200">
                  {article.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-regular fa-clock" /> {article.readTime}
                  </span>
                  <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <i className="fa-solid fa-arrow-right text-[10px]" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. TOOLS & CALCULATORS */}
      {/* ==================================================== */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 block">Tools</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Performance Calculators</h2>
              <p className="text-slate-500 text-sm mt-2">Engineering clarity for every stage of your project. No guesswork.</p>
            </div>
            <Link
              href="/tools"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              All tools <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolsList.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-600 hover:shadow-md transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors">
                  <i className={`fa-solid ${tool.icon} text-emerald-600 group-hover:text-white transition-colors`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. CIRCUIT GUIDES */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 block">Circuits</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Circuit Guides</h2>
            <p className="text-slate-500 text-sm mt-2">Track info, day details, noise limits, and local tips for the world&apos;s best tracks.</p>
          </div>
          <Link
            href="/circuits"
            className="text-amber-600 hover:text-amber-700 text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            All circuits <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {circuitsList.map((circuit) => (
            <Link
              key={circuit.id}
              href={`/circuits/${circuit.slug}`}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-500 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl mb-3">{circuit.flag}</div>
              <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-600 transition-colors">
                {circuit.name}
              </h3>
              <p className="text-slate-500 text-xs mb-3">{circuit.country}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                <span>
                  <i className="fa-solid fa-road mr-1 text-amber-500" />
                  {circuit.length}
                </span>
                <span>
                  <i className="fa-solid fa-turn-up mr-1 text-amber-500" />
                  {circuit.corners} corners
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. BUILD DIARIES */}
      {/* ==================================================== */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2 block">Build Diaries</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Member Build Diaries</h2>
              <p className="text-slate-500 text-sm mt-2">Follow real builds from the community — every wrench turned, documented.</p>
            </div>
            <Link
              href="/build-diaries"
              className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              All builds <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {buildDiaries.map((build) => (
              <Link
                key={build.id}
                href={`/build-diaries/${build.slug}`}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-purple-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={build.image}
                    alt={build.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200">
                      {build.entries} entries
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-purple-600 transition-colors">
                    {build.title}
                  </h3>
                  <p className="text-slate-500 text-xs mb-3">{build.car}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                    <i className="fa-solid fa-user text-purple-500" />
                    {build.author}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. APP PROMO + COMMUNITY */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* App Promo — Solid Blue */}
          <div className="bg-blue-600 rounded-2xl p-8 sm:p-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
              <i className="fa-solid fa-mobile-screen-button text-xl text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Take Motosoul Everywhere</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-sm">
              All our tools and calculators, now in your pocket. Available on iOS and Android.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white text-blue-700 font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                <i className="fa-brands fa-apple text-base" /> App Store
              </button>
              <button className="bg-blue-700 border border-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2">
                <i className="fa-brands fa-google-play text-base" /> Google Play
              </button>
            </div>
          </div>

          {/* Community — Solid Dark Slate */}
          <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                <i className="fa-solid fa-users text-xl text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Join the Community</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                Share your build, ask questions, and connect with enthusiasts who actually know their stuff.
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors w-fit"
            >
              <i className="fa-solid fa-arrow-right" /> Explore Community
            </Link>
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. NEWSLETTER */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-14 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5 mx-auto">
              <i className="fa-regular fa-envelope text-xl text-blue-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Stay in the Loop</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Get the latest features, tool updates, and circuit guides delivered straight to your inbox. No spam, ever.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
              />
              <button
                type="button"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-slate-400 text-xs mt-4">Join 5,000+ enthusiasts. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

    </div>
  );
}