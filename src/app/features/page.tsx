import Link from 'next/link';
import { features, featureCategories } from '@/data/features';

export default function FeaturesPage() {
  const featuredArticle = features.find((f) => f.featured);
  const trendingArticles = features.filter((f) => f.trending);
  const remainingArticles = features.filter((f) => !f.featured);

  return (
    <div className="bg-white text-slate-900 min-h-screen">

      {/* ==================================================== */}
      {/* 1. HERO */}
      {/* ==================================================== */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
              <i className="fa-solid fa-feather" />
              Motoring Features
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
              Stories for people who <span className="text-blue-600">actually drive</span>.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              Long-form features, deep dives, and opinion pieces written by enthusiasts
              who&apos;ve spent real time under the bonnet. No sponsored fluff, no
              recycled press releases — just proper motoring writing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search features, topics, authors..."
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
          <h2 className="text-xl font-black text-slate-900">Browse by Topic</h2>
          <p className="text-sm text-slate-500 mt-1">Pick a category and start reading.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {featureCategories.map((cat) => (
            <Link
              key={cat.name}
              href={`/features?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-600 hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                <i className={`fa-solid ${cat.icon} text-slate-600 group-hover:text-white transition-colors`} />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                {cat.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                {cat.count} articles
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. FEATURED ARTICLE */}
      {/* ==================================================== */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Featured Story</span>
          </div>

          <Link
            href={`/features/${featuredArticle.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-900 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-64 lg:h-auto overflow-hidden bg-slate-100">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                Featured
              </span>
            </div>

            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
                <span className="bg-blue-50 border border-blue-200 text-blue-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {featuredArticle.category}
                </span>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <i className="fa-regular fa-clock" /> {featuredArticle.readTime} min read
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                {featuredArticle.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {featuredArticle.excerpt}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {featuredArticle.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {featuredArticle.authorInitials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{featuredArticle.author}</div>
                    <div className="text-[10px] text-slate-400">{featuredArticle.publishedAt}</div>
                  </div>
                </div>
                <span className="text-blue-600 font-bold text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all">
                  Read story <i className="fa-solid fa-arrow-right text-xs" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ==================================================== */}
      {/* 4. ALL FEATURES + TRENDING SIDEBAR */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Grid */}
          <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">All Features</h2>
                <p className="text-sm text-slate-500 mt-1">{remainingArticles.length} stories and counting.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Latest', 'Most Read', 'Editor\'s Picks'].map((filter, i) => (
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
              {remainingArticles.map((feature) => (
                <Link
                  key={feature.id}
                  href={`/features/${feature.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-900 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200">
                      {feature.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-clock" /> {feature.readTime} min
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                      {feature.excerpt}
                    </p>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
                        {feature.authorInitials}
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold">{feature.author}</span>
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

            {/* Trending Now */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                <i className="fa-solid fa-fire text-amber-500" /> Trending Now
              </h3>
              <div className="space-y-4">
                {trendingArticles.slice(0, 5).map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/features/${article.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="text-2xl font-black text-slate-300 leading-none shrink-0 w-6">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                        {article.readTime} min · {article.category}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Editor's Note */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <i className="fa-solid fa-quote-left text-blue-500" /> From the Editor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                &quot;We don&apos;t chase clicks. We chase the kind of stories you&apos;d
                tell a mate over a pint — the ones that make you appreciate cars even
                more.&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  HR
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Hassan Raza</div>
                  <div className="text-[10px] text-slate-400">Editor-in-Chief</div>
                </div>
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <i className="fa-regular fa-envelope text-lg" />
              </div>
              <h3 className="text-base font-black mb-2">New features every week</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Get the latest long-form stories delivered to your inbox. No spam, no
                nonsense.
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
              Got a story worth telling?
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              We&apos;re always looking for writers who know their subject and can tell a
              good story. Pitch us your idea.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa-solid fa-paper-plane" /> Pitch a Feature
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}