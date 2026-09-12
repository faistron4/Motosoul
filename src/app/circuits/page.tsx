import Link from 'next/link';
import { circuits } from '@/data/circuits';

export default function CircuitsPage() {
  const totalCircuits = circuits.length;
  const countries = new Set(circuits.map((c) => c.country)).size;
  const regions = new Set(circuits.map((c) => c.region)).size;

  const featured = circuits.filter((c) => c.featured);
  const regionsList = ['All', 'Europe', 'Americas', 'Asia-Pacific'];

  return (
    <div className="bg-white text-slate-900 min-h-screen">

      {/* ==================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================== */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
              <i className="fa-solid fa-flag-checkered" />
              World Circuit Guides
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
              Track intelligence for the <span className="text-blue-600">world&apos;s best circuits</span>.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              Track information, track day details, noise limits, contact information,
              local fuel stations, and accommodation. Everything you need before
              you hit the tarmac.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search circuits, countries..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
                />
              </div>
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-lg text-sm transition-colors whitespace-nowrap">
                Search
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 sm:gap-10 mt-10 pt-8 border-t border-slate-200">
            {[
              { value: `${totalCircuits}+`, label: 'Circuit Guides' },
              { value: `${countries}`, label: 'Countries' },
              { value: `${regions}`, label: 'Regions' },
              { value: '100%', label: 'Free Access' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. FEATURED CIRCUITS */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 block">Featured</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Legendary Circuits</h2>
            <p className="text-slate-500 text-sm mt-2">The tracks that define motorsport history.</p>
          </div>
          <Link href="#all-circuits" className="text-amber-600 hover:text-amber-700 text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors">
            Browse all <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((circuit) => (
            <Link
              key={circuit.id}
              href={`/circuits/${circuit.countryCode.toLowerCase()}/${circuit.slug}`}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-900 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={circuit.image}
                  alt={circuit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200">
                  {circuit.flag} {circuit.country}
                </span>
                {circuit.type === 'Street' && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    Street
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                  {circuit.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {circuit.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span><i className="fa-solid fa-road mr-1 text-blue-500" />{circuit.lengthKm} km</span>
                  <span><i className="fa-solid fa-turn-up mr-1 text-blue-500" />{circuit.corners} corners</span>
                  <span className="ml-auto text-blue-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Guide <i className="fa-solid fa-arrow-right text-[10px]" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. ALL CIRCUITS */}
      {/* ==================================================== */}
      <section id="all-circuits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">All Circuits</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Circuit Directory</h2>
            <p className="text-slate-500 text-sm mt-2">Filter by region, type, or search by name.</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {regionsList.map((region) => (
            <button
              key={region}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${
                region === 'All'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {circuits.map((circuit) => (
            <Link
              key={circuit.id}
              href={`/circuits/${circuit.countryCode.toLowerCase()}/${circuit.slug}`}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-600 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{circuit.flag}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                      {circuit.name}
                    </h3>
                    <p className="text-xs text-slate-500">{circuit.country}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                  circuit.type === 'Street'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : circuit.type === 'Hybrid'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {circuit.type}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="bg-slate-50 rounded-md p-2 text-center border border-slate-200">
                  <div className="font-bold text-slate-900">{circuit.lengthKm}</div>
                  <div className="text-slate-500 text-[10px] uppercase">km</div>
                </div>
                <div className="bg-slate-50 rounded-md p-2 text-center border border-slate-200">
                  <div className="font-bold text-slate-900">{circuit.corners}</div>
                  <div className="text-slate-500 text-[10px] uppercase">corners</div>
                </div>
                <div className="bg-slate-50 rounded-md p-2 text-center border border-slate-200">
                  <div className="font-bold text-slate-900">{circuit.elevationM}</div>
                  <div className="text-slate-500 text-[10px] uppercase">m elev</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-3 border-t border-slate-100">
                {circuit.trackDays && (
                  <span className="flex items-center gap-1"><i className="fa-solid fa-check text-emerald-500" /> Track days</span>
                )}
                {circuit.fuelStation && (
                  <span className="flex items-center gap-1"><i className="fa-solid fa-gas-pump text-blue-500" /> Fuel</span>
                )}
                {circuit.accommodation && (
                  <span className="flex items-center gap-1"><i className="fa-solid fa-bed text-purple-500" /> Stay</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. CTA / NEWSLETTER */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-14 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5 mx-auto">
              <i className="fa-solid fa-flag-checkered text-xl text-blue-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Know a circuit we&apos;re missing?
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Help us grow the directory. Submit a track or contribute your local knowledge.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              <i className="fa-solid fa-plus" /> Submit a Circuit
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}