'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
interface GearRatio {
  id: string;
  ratio: string;
}

/* ---------- CONSTANTS ---------- */
const MPH_PER_KMH = 0.621371;

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
export default function VehicleSpeedCalculator() {
  /* ---------- STATE: Tyre Setup ---------- */
  const [wheelSize, setWheelSize] = useState('17');       // inches
  const [tyreWidth, setTyreWidth] = useState('225');      // mm
  const [aspectRatio, setAspectRatio] = useState('45');   // %

  /* ---------- STATE: Engine ---------- */
  const [maxRpm, setMaxRpm] = useState('7000');

  /* ---------- STATE: Gear Ratios ---------- */
  const [finalDrive, setFinalDrive] = useState('3.42');
  const [gears, setGears] = useState<GearRatio[]>([
    { id: '1', ratio: '3.25' },
    { id: '2', ratio: '2.10' },
    { id: '3', ratio: '1.45' },
    { id: '4', ratio: '1.00' },
    { id: '5', ratio: '0.80' },
    { id: '6', ratio: '0.65' },
  ]);

  /* ---------- HANDLERS: Gears ---------- */
  const addGear = () => {
    setGears([...gears, { id: String(Date.now()), ratio: '1.00' }]);
  };

  const removeGear = (id: string) => {
    if (gears.length <= 1) return;
    setGears(gears.filter((g) => g.id !== id));
  };

  const updateGear = (id: string, value: string) => {
    setGears(gears.map((g) => (g.id === id ? { ...g, ratio: value } : g)));
  };

  const resetCalculator = () => {
    setWheelSize('17');
    setTyreWidth('225');
    setAspectRatio('45');
    setMaxRpm('7000');
    setFinalDrive('3.42');
    setGears([
      { id: '1', ratio: '3.25' },
      { id: '2', ratio: '2.10' },
      { id: '3', ratio: '1.45' },
      { id: '4', ratio: '1.00' },
      { id: '5', ratio: '0.80' },
      { id: '6', ratio: '0.65' },
    ]);
  };

  /* ---------- CALCULATIONS ---------- */
  const tyreCircumference = useMemo(() => {
    const wheel = parseFloat(wheelSize) || 0;
    const width = parseFloat(tyreWidth) || 0;
    const aspect = parseFloat(aspectRatio) || 0;

    // Tyre Circumference (mm) = π × (Wheel inches × 25.4 + ((Width mm × Aspect %) / 100) × 2)
    const sidewall = (width * aspect) / 100;
    const totalDiameter = wheel * 25.4 + sidewall * 2;
    return Math.PI * totalDiameter;
  }, [wheelSize, tyreWidth, aspectRatio]);

  const speedResults = useMemo(() => {
    const rpm = parseFloat(maxRpm) || 0;
    const fd = parseFloat(finalDrive) || 0;
    const circumferenceM = tyreCircumference / 1000; // mm -> meters

    return gears.map((gear, index) => {
      const gr = parseFloat(gear.ratio) || 0;

      if (gr <= 0 || fd <= 0 || circumferenceM <= 0) {
        return { gear: index + 1, kmh: 0, mph: 0, ratio: gr };
      }

      // Speed (KMH) = (((RPM / Gear Ratio / Final Drive) × Circumference in mm) / 1,000,000) × 60
      const kmh = (((rpm / gr / fd) * tyreCircumference) / 1000000) * 60;
      const mph = kmh * MPH_PER_KMH;

      return { gear: index + 1, kmh, mph, ratio: gr };
    });
  }, [maxRpm, finalDrive, gears, tyreCircumference]);

  /* ---------- QUICK PRESETS ---------- */
  const PRESETS = [
    { name: 'Sport Compact', wheel: 17, width: 225, aspect: 45, rpm: 7000, final: 3.42, gears: [3.25, 2.10, 1.45, 1.00, 0.80, 0.65] },
    { name: 'Muscle Car', wheel: 18, width: 275, aspect: 40, rpm: 6500, final: 3.73, gears: [3.36, 2.09, 1.49, 1.00, 0.79, 0.65] },
    { name: 'Off-Road 4x4', wheel: 17, width: 265, aspect: 70, rpm: 5500, final: 4.10, gears: [3.83, 2.36, 1.69, 1.00, 0.72] },
    { name: 'Fuel Economy', wheel: 16, width: 205, aspect: 55, rpm: 6000, final: 3.21, gears: [3.46, 1.94, 1.28, 0.92, 0.71] },
    { name: 'Race Car', wheel: 18, width: 245, aspect: 35, rpm: 8500, final: 4.30, gears: [2.92, 2.04, 1.55, 1.20, 1.00, 0.85] },
    { name: 'Diesel Truck', wheel: 20, width: 275, aspect: 65, rpm: 4000, final: 3.55, gears: [4.71, 2.98, 1.87, 1.41, 1.00, 0.83] },
  ];

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setWheelSize(String(preset.wheel));
    setTyreWidth(String(preset.width));
    setAspectRatio(String(preset.aspect));
    setMaxRpm(String(preset.rpm));
    setFinalDrive(String(preset.final));
    setGears(preset.gears.map((r, i) => ({ id: String(i + 1), ratio: String(r) })));
  };

  /* ---------- TOP SPEED ---------- */
  const topSpeed = speedResults.length > 0
    ? speedResults.reduce((max, r) => (r.kmh > max.kmh ? r : max), speedResults[0])
    : { kmh: 0, mph: 0, gear: 0 };

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ===== Info Banner ===== */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
          <div className="flex items-start">
            <i className="fa-solid fa-gauge-high text-blue-600 text-lg mt-0.5 mr-3"></i>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Vehicle Speed Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Calculate your vehicle&apos;s top speed in each gear by entering the gear
                ratio, engine RPM, and tire size.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ============================================ */}
          {/* LEFT: INPUTS */}
          {/* ============================================ */}
          <div className="lg:col-span-7 space-y-6">

            {/* --- Wheel & Tyre Setup --- */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-circle-dot text-blue-600"></i> Wheel &amp; Tyre Setup
                </h3>
                <button
                  onClick={resetCalculator}
                  className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Wheel Size */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Wheel Size
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="number" step="any" value={wheelSize}
                      onChange={(e) => setWheelSize(e.target.value)}
                      className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                    />
                    <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-3 text-[10px] font-bold text-slate-600">in</span>
                  </div>
                </div>

                {/* Tyre Width */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Tyre Width
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="number" step="any" value={tyreWidth}
                      onChange={(e) => setTyreWidth(e.target.value)}
                      className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                    />
                    <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-3 text-[10px] font-bold text-slate-600">mm</span>
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Aspect Ratio
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="number" step="any" value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                    />
                    <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-3 text-[10px] font-bold text-slate-600">%</span>
                  </div>
                </div>
              </div>

              {/* Tyre Circumference Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Tyre Circumference
                </span>
                <span className="text-lg font-black text-blue-600">
                  {formatNumber(tyreCircumference)} mm
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                e.g. 225/45R17 means width 225mm, aspect 45%, wheel 17 inches.
              </p>
            </div>

            {/* --- Engine Information --- */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <i className="fa-solid fa-tachometer-alt text-blue-600"></i> Engine Information
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Maximum Engine RPM
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={maxRpm}
                    onChange={(e) => setMaxRpm(e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">RPM</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Use redline RPM for top speed, or lower values for speed at specific RPM.
                </p>
              </div>
            </div>

            {/* --- Gear Ratios --- */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-gears text-blue-600"></i> Gear Ratios
                </h3>
                <button
                  onClick={addGear}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-plus"></i> Add Gear
                </button>
              </div>

              {/* Final Drive */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Final Drive Ratio
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={finalDrive}
                    onChange={(e) => setFinalDrive(e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                    : 1
                  </span>
                </div>
              </div>

              {/* Gear Inputs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Gear Ratios
                </label>
                {gears.map((gear, index) => (
                  <div key={gear.id} className="flex items-center gap-2">
                    <span className="w-16 text-xs font-bold text-slate-500 text-center bg-slate-100 rounded-md py-2.5 border border-slate-200">
                      #{index + 1}
                    </span>
                    <input
                      type="number" step="any" value={gear.ratio}
                      onChange={(e) => updateGear(gear.id, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                      placeholder="Ratio"
                    />
                    <button
                      onClick={() => removeGear(gear.id)}
                      disabled={gears.length <= 1}
                      className={`w-10 h-10 rounded-md border flex items-center justify-center transition-colors ${
                        gears.length <= 1
                          ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                          : 'bg-white border-rose-200 text-rose-500 hover:bg-rose-50'
                      }`}
                      aria-label="Remove gear"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500">
                Click &quot;Add Gear&quot; to add more, or the red &quot;x&quot; to remove.
              </p>
            </div>

            {/* --- Quick Presets --- */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                Load Quick Vehicle Preset:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="text-[11px] font-bold py-2.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-colors text-left"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ============================================ */}
          {/* RIGHT: RESULTS */}
          {/* ============================================ */}
          <div className="lg:col-span-5 space-y-6">

            {/* Primary Result Card */}
            <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 solid-shadow">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Top Speed Result
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  {topSpeed.gear > 0 ? `Gear #${topSpeed.gear}` : '—'}
                </span>
              </div>

              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Maximum Speed
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-extrabold text-blue-400 tracking-tight">
                    {formatNumber(topSpeed.kmh)}
                  </span>
                  <span className="text-lg font-bold text-slate-300">km/h</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  ≈ {formatNumber(topSpeed.mph)} mph
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tyre Circumference</span>
                  <span className="text-white font-semibold">{formatNumber(tyreCircumference)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Engine RPM</span>
                  <span className="text-white font-semibold">{formatNumber(parseFloat(maxRpm) || 0, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Final Drive</span>
                  <span className="text-white font-semibold">{finalDrive} : 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Gears</span>
                  <span className="text-white font-semibold">{gears.length}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const text = `Top Speed: ${formatNumber(topSpeed.kmh)} km/h (${formatNumber(topSpeed.mph)} mph) in gear #${topSpeed.gear}`;
                  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
                }}
                className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 border border-slate-700 text-xs"
              >
                <i className="fa-regular fa-copy"></i> Copy Top Speed
              </button>
            </div>

            {/* Info Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-600 text-sm mt-0.5"></i>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Calculations are theoretical and assume no tyre slip, perfect traction,
                  and no aerodynamic drag. Real-world top speed may be lower.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================ */}
        {/* SPEED PER GEAR TABLE */}
        {/* ============================================ */}
        <div className="mt-10 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 solid-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-table text-blue-600"></i>
              Speed Per Gear
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
              Tyre Circumference: {formatNumber(tyreCircumference)} mm
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Gear</th>
                  <th className="p-3.5">Ratio</th>
                  <th className="p-3.5">Speed (MPH)</th>
                  <th className="p-3.5">Speed (KM/H)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {speedResults.map((row) => (
                  <tr key={row.gear} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">#{row.gear}</td>
                    <td className="p-3.5 text-slate-600">{row.ratio.toFixed(2)}</td>
                    <td className="p-3.5 font-bold text-blue-600">{formatNumber(row.mph)}</td>
                    <td className="p-3.5 font-bold text-slate-800">{formatNumber(row.kmh)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================ */}
        {/* ARTICLE SECTION */}
        {/* ============================================ */}
        <article className="mt-10 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 solid-shadow article-content">
          <header className="border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-2xl font-black text-slate-900">
              Vehicle Speed Calculator
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Calculate your vehicle&apos;s top speed in each gear by entering the gear
              ratio, engine RPM, and tire size.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Wheel &amp; Tyre Setup</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              This is where you enter the size of your wheels and tyres. The wheel size is
              in inches, tyre width in millimetres and the tyre height ratio as a
              percentage of the width — all of these values can usually be found on the
              sidewall of your tyre. These values are used to calculate your overall
              tyre&apos;s circumference, which is then used in the speed calculations.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Engine Information</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Enter the engine&apos;s maximum RPM here, or alternatively play around with
              this number to calculate the speed at different RPMs. Use redline RPM for
              theoretical top speed, or lower values for speed at specific engine speeds.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Gear Ratios</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Here you can enter your final drive ratio (also known as the differential
              ratio). As well as the ratios for as many gears as you like. Simply click the
              &quot;Add Gear&quot; button to add another gear to the calculation, or the red
              &quot;x&quot; box next to each input to remove a gear.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              How to Calculate the Speed from Tyre Size, Engine Speed and Gear Ratios
            </h2>
            <p className="text-slate-600 text-sm mb-3">
              The first step in the process is to calculate the tyre&apos;s circumference
              with this formula:
            </p>

            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center mb-4">
              <span className="text-blue-400 font-bold">Tyre Circumference</span> ={' '}
              <span className="text-slate-300">π</span> ×{' '}
              (<span className="text-emerald-400">Wheel (in)</span> ×{' '}
              <span className="text-amber-400">25.4</span> + (
              <span className="text-purple-400">Tyre Width (mm)</span> ×{' '}
              <span className="text-rose-400">Aspect Ratio %</span>) ÷ 100) ×{' '}
              <span className="text-slate-300">2</span>)
            </div>

            <p className="text-slate-600 text-sm mb-3">
              We then use the tyre circumference value to calculate the speed using this
              formula:
            </p>

            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center mb-3">
              <span className="text-blue-400 font-bold">Speed (KMH)</span> = (
              ((<span className="text-emerald-400">RPM</span> ÷{' '}
              <span className="text-amber-400">Gear Ratio</span> ÷{' '}
              <span className="text-purple-400">Final Drive</span>) ×{' '}
              <span className="text-slate-300">Circumference (mm)</span>) ÷{' '}
              <span className="text-rose-400">1,000,000</span>) ×{' '}
              <span className="text-slate-300">60</span>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center">
              <span className="text-blue-400 font-bold">Speed (MPH)</span> ={' '}
              <span className="text-emerald-400">Speed (KMH)</span> ×{' '}
              <span className="text-amber-400">0.621371</span>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Example Calculation</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Wheel Size:</span>
                <span className="font-bold text-slate-900">17 inches</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tyre Width:</span>
                <span className="font-bold text-slate-900">225 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Aspect Ratio:</span>
                <span className="font-bold text-slate-900">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Engine RPM:</span>
                <span className="font-bold text-slate-900">7,000 RPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Final Drive:</span>
                <span className="font-bold text-slate-900">3.42 : 1</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="text-slate-600">Gear 1 (3.25 : 1):</span>
                <span className="font-bold text-blue-600">≈ 57.07 km/h (35.38 mph)</span>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Understanding Gear Ratios</h2>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Lower (numerically higher) ratios:</strong>{' '}
                Provide more torque multiplication and acceleration, but lower top speed.
                Used for first gear.
              </li>
              <li>
                <strong className="text-slate-900">Higher (numerically lower) ratios:</strong>{' '}
                Provide less torque multiplication but higher top speed and better fuel
                economy. Used for overdrive gears.
              </li>
              <li>
                <strong className="text-slate-900">Final drive ratio:</strong> Multiplies
                the effect of the transmission gear ratios. A numerically higher final
                drive improves acceleration at the cost of top speed.
              </li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>
              Note on Accuracy
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Calculations are theoretical and assume no tyre slip, perfect traction, and
              no aerodynamic drag. Real-world top speed may be lower due to drag, rolling
              resistance, engine power limits, and road conditions. Always drive safely and
              within legal limits.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}