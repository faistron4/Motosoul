'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
type PowerUnit = 'kW' | 'hp';
type SolveFor = 'kw' | 'hp';

/* ---------- CONSTANTS ---------- */
const KW_TO_HP = 1.34102209;
const HP_TO_KW = 1 / KW_TO_HP;

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
export default function KwToHpCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>('kw');

  // Inputs
  const [kwValue, setKwValue] = useState('300');
  const [hpValue, setHpValue] = useState(formatNumber(300 * KW_TO_HP));

  /* ---------- CALCULATIONS ---------- */
  const result = useMemo(() => {
    if (solveFor === 'kw') {
      const kw = parseFloat(kwValue) || 0;
      const hp = kw * KW_TO_HP;
      return { input: kw, inputUnit: 'kW' as PowerUnit, output: hp, outputUnit: 'hp' as PowerUnit };
    } else {
      const hp = parseFloat(hpValue) || 0;
      const kw = hp * HP_TO_KW;
      return { input: hp, inputUnit: 'hp' as PowerUnit, output: kw, outputUnit: 'kW' as PowerUnit };
    }
  }, [solveFor, kwValue, hpValue]);

  /* ---------- SYNC: when switching mode, sync the other field ---------- */
  const switchSolveFor = (mode: SolveFor) => {
    if (mode === solveFor) return;

    if (mode === 'hp') {
      // Solving for HP → keep kW input, recompute HP
      const kw = parseFloat(kwValue) || 0;
      setHpValue(formatNumber(kw * KW_TO_HP));
    } else {
      // Solving for kW → keep HP input, recompute kW
      const hp = parseFloat(hpValue) || 0;
      setKwValue(formatNumber(hp * HP_TO_KW));
    }
    setSolveFor(mode);
  };

  /* ---------- HANDLERS ---------- */
  const handleKwChange = (value: string) => {
    setKwValue(value);
    const kw = parseFloat(value) || 0;
    setHpValue(formatNumber(kw * KW_TO_HP));
  };

  const handleHpChange = (value: string) => {
    setHpValue(value);
    const hp = parseFloat(value) || 0;
    setKwValue(formatNumber(hp * HP_TO_KW));
  };

  const resetCalculator = () => {
    setSolveFor('kw');
    setKwValue('300');
    setHpValue(formatNumber(300 * KW_TO_HP));
  };

  /* ---------- QUICK PRESETS ---------- */
  const PRESETS = [
    { name: '1.0L Turbo (74 kW)', kw: 74 },
    { name: '1.5L (110 kW)', kw: 110 },
    { name: '2.0L Turbo (150 kW)', kw: 150 },
    { name: '2.0L Performance (206 kW)', kw: 206 },
    { name: '3.0L Inline-6 (280 kW)', kw: 280 },
    { name: 'V8 Performance (375 kW)', kw: 375 },
    { name: 'Supercar (566 kW)', kw: 566 },
    { name: 'Hypercar (1103 kW)', kw: 1103 },
  ];

  const loadPreset = (kw: number) => {
    setSolveFor('kw');
    setKwValue(String(kw));
    setHpValue(formatNumber(kw * KW_TO_HP));
  };

  /* ---------- QUICK REFERENCE TABLE ---------- */
  const REFERENCE_ROWS = [
    { kw: 50, hp: 50 * KW_TO_HP },
    { kw: 75, hp: 75 * KW_TO_HP },
    { kw: 100, hp: 100 * KW_TO_HP },
    { kw: 125, hp: 125 * KW_TO_HP },
    { kw: 150, hp: 150 * KW_TO_HP },
    { kw: 200, hp: 200 * KW_TO_HP },
    { kw: 250, hp: 250 * KW_TO_HP },
    { kw: 300, hp: 300 * KW_TO_HP },
    { kw: 400, hp: 400 * KW_TO_HP },
    { kw: 500, hp: 500 * KW_TO_HP },
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
            <i className="fa-solid fa-bolt text-blue-600 text-lg mt-0.5 mr-3"></i>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Kilowatts to Horsepower Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Convert kilowatts (kW) to horsepower (HP) and HP to kW with our easy-to-use power calculator.
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

            {/* Solve Mode Switcher */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                Convert:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => switchSolveFor('hp')}
                  className={`text-xs font-bold py-2.5 px-3 rounded-md border transition-colors ${
                    solveFor === 'hp'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-arrow-right mr-1.5"></i>
                  kW → HP
                </button>
                <button
                  onClick={() => switchSolveFor('kw')}
                  className={`text-xs font-bold py-2.5 px-3 rounded-md border transition-colors ${
                    solveFor === 'kw'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-arrow-left mr-1.5"></i>
                  HP → kW
                </button>
              </div>
            </div>

            {/* Kilowatts Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                <span>Kilowatts (kW)</span>
                {solveFor === 'kw' && (
                  <span className="text-blue-600 font-normal text-[11px]">(Calculated Output)</span>
                )}
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter kilowatts..."
                  value={kwValue}
                  readOnly={solveFor === 'kw'}
                  onChange={(e) => handleKwChange(e.target.value)}
                  className={`block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10 ${
                    solveFor === 'kw' ? 'bg-slate-100' : ''
                  }`}
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  kW
                </span>
              </div>
            </div>

            {/* Horsepower Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                <span>Horsepower (HP)</span>
                {solveFor === 'hp' && (
                  <span className="text-blue-600 font-normal text-[11px]">(Calculated Output)</span>
                )}
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter horsepower..."
                  value={hpValue}
                  readOnly={solveFor === 'hp'}
                  onChange={(e) => handleHpChange(e.target.value)}
                  className={`block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10 ${
                    solveFor === 'hp' ? 'bg-slate-100' : ''
                  }`}
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  HP
                </span>
              </div>
            </div>

            {/* Conversion Formula Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Conversion Formula
              </div>
              <div className="font-mono text-sm text-slate-800">
                {solveFor === 'hp' ? (
                  <>
                    <span className="text-blue-600 font-bold">HP</span> ={' '}
                    <span className="text-slate-900">kW</span> ×{' '}
                    <span className="text-emerald-600 font-bold">1.34102209</span>
                  </>
                ) : (
                  <>
                    <span className="text-blue-600 font-bold">kW</span> ={' '}
                    <span className="text-slate-900">HP</span> ×{' '}
                    <span className="text-emerald-600 font-bold">0.7457</span>
                  </>
                )}
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
                    onClick={() => loadPreset(preset.kw)}
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
                  Converted Result
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  {solveFor === 'hp' ? 'kW → HP' : 'HP → kW'}
                </span>
              </div>

              {/* Primary Result */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  {result.outputUnit === 'hp' ? 'Horsepower (HP)' : 'Kilowatts (kW)'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-extrabold text-blue-400 tracking-tight">
                    {formatNumber(result.output)}
                  </span>
                  <span className="text-lg font-bold text-slate-300">{result.outputUnit}</span>
                </div>
              </div>

              {/* Input Value */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Input Value
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    {formatNumber(result.input)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">{result.inputUnit}</span>
                </div>
              </div>

              {/* Full Conversion Equation */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/80 rounded-lg p-3 text-center">
                  <span className="text-sm font-mono text-slate-300">
                    {formatNumber(result.input)} {result.inputUnit}{' '}
                    <span className="text-blue-400 font-bold">=</span>{' '}
                    <span className="text-emerald-400 font-bold">
                      {formatNumber(result.output)} {result.outputUnit}
                    </span>
                  </span>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  const text = `${formatNumber(result.output)} ${result.outputUnit}`;
                  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
                }}
                className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 border border-slate-700 text-xs"
              >
                <i className="fa-regular fa-copy"></i> Copy Result
              </button>
            </div>

            {/* Info Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-600 text-sm mt-0.5"></i>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  This calculator uses the mechanical (imperial) horsepower definition.
                  1 kW = 1.34102209 HP. For metric horsepower (PS), the conversion
                  differs slightly.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================ */}
        {/* QUICK REFERENCE TABLE */}
        {/* ============================================ */}
        <div className="mt-10 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 solid-shadow">
          <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <i className="fa-solid fa-table text-blue-600"></i>
            Quick Reference: Common kW to HP Conversions
          </h2>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Kilowatts (kW)</th>
                  <th className="p-3.5">Horsepower (HP)</th>
                  <th className="p-3.5">Metric HP (PS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {REFERENCE_ROWS.map((row) => (
                  <tr key={row.kw} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{row.kw} kW</td>
                    <td className="p-3.5 font-bold text-blue-600">{formatNumber(row.hp)} HP</td>
                    <td className="p-3.5 text-slate-500">{formatNumber(row.kw * 1.35962)} PS</td>
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
              Understanding kW to HP Conversion
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Learn how to convert between kilowatts and horsepower, and understand the
              different definitions of these power units.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">What is a Kilowatt (kW)?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              A kilowatt is a metric unit of power equal to 1,000 watts. It measures the
              rate at which work is done or energy is transferred. In the context of
              engines and motors, kilowatts tell you how much power an engine can produce
              over time. This is the standard measurement used in most of Europe and many
              other parts of the world, as well as in the International System of Units (SI).
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              Electric vehicles and motors often use kW as their primary power unit, while
              many European car manufacturers also quote engine power in kW alongside
              traditional horsepower figures.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">What is Horsepower (HP)?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Horsepower is a unit of power that originated in the late 18th century when
              James Watt needed a way to compare the power of steam engines to the work
              done by draft horses. It has since become the standard unit for measuring
              engine power in the UK and US.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              While there are several different definitions of horsepower, this calculator
              uses mechanical or brake horsepower (bhp), which is the most commonly used
              for cars and is equivalent to 745.7 watts or 0.7457 kilowatts.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">The Conversion Formula</h2>
            <p className="text-slate-600 text-sm mb-3">
              Converting between kW and HP is straightforward once you know the conversion
              factor:
            </p>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-sm text-center mb-3">
              <span className="text-blue-400 font-bold">1 kW</span> ={' '}
              <span className="text-emerald-400 font-bold">1.34102209 HP</span>
            </div>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-sm text-center mb-3">
              <span className="text-blue-400 font-bold">1 HP</span> ={' '}
              <span className="text-emerald-400 font-bold">0.7457 kW</span>
            </div>
            <p className="text-slate-600 text-sm mb-2">
              To convert from kW to HP:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm text-center mb-3">
              <span className="text-slate-800 font-bold">HP = kW × 1.34102209</span>
            </div>
            <p className="text-slate-600 text-sm mb-2">
              To convert from HP to kW:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm text-center">
              <span className="text-slate-800 font-bold">kW = HP × 0.7457</span>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Mechanical vs. Metric Horsepower</h2>
            <p className="text-slate-600 text-sm mb-3">
              It&apos;s important to note that there are two main definitions of horsepower:
            </p>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Mechanical (Imperial) Horsepower (hp or bhp):</strong>{' '}
                The standard used in the UK, US, and most English-speaking countries. 1 hp = 745.7 watts.
                This is what this calculator uses.
              </li>
              <li>
                <strong className="text-slate-900">Metric Horsepower (PS or cv):</strong> Used in
                Germany, France, and several other European countries. 1 PS = 735.5 watts, or
                approximately 0.9863 mechanical horsepower.
              </li>
            </ul>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              The slight difference (about 1.4%) means that an engine rated at 100 kW
              produces about 134.1 mechanical HP or about 136 PS. When comparing figures
              across regions, it&apos;s essential to know which standard is being used.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Why Convert Between kW and HP?</h2>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Comparing vehicles from different markets:</strong>{' '}
                European cars typically quote kW, while US and UK cars quote HP. Converting
                allows you to compare like-for-like.
              </li>
              <li>
                <strong className="text-slate-900">Reading dyno charts:</strong> Dyno results
                can be presented in either unit depending on the equipment and operator&apos;s
                preference.
              </li>
              <li>
                <strong className="text-slate-900">Regulatory and insurance purposes:</strong>{' '}
                Some countries base taxes or insurance premiums on kW ratings, while others
                use HP.
              </li>
              <li>
                <strong className="text-slate-900">Electric vehicle comparisons:</strong> EVs
                are often rated in kW, so converting to HP helps traditional enthusiasts
                understand their performance.
              </li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-lightbulb text-amber-500 mr-2"></i>
              Quick Tip
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              A simple rule of thumb: multiply kW by 1.34 to get a quick HP estimate, or
              divide HP by 1.34 to get kW. For example, 150 kW × 1.34 ≈ 201 HP. This is
              accurate enough for most casual conversations.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}