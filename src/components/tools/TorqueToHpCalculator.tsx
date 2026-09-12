'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
type TorqueUnit = 'lb-ft' | 'N-m';
type SolveFor = 'hp' | 'torque' | 'rpm';

/* ---------- CONSTANTS ---------- */
const LBFT_TO_NM = 1.35582;
const NM_TO_LBFT = 1 / LBFT_TO_NM;
const HP_PER_KW = 0.7457;
const HP_PER_PS = 0.98632;

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
export default function TorqueToHpCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>('hp');
  const [torqueUnit, setTorqueUnit] = useState<TorqueUnit>('lb-ft');

  const [torqueValue, setTorqueValue] = useState('450');
  const [rpmValue, setRpmValue] = useState('6000');
  const [hpValue, setHpValue] = useState('514.09');

  /* ---------- CONVERT TORQUE TO LB-FT ---------- */
  const torqueLbFt = useMemo(() => {
    const val = parseFloat(torqueValue) || 0;
    return torqueUnit === 'N-m' ? val * NM_TO_LBFT : val;
  }, [torqueValue, torqueUnit]);

  /* ---------- CALCULATIONS ---------- */
  const results = useMemo(() => {
    const rpm = parseFloat(rpmValue) || 0;

    let hp = 0;
    let torqueResult = torqueLbFt;
    let rpmResult = rpm;

    if (solveFor === 'hp') {
      // HP = (Torque × RPM) ÷ 5252
      hp = rpm > 0 ? (torqueLbFt * rpm) / 5252 : 0;
    } else if (solveFor === 'torque') {
      // Torque = (HP × 5252) ÷ RPM
      const inputHp = parseFloat(hpValue) || 0;
      torqueResult = rpm > 0 ? (inputHp * 5252) / rpm : 0;
      hp = inputHp;
    } else {
      // RPM = (HP × 5252) ÷ Torque
      const inputHp = parseFloat(hpValue) || 0;
      rpmResult = torqueLbFt > 0 ? (inputHp * 5252) / torqueLbFt : 0;
      hp = inputHp;
    }

    // Derived values
    const torqueNm = torqueResult * LBFT_TO_NM;
    const hpKw = hp * HP_PER_KW;
    const hpPs = hp / HP_PER_PS;
    const torquePerLitre = torqueResult; // placeholder

    return {
      hp,
      torqueLbFt: torqueResult,
      torqueNm,
      rpm: rpmResult,
      hpKw,
      hpPs,
    };
  }, [solveFor, torqueLbFt, rpmValue, hpValue]);

  /* ---------- SYNC HP WHEN SOLVING FOR HP ---------- */
  const computedHp = useMemo(() => {
    const rpm = parseFloat(rpmValue) || 0;
    return rpm > 0 ? (torqueLbFt * rpm) / 5252 : 0;
  }, [torqueLbFt, rpmValue]);

  /* ---------- HANDLERS ---------- */
  const resetCalculator = () => {
    setSolveFor('hp');
    setTorqueUnit('lb-ft');
    setTorqueValue('450');
    setRpmValue('6000');
    setHpValue('514.09');
  };

  /* ---------- QUICK PRESETS ---------- */
  const PRESETS = [
    { name: 'Economy I4 (150 lb-ft @ 4000)', torque: 150, rpm: 4000, unit: 'lb-ft' as TorqueUnit },
    { name: 'Turbo I4 (300 lb-ft @ 3500)', torque: 300, rpm: 3500, unit: 'lb-ft' as TorqueUnit },
    { name: 'V6 (280 lb-ft @ 4800)', torque: 280, rpm: 4800, unit: 'lb-ft' as TorqueUnit },
    { name: 'V8 Muscle (420 lb-ft @ 4600)', torque: 420, rpm: 4600, unit: 'lb-ft' as TorqueUnit },
    { name: 'Performance V8 (500 lb-ft @ 5500)', torque: 500, rpm: 5500, unit: 'lb-ft' as TorqueUnit },
    { name: 'Diesel (600 lb-ft @ 2000)', torque: 600, rpm: 2000, unit: 'lb-ft' as TorqueUnit },
    { name: 'Sport Bike (80 lb-ft @ 11000)', torque: 80, rpm: 11000, unit: 'lb-ft' as TorqueUnit },
    { name: 'F1 Engine (250 lb-ft @ 15000)', torque: 250, rpm: 15000, unit: 'lb-ft' as TorqueUnit },
  ];

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setSolveFor('hp');
    setTorqueUnit(preset.unit);
    setTorqueValue(String(preset.torque));
    setRpmValue(String(preset.rpm));
  };

  /* ---------- REFERENCE TABLE ---------- */
  const REFERENCE_ROWS = [
    { torque: 100, rpm: 3000, hp: (100 * 3000) / 5252 },
    { torque: 200, rpm: 4000, hp: (200 * 4000) / 5252 },
    { torque: 300, rpm: 5000, hp: (300 * 5000) / 5252 },
    { torque: 400, rpm: 5500, hp: (400 * 5500) / 5252 },
    { torque: 500, rpm: 6000, hp: (500 * 6000) / 5252 },
    { torque: 600, rpm: 6500, hp: (600 * 6500) / 5252 },
    { torque: 700, rpm: 7000, hp: (700 * 7000) / 5252 },
    { torque: 800, rpm: 7500, hp: (800 * 7500) / 5252 },
  ];

  /* ---------- PERFORMANCE CLASSIFICATION ---------- */
  const performanceLevel = (() => {
    const hp = results.hp;
    if (hp >= 600) return { label: 'Extreme Performance', cls: 'bg-rose-600 border-rose-500', icon: 'fa-fire' };
    if (hp >= 400) return { label: 'High Performance', cls: 'bg-purple-600 border-purple-500', icon: 'fa-bolt' };
    if (hp >= 250) return { label: 'Sports Car Level', cls: 'bg-amber-600 border-amber-500', icon: 'fa-gauge-high' };
    if (hp >= 150) return { label: 'Performance Daily', cls: 'bg-teal-600 border-teal-500', icon: 'fa-gauge' };
    if (hp >= 80) return { label: 'Standard Road Car', cls: 'bg-blue-600 border-blue-500', icon: 'fa-car' };
    return { label: 'Economy Vehicle', cls: 'bg-slate-600 border-slate-500', icon: 'fa-leaf' };
  })();

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ===== Info Banner ===== */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
          <div className="flex items-start">
            <i className="fa-solid fa-gauge text-blue-600 text-lg mt-0.5 mr-3"></i>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Torque to Horsepower Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Find your engine&apos;s power output. Enter torque (lb-ft) and RPM for instant
                results using the standard SAE formula.
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
                Solve For:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSolveFor('hp')}
                  className={`text-xs font-bold py-2.5 px-3 rounded-md border transition-colors ${
                    solveFor === 'hp'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-gauge-high mr-1.5"></i>
                  Horsepower
                </button>
                <button
                  onClick={() => setSolveFor('torque')}
                  className={`text-xs font-bold py-2.5 px-3 rounded-md border transition-colors ${
                    solveFor === 'torque'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-gear mr-1.5"></i>
                  Torque
                </button>
                <button
                  onClick={() => setSolveFor('rpm')}
                  className={`text-xs font-bold py-2.5 px-3 rounded-md border transition-colors ${
                    solveFor === 'rpm'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-tachometer-alt mr-1.5"></i>
                  RPM
                </button>
              </div>
            </div>

            {/* Torque Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                <span>Torque</span>
                {solveFor === 'torque' && (
                  <span className="text-blue-600 font-normal text-[11px]">(Calculated Output)</span>
                )}
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter torque..."
                  value={torqueValue}
                  readOnly={solveFor === 'torque'}
                  onChange={(e) => setTorqueValue(e.target.value)}
                  className={`block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10 ${
                    solveFor === 'torque' ? 'bg-slate-100' : ''
                  }`}
                />
                <select
                  value={torqueUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value as TorqueUnit;
                    const val = parseFloat(torqueValue) || 0;
                    if (newUnit !== torqueUnit) {
                      const converted =
                        newUnit === 'N-m' ? val * LBFT_TO_NM : val * NM_TO_LBFT;
                      setTorqueValue(converted.toFixed(2));
                      setTorqueUnit(newUnit);
                    }
                  }}
                  className="rounded-r-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 border-l"
                >
                  <option value="lb-ft">lb-ft</option>
                  <option value="N-m">N·m</option>
                </select>
              </div>
            </div>

            {/* RPM Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                <span>Engine Speed (RPM)</span>
                {solveFor === 'rpm' && (
                  <span className="text-blue-600 font-normal text-[11px]">(Calculated Output)</span>
                )}
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter RPM..."
                  value={rpmValue}
                  readOnly={solveFor === 'rpm'}
                  onChange={(e) => setRpmValue(e.target.value)}
                  className={`block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10 ${
                    solveFor === 'rpm' ? 'bg-slate-100' : ''
                  }`}
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  RPM
                </span>
              </div>
            </div>

            {/* HP Input (for reverse calculation) */}
            {solveFor !== 'hp' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Horsepower (HP)
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    step="any"
                    placeholder="Enter horsepower..."
                    value={hpValue}
                    onChange={(e) => setHpValue(e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                    HP
                  </span>
                </div>
              </div>
            )}

            {/* Formula Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Standard SAE Formula
              </div>
              <div className="font-mono text-sm text-slate-800">
                <span className="text-blue-600 font-bold">HP</span> = (
                <span className="text-slate-900">Torque</span> ×{' '}
                <span className="text-slate-900">RPM</span>) ÷{' '}
                <span className="text-emerald-600 font-bold">5252</span>
              </div>
              <div className="font-mono text-xs text-slate-500 mt-1">
                Where 5252 = 33,000 ft·lb/min ÷ (2π rad/rev)
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
                    className="text-[11px] font-bold py-2 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-colors text-left"
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
                  Calculated Result
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  {solveFor === 'hp' ? 'HP' : solveFor === 'torque' ? 'Torque' : 'RPM'}
                </span>
              </div>

              {/* Primary Result — Horsepower */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Horsepower (HP)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-blue-400 tracking-tight">
                    {formatNumber(results.hp)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">HP</span>
                </div>
              </div>

              {/* Torque */}
              <div className="mb-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Torque
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">
                    {formatNumber(results.torqueLbFt)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">lb-ft</span>
                  <span className="text-xs text-slate-400 ml-1">
                    ({formatNumber(results.torqueNm)} N·m)
                  </span>
                </div>
              </div>

              {/* RPM */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Engine Speed
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-amber-400 tracking-tight">
                    {formatNumber(results.rpm, 0)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">RPM</span>
                </div>
              </div>

              {/* Alternate Power Units */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block mb-2">
                  Equivalent Power Units
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Kilowatts</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {formatNumber(results.hpKw)} kW
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Metric HP (PS)</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {formatNumber(results.hpPs)} PS
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Classification */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">
                  Performance Classification
                </span>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-white border ${performanceLevel.cls}`}>
                  <i className={`fa-solid ${performanceLevel.icon}`}></i>
                  <span>{performanceLevel.label}</span>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  const text = `${formatNumber(results.hp)} HP @ ${formatNumber(results.rpm, 0)} RPM (${formatNumber(results.torqueLbFt)} lb-ft)`;
                  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
                }}
                className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 border border-slate-700 text-xs"
              >
                <i className="fa-regular fa-copy"></i> Copy Results
              </button>
            </div>

            {/* Info Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-600 text-sm mt-0.5"></i>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  This calculator uses the standard SAE formula: HP = (Torque × RPM) ÷ 5252.
                  The constant 5252 comes from 33,000 ft·lb/min divided by 2π radians per
                  revolution.
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
            Quick Reference: Torque × RPM → Horsepower
          </h2>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Torque (lb-ft)</th>
                  <th className="p-3.5">RPM</th>
                  <th className="p-3.5">Horsepower</th>
                  <th className="p-3.5">Kilowatts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {REFERENCE_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{row.torque} lb-ft</td>
                    <td className="p-3.5 text-slate-600">{row.rpm.toLocaleString()} RPM</td>
                    <td className="p-3.5 font-bold text-blue-600">{formatNumber(row.hp)} HP</td>
                    <td className="p-3.5 text-slate-500">{formatNumber(row.hp * HP_PER_KW)} kW</td>
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
              Understanding Torque to Horsepower Conversion
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Learn how torque and RPM combine to produce horsepower, and why the number
              5252 is the magic constant in every dyno chart.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Torque (lb-ft)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Torque is a measure of rotational force, often described as the
              &quot;twisting power&quot; of an engine. It represents the engine&apos;s
              ability to do work and is measured in pound-feet (lb-ft) in this calculator.
              Higher torque values indicate an engine&apos;s capacity to move heavier loads
              or accelerate a vehicle more quickly.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              Torque is what you feel when you press the throttle and the car surges
              forward. It&apos;s the force that actually turns the wheels, and it&apos;s
              most useful at low RPMs where engines need to overcome inertia and load.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">RPM (Revolutions Per Minute)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              RPM, or revolutions per minute, refers to how many times the engine&apos;s
              crankshaft completes a full rotation in one minute. It is a measure of engine
              speed. Different RPM levels can significantly impact an engine&apos;s
              performance characteristics, with higher RPMs often providing more power
              output depending on the engine&apos;s design.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              An engine that produces high torque at high RPM will generate a lot of
              horsepower. This is why sports cars and race engines are designed to rev
              high — they multiply their torque by a large RPM number.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">How to Calculate Horsepower</h2>
            <p className="text-slate-600 text-sm mb-3">
              Horsepower is calculated using the relationship between torque and engine
              speed (RPM). By multiplying torque by RPM and dividing by 5252, you can
              calculate the engine&apos;s horsepower. This formula helps engineers,
              mechanics, and enthusiasts understand an engine&apos;s performance and its
              ability to generate power under specific conditions.
            </p>

            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-sm text-center mb-3">
              <span className="text-blue-400 font-bold">HP</span> ={' '}
              <span className="text-slate-300">(</span>
              <span className="text-emerald-400">Torque</span> ×{' '}
              <span className="text-amber-400">RPM</span>
              <span className="text-slate-300">)</span> ÷{' '}
              <span className="text-purple-400 font-bold">5252</span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Why 5252?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The number 5252 comes from James Watt&apos;s definition of one horsepower:
              33,000 lb-ft per minute. When you convert rotational speed from RPM to
              radians per second and work through the unit conversions, the constant 5252
              emerges naturally. It&apos;s not arbitrary — it&apos;s baked into the
              definition of horsepower itself.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center mt-3">
              <span className="text-sm font-mono font-bold text-slate-800">
                5252 = 33,000 ft·lb/min ÷ (2π rad/rev)
              </span>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">The 5252 Crossover</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              A fascinating consequence of the formula is that at exactly 5252 RPM, torque
              (in lb-ft) and horsepower are numerically equal. This is why on every dyno
              chart, the torque and horsepower curves always intersect at 5252 RPM.
            </p>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Below 5252 RPM:</strong> Torque (lb-ft)
                is numerically higher than horsepower.
              </li>
              <li>
                <strong className="text-slate-900">At 5252 RPM:</strong> Torque and
                horsepower are equal.
              </li>
              <li>
                <strong className="text-slate-900">Above 5252 RPM:</strong> Horsepower is
                numerically higher than torque.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Example Calculation</h2>
            <p className="text-slate-600 text-sm mb-3">
              Let&apos;s use the default values from the calculator:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Torque:</span>
                <span className="font-bold text-slate-900">450 lb-ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">RPM:</span>
                <span className="font-bold text-slate-900">6,000 RPM</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="text-slate-600">HP = (450 × 6000) ÷ 5252:</span>
                <span className="font-bold text-blue-600">514.09 HP</span>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Torque vs. Horsepower: What Matters?</h2>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Torque wins at low RPM:</strong> It
                determines how quickly you can accelerate from a standstill, how well you
                can tow, and how responsive the car feels in everyday driving.
              </li>
              <li>
                <strong className="text-slate-900">Horsepower wins at high RPM:</strong> It
                determines top speed, how fast you can accelerate at high speeds, and
                overall performance potential.
              </li>
              <li>
                <strong className="text-slate-900">The best engines have both:</strong>
                Modern turbocharged engines often produce a flat torque curve across a wide
                RPM range, giving both low-end grunt and high-end power.
              </li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-lightbulb text-amber-500 mr-2"></i>
              Quick Tip
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              If you know horsepower and RPM but not torque, the formula rearranges to:
              Torque = (HP × 5252) ÷ RPM. This calculator supports solving for any of the
              three variables — just use the &quot;Solve For&quot; buttons.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}