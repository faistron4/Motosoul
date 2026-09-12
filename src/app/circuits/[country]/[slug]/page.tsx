import { notFound } from 'next/navigation';
import Link from 'next/link';
import { circuits } from '@/data/circuits';

interface PageProps {
  params: {
    country: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  return circuits.map((c) => ({
    country: c.countryCode.toLowerCase(),
    slug: c.slug,
  }));
}

export default function CircuitDetailPage({ params }: PageProps) {
  const circuit = circuits.find(
    (c) => c.slug === params.slug && c.countryCode.toLowerCase() === params.country
  );

  if (!circuit) {
    notFound();
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/circuits"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-6 transition-colors w-fit"
          >
            <i className="fa-solid fa-arrow-left" /> Back to Circuits
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{circuit.flag}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {circuit.name}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {circuit.country} · {circuit.region} · Established {circuit.established}
              </p>
            </div>
          </div>

          <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
            {circuit.description}
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Length', value: `${circuit.lengthKm} km`, icon: 'fa-road' },
            { label: 'Corners', value: `${circuit.corners}`, icon: 'fa-turn-up' },
            { label: 'Elevation', value: `${circuit.elevationM} m`, icon: 'fa-mountain' },
            { label: 'Type', value: circuit.type, icon: 'fa-flag-checkered' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <i className={`fa-solid ${item.icon} text-blue-600 text-lg mb-2`} />
              <div className="text-xl font-black text-slate-900">{item.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Track Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Track Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Lap Record</span>
                <span className="font-bold text-slate-900">{circuit.lapRecord} — {circuit.lapRecordHolder}</span>
              </div>
              {circuit.noiseLimitDb && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Noise Limit</span>
                  <span className="font-bold text-slate-900">{circuit.noiseLimitDb} dB</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Track Days</span>
                <span className={`font-bold ${circuit.trackDays ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {circuit.trackDays ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fuel Station</span>
                <span className={`font-bold ${circuit.fuelStation ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {circuit.fuelStation ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Accommodation</span>
                <span className={`font-bold ${circuit.accommodation ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {circuit.accommodation ? 'Nearby' : 'Limited'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <a
                href={circuit.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <i className="fa-solid fa-globe" /> Visit Official Website
              </a>
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                <i className="fa-solid fa-calendar" /> View Track Days
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}