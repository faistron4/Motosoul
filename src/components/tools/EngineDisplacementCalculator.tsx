'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
type LengthUnit = 'mm' | 'in' | 'cm';

/* ---------- UNIT CONVERSIONS (to mm base) ---------- */
const LENGTH_TO_MM: Record<LengthUnit, number> = {
  mm: 1,
  in: 25.4,
  cm: 10,
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
export default function EngineDisplacementCalculator() {
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('mm');
  const [bore, setBore] = useState('86');
  const [stroke, setStroke] = useState('86');
  const [cylinders, setCylinders] = useState('4');

  /* ---------- CONVERT TO MM ---------- */
  const boreMm = (parseFloat(bore) || 0) * LENGTH_TO_MM[lengthUnit];
  const strokeMm = (parseFloat(stroke) || 0) * LENGTH_TO_MM[lengthUnit];
  const numCylinders = Math.max(1, parseInt(cylinders) || 1);

  /* ---------- CALCULATIONS ---------- */
  const displacement = useMemo(() => {
    if (boreMm <= 0 || strokeMm <= 0) {
      return { cc: 0, liters: 0, ci: 0, perCylinder: 0 };
    }

    // Volume per cylinder (mm³) = π × (bore/2)² × stroke
    const perCylinderMm3 =
      Math.PI * Math.pow(boreMm / 2, 2) * strokeMm;

    // Total displacement (mm³)
    const totalMm3 = perCylinderMm3 * numCylinders;

    // Conversions
    const cc = totalMm3 / 1000;           // 1 cc = 1000 mm³
    const liters = cc / 1000;             // 1 L = 1000 cc
    const ci = cc / 16.387064;            // 1 in³ = 16.387064 cc
    const perCylinder = cc / numCylinders;

    return { cc, liters, ci, perCylinder };
  }, [boreMm, strokeMm, numCylinders]);

  /* ---------- HANDLERS ---------- */
  const resetCalculator = () => {
    setBore('86');
    setStroke('86');
    setCylinders('4');
    setLengthUnit('mm');
  };

  const switchUnit = (newUnit: LengthUnit) => {
    if (newUnit === lengthUnit) return;
    const factor = LENGTH_TO_MM[lengthUnit] / LENGTH_TO_MM[newUnit];
    setBore((prev) => {
      const val = parseFloat(prev) || 0;
      return (val * factor).toFixed(2);
    });
    setStroke((prev) => {
      const val = parseFloat(prev) || 0;
      return (val * factor).toFixed(2);
    });
    setLengthUnit(newUnit);
  };

  /* ---------- QUICK PRESETS ---------- */
  const loadPreset = (preset: {
    name: string;
    bore: number;
    stroke: number;
    cylinders: number;
  }) => {
    setBore(String(preset.bore));
    setStroke(String(preset.stroke));
    setCylinders(String(preset.cylinders));
    setLengthUnit('mm');
  };

  const PRESETS = [
    { name: '1.6L Inline-4', bore: 79, stroke: 81.5, cylinders: 4 },
    { name: '2.0L Inline-4', bore: 86, stroke: 86, cylinders: 4 },
    { name: '3.0L Inline-6', bore: 84, stroke: 90, cylinders: 6 },
    { name: '5.0L V8', bore: 92.2, stroke: 92.8, cylinders: 8 },
    { name: '6.2L V8 (LS3)', bore: 103.25, stroke: 92, cylinders: 8 },
    { name: '4.0L Flat-6', bore: 102, stroke: 81.5, cylinders: 6 },
    { name: '1.0L Inline-3', bore: 71.5, stroke: 82, cylinders: 3 },
    { name: '2.5L Inline-5', bore: 82.5, stroke: 92.8, cylinders: 5 },
  ];

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ===== Info Banner ===== */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
          <div className="flex items-start">
            <i className="fa-solid fa-gears text-blue-600 text-lg mt-0.5 mr-3"></i>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Engine Displacement Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Quickly calculate your engine&apos;s displacement using bore size, stroke
                length, and cylinder count. Get instant and accurate results.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ============================================ */}
          {/* LEFT: INPUTS */}
          {/* ============================================ */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-6">

            {/* Header */}
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

            {/* Length Unit Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Length Unit
              </span>
              <div className="flex rounded-md border border-slate-200 overflow-hidden">
                {(['mm', 'cm', 'in'] as LengthUnit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => switchUnit(u)}
                    className={`px-4 py-1.5 text-xs font-bold transition-colors ${
                      lengthUnit === u
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Bore Size */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Bore Size (diameter of each cylinder)
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter bore size..."
                  value={bore}
                  onChange={(e) => setBore(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  {lengthUnit}
                </span>
              </div>
            </div>

            {/* Stroke Length */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Stroke Length (piston travel distance)
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter stroke length..."
                  value={stroke}
                  onChange={(e) => setStroke(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  {lengthUnit}
                </span>
              </div>
            </div>

            {/* Number of Cylinders */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Number of Cylinders
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="Enter number of cylinders..."
                  value={cylinders}
                  onChange={(e) => setCylinders(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  cyl
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Load Quick Engine Preset:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="text-[11px] font-bold py-2 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-colors"
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

            {/* Primary Results Card */}
            <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 solid-shadow">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Engine Displacement
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  Result
                </span>
              </div>

              {/* Primary Result — Cubic Inches */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Cubic Inches (in³)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-blue-400 tracking-tight">
                    {formatNumber(displacement.ci)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">in³</span>
                </div>
              </div>

              {/* Liters */}
              <div className="mb-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Liters (L)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                    {formatNumber(displacement.liters, 3)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">L</span>
                </div>
              </div>

              {/* Cubic Centimeters */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Cubic Centimeters (cc)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-amber-400 tracking-tight">
                    {formatNumber(displacement.cc, 1)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">cc</span>
                </div>
              </div>

              {/* Per Cylinder */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Displacement Per Cylinder
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-extrabold text-white tracking-tight">
                    {formatNumber(displacement.perCylinder, 1)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">cc</span>
                </div>
              </div>

              {/* Input Summary */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bore</span>
                  <span className="text-white font-semibold">
                    {formatNumber(parseFloat(bore) || 0)} {lengthUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stroke</span>
                  <span className="text-white font-semibold">
                    {formatNumber(parseFloat(stroke) || 0)} {lengthUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cylinders</span>
                  <span className="text-white font-semibold">{numCylinders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bore/Stroke Ratio</span>
                  <span className="text-white font-semibold">
                    {strokeMm > 0 ? formatNumber(boreMm / strokeMm, 3) : '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-600 text-sm mt-0.5"></i>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Measurements should be taken with precision. Even small errors in bore or
                  stroke measurements can significantly affect the calculated displacement.
                  Always verify with manufacturer specifications.
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
              Understanding Engine Displacement
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Learn what engine displacement means, how it&apos;s calculated, and why it
              matters for performance.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">What is Engine Displacement?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Engine displacement is the total volume swept by all the pistons inside the
              cylinders of an engine during one complete cycle. It represents the total
              amount of air-fuel mixture the engine can theoretically draw in and combust.
              Displacement is typically measured in cubic centimeters (cc), liters (L), or
              cubic inches (in³).
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              For example, a 2.0L engine displaces 2,000 cc of volume across all its
              cylinders. This figure is one of the most fundamental specifications of any
              internal combustion engine.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Understanding the Different Parameters</h2>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Number of Cylinders</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              This is quite simply the number of cylinders your engine has. More cylinders
              generally mean more total displacement (for the same bore and stroke), smoother
              operation, and potentially more power. Common configurations include inline-3,
              inline-4, inline-6, V6, V8, V10, and V12.
            </p>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Bore Size</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The bore size is the diameter of each cylinder. A larger bore allows for
              larger valves and better breathing at high RPMs. Bore is typically measured
              in millimeters (mm) or inches (in).
            </p>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Stroke Length</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The stroke length is how far the piston travels inside the cylinder from top
              dead center (TDC) to bottom dead center (BDC). A longer stroke generally
              produces more torque at lower RPMs, while a shorter stroke allows for higher
              RPM limits.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">How to Calculate Engine Displacement</h2>
            <p className="text-slate-600 text-sm mb-3">
              The formula to calculate an engine&apos;s displacement is based on the volume
              of a cylinder:
            </p>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-sm text-center mb-3">
              <span className="text-blue-400 font-bold">Displacement</span> ={' '}
              <span className="text-emerald-400">π</span> × (
              <span className="text-amber-400">½ × Bore</span>)² ×{' '}
              <span className="text-purple-400">Stroke</span> ×{' '}
              <span className="text-rose-400">Cylinders</span>
            </div>
            <p className="text-slate-600 text-sm mb-3">
              Breaking it down step by step:
            </p>
            <ol className="text-slate-600 text-sm space-y-2 list-decimal pl-5">
              <li>
                <strong className="text-slate-900">Calculate the radius:</strong> Divide the
                bore size by 2.
              </li>
              <li>
                <strong className="text-slate-900">Calculate the area:</strong> Multiply π
                (approximately 3.14159) by the radius squared.
              </li>
              <li>
                <strong className="text-slate-900">Calculate single cylinder volume:</strong>{' '}
                Multiply the area by the stroke length.
              </li>
              <li>
                <strong className="text-slate-900">Calculate total displacement:</strong>{' '}
                Multiply the single cylinder volume by the number of cylinders.
              </li>
            </ol>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Unit Conversions</h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase font-bold">
                  <tr>
                    <th className="p-3">From</th>
                    <th className="p-3">To</th>
                    <th className="p-3">Multiply By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Cubic Inches (in³)</td>
                    <td className="p-3 text-slate-600">Cubic Centimeters (cc)</td>
                    <td className="p-3 text-blue-600 font-bold">16.387</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Cubic Centimeters (cc)</td>
                    <td className="p-3 text-slate-600">Cubic Inches (in³)</td>
                    <td className="p-3 text-blue-600 font-bold">0.06102</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Liters (L)</td>
                    <td className="p-3 text-slate-600">Cubic Centimeters (cc)</td>
                    <td className="p-3 text-blue-600 font-bold">1,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Cubic Inches (in³)</td>
                    <td className="p-3 text-slate-600">Liters (L)</td>
                    <td className="p-3 text-blue-600 font-bold">0.01639</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Why Displacement Matters</h2>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Power Potential:</strong> Generally,
                larger displacement engines can produce more power because they can burn
                more air-fuel mixture per cycle.
              </li>
              <li>
                <strong className="text-slate-900">Torque Characteristics:</strong> Larger
                displacement often means more low-end torque, making the engine feel more
                responsive at everyday driving RPMs.
              </li>
              <li>
                <strong className="text-slate-900">Fuel Consumption:</strong> Larger engines
                typically consume more fuel, though modern technology has narrowed this gap
                considerably.
              </li>
              <li>
                <strong className="text-slate-900">Tax & Insurance:</strong> In many
                countries, vehicle taxes and insurance premiums are based partly on engine
                displacement.
              </li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>
              Note on Accuracy
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              This calculator provides theoretical displacement based on the input values.
              Actual engine displacement may vary slightly due to manufacturing tolerances,
              cylinder wear, or aftermarket modifications. Always refer to the
              manufacturer&apos;s specifications for exact figures.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}