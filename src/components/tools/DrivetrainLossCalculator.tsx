'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
type MeasurementLocation = 'crank' | 'wheel';
type DrivetrainType = 'fwd' | 'rwd' | 'awd' | '4wd';
type TransmissionType = 'manual' | 'automatic' | 'dct' | 'cvt';

/* ---------- CONSTANTS ---------- */
const DRIVETRAIN_BASE_LOSS: Record<DrivetrainType, number> = {
  fwd: 10,
  rwd: 13,
  awd: 18,
  '4wd': 20,
};

const TRANSMISSION_ADDITIONAL_LOSS: Record<TransmissionType, number> = {
  manual: 2,
  automatic: 3,
  dct: 2.5,
  cvt: 3.5,
};

const DRIVETRAIN_LABELS: Record<DrivetrainType, string> = {
  fwd: 'Front Wheel Drive (FWD)',
  rwd: 'Rear Wheel Drive (RWD)',
  awd: 'All Wheel Drive (AWD)',
  '4wd': 'Four Wheel Drive (4WD)',
};

const TRANSMISSION_LABELS: Record<TransmissionType, string> = {
  manual: 'Manual',
  automatic: 'Automatic',
  dct: 'Dual Clutch (DCT)',
  cvt: 'Continuously Variable (CVT)',
};

/* ---------- HELPERS ---------- */
function formatNumber(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function DrivetrainLossCalculator() {
  const [inputValue, setInputValue] = useState('300');
  const [location, setLocation] = useState<MeasurementLocation>('crank');
  const [drivetrain, setDrivetrain] = useState<DrivetrainType>('rwd');
  const [transmission, setTransmission] = useState<TransmissionType>('manual');

  const totalLossPercent = useMemo(
    () => DRIVETRAIN_BASE_LOSS[drivetrain] + TRANSMISSION_ADDITIONAL_LOSS[transmission],
    [drivetrain, transmission]
  );

  const { crankHp, wheelHp, lossHp } = useMemo(() => {
    const val = parseFloat(inputValue) || 0;
    const lossFraction = totalLossPercent / 100;

    if (location === 'crank') {
      const crank = val;
      const wheel = crank * (1 - lossFraction);
      return { crankHp: crank, wheelHp: wheel, lossHp: crank - wheel };
    } else {
      const wheel = val;
      const crank = lossFraction >= 1 ? 0 : wheel / (1 - lossFraction);
      return { crankHp: crank, wheelHp: wheel, lossHp: crank - wheel };
    }
  }, [inputValue, location, totalLossPercent]);

  const resetCalculator = () => {
    setInputValue('300');
    setLocation('crank');
    setDrivetrain('rwd');
    setTransmission('manual');
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ============================================ */}
          {/* LEFT: INPUTS */}
          {/* ============================================ */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-sliders text-blue-600"></i> Input Values
              </h3>
              <button
                onClick={resetCalculator}
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-rotate-left"></i> Reset
              </button>
            </div>

            {/* Horsepower Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Horsepower
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter horsepower..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  HP
                </span>
              </div>
            </div>

            {/* Measurement Location */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Measurement Location
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLocation('crank')}
                  className={`text-xs font-bold py-3 px-4 rounded-lg border transition-colors text-left ${
                    location === 'crank'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <i className="fa-solid fa-gear mr-2"></i>
                  At Crankshaft (BHP)
                  <p className={`text-[10px] font-normal mt-1 ${location === 'crank' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Engine output before drivetrain
                  </p>
                </button>
                <button
                  onClick={() => setLocation('wheel')}
                  className={`text-xs font-bold py-3 px-4 rounded-lg border transition-colors text-left ${
                    location === 'wheel'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <i className="fa-solid fa-circle-dot mr-2"></i>
                  At Wheels (WHP)
                  <p className={`text-[10px] font-normal mt-1 ${location === 'wheel' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Power delivered to the ground
                  </p>
                </button>
              </div>
            </div>

            {/* Drivetrain Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Drivetrain Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(DRIVETRAIN_BASE_LOSS) as DrivetrainType[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setDrivetrain(key)}
                    className={`text-xs font-bold py-2.5 px-3 rounded-lg border transition-colors ${
                      drivetrain === key
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {DRIVETRAIN_LABELS[key]}
                    <span className={`block text-[10px] font-normal mt-0.5 ${drivetrain === key ? 'text-blue-100' : 'text-slate-400'}`}>
                      ~{DRIVETRAIN_BASE_LOSS[key]}% base loss
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Transmission Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(TRANSMISSION_ADDITIONAL_LOSS) as TransmissionType[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setTransmission(key)}
                    className={`text-xs font-bold py-2.5 px-3 rounded-lg border transition-colors ${
                      transmission === key
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {TRANSMISSION_LABELS[key]}
                    <span className={`block text-[10px] font-normal mt-0.5 ${transmission === key ? 'text-blue-100' : 'text-slate-400'}`}>
                      +{TRANSMISSION_ADDITIONAL_LOSS[key]}% loss
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Loss Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Estimated Total Drivetrain Loss
                </span>
                <span className="text-2xl font-black text-slate-900">{totalLossPercent}%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Base drivetrain ({DRIVETRAIN_BASE_LOSS[drivetrain]}%) + transmission ({TRANSMISSION_ADDITIONAL_LOSS[transmission]}%)
              </p>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT: RESULTS */}
          {/* ============================================ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 solid-shadow">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Calculated Results
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  Guestimate
                </span>
              </div>

              {/* Crank HP */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Crankshaft Horsepower (BHP)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-blue-400 tracking-tight">
                    {formatNumber(crankHp, 1)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">HP</span>
                </div>
              </div>

              {/* Wheel HP */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Wheel Horsepower (WHP)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                    {formatNumber(wheelHp, 1)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">HP</span>
                </div>
              </div>

              {/* Drivetrain Loss */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Drivetrain Loss
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-amber-400 tracking-tight">
                    {formatNumber(lossHp, 1)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">HP</span>
                  <span className="text-sm font-bold text-amber-400/70">
                    ({totalLossPercent}%)
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Drivetrain</span>
                  <span className="text-white font-semibold">{DRIVETRAIN_LABELS[drivetrain]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transmission</span>
                  <span className="text-white font-semibold">{TRANSMISSION_LABELS[transmission]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Input Location</span>
                  <span className="text-white font-semibold">
                    {location === 'crank' ? 'Crankshaft' : 'Wheels'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-600 text-sm mt-0.5"></i>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  These are approximate values based on typical drivetrain losses. Actual
                  losses can vary based on modifications, maintenance, and other factors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* ARTICLE SECTION */}
        {/* ============================================ */}
        <article className="mt-10 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 solid-shadow article-content">
          <header className="border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-2xl font-black text-slate-900">
              Understanding Drivetrain Horsepower Loss
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Learn how power is lost between the engine and the wheels, and how to estimate
              your real-world wheel horsepower.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Horsepower</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The power value you want to convert, which can be measured either at the
              crankshaft (engine output) or at the wheels (what reaches the ground).
              Crankshaft horsepower is always higher than wheel horsepower due to power
              losses through the drivetrain.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Measurement Location</h2>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">At Crankshaft:</strong> Also known as brake
                horsepower (BHP) or engine horsepower. This is what manufacturers typically
                advertise and what engine dynos measure directly from the engine.
              </li>
              <li>
                <strong className="text-slate-900">At Wheels:</strong> Also called wheel
                horsepower (WHP). This is what chassis dynos measure and represents the actual
                power delivered to the ground after drivetrain losses.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Drivetrain Type</h2>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Front Wheel Drive (FWD):</strong> Generally
                has the lowest power loss (around 10% base) due to the engine and transmission
                being integrated into one unit (transaxle) and a shorter driveline.
              </li>
              <li>
                <strong className="text-slate-900">Rear Wheel Drive (RWD):</strong> Slightly
                higher losses (around 13% base) due to having a longer driveshaft and separate
                transmission and differential.
              </li>
              <li>
                <strong className="text-slate-900">All Wheel Drive (AWD):</strong> Highest power
                loss (around 18% base) due to the complex drivetrain system including transfer
                cases, additional differentials, and more rotating mass.
              </li>
              <li>
                <strong className="text-slate-900">Four Wheel Drive (4WD):</strong> Highest
                power loss (around 20% base) due to the robust transfer case, typically for
                off-road use with selectable 4WD modes and often mechanical engagement.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Transmission Type</h2>
            <p className="text-slate-600 text-sm mb-3">
              Each transmission type adds different levels of power loss to the base
              drivetrain loss:
            </p>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Manual:</strong> Lowest additional loss
                (+2%) due to its mechanical simplicity.
              </li>
              <li>
                <strong className="text-slate-900">Automatic:</strong> Higher losses (+3%) due
                to the torque converter and more complex internals.
              </li>
              <li>
                <strong className="text-slate-900">Dual Clutch (DCT):</strong> Moderate losses
                (+2.5%) combining some benefits of both manual and automatic designs.
              </li>
              <li>
                <strong className="text-slate-900">Continuously Variable (CVT):</strong>
                Highest transmission loss (+3.5%) due to the belt/chain drive system.
              </li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>
              Note on Accuracy
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              These values are approximations and actual losses can vary based on:
              transmission and differential condition, drivetrain maintenance, modifications
              and upgrades, operating temperature, vehicle age, and mileage.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}