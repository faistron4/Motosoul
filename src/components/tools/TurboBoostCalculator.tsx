'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
type PressureUnit = 'psi' | 'bar' | 'kPa';

/* ---------- CONSTANTS ---------- */
const PRESSURE_CONVERSIONS: Record<PressureUnit, number> = {
  psi: 1,
  bar: 14.5038,
  kPa: 0.145038,
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
export default function TurboBoostCalculator() {
  const [naturalHp, setNaturalHp] = useState('200');
  const [desiredHp, setDesiredHp] = useState('350');
  const [ve, setVe] = useState('90');
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>('psi');
  const [atmosphericPressure, setAtmosphericPressure] = useState('14.7');

  /* ---------- CONVERT ATMOSPHERIC PRESSURE TO PSI ---------- */
  const atmPsi = useMemo(() => {
    const val = parseFloat(atmosphericPressure) || 0;
    return val * PRESSURE_CONVERSIONS[pressureUnit];
  }, [atmosphericPressure, pressureUnit]);

  /* ---------- CALCULATIONS ---------- */
  const results = useMemo(() => {
    const naHp = parseFloat(naturalHp) || 0;
    const targetHp = parseFloat(desiredHp) || 0;
    const veDecimal = (parseFloat(ve) || 0) / 100;

    if (naHp <= 0 || veDecimal <= 0) {
      return {
        boostPsi: 0,
        boostBar: 0,
        boostKpa: 0,
        pressureRatio: 1,
        hpGain: 0,
        percentGain: 0,
      };
    }

    // Motoristo formula:
    // Boost = [(Desired HP / (Natural HP × VE)) - 1] × Atmospheric Pressure
    const hpPerVe = targetHp / (naHp * veDecimal);
    const boostPsi = (hpPerVe - 1) * atmPsi;

    const boostBar = boostPsi / 14.5038;
    const boostKpa = boostPsi / 0.145038;

    // Pressure ratio = (Boost + Atmospheric) / Atmospheric
    const pressureRatio = atmPsi > 0 ? (boostPsi + atmPsi) / atmPsi : 1;

    const hpGain = targetHp - naHp;
    const percentGain = naHp > 0 ? (hpGain / naHp) * 100 : 0;

    return {
      boostPsi: Math.max(boostPsi, 0),
      boostBar: Math.max(boostBar, 0),
      boostKpa: Math.max(boostKpa, 0),
      pressureRatio: Math.max(pressureRatio, 1),
      hpGain,
      percentGain,
    };
  }, [naturalHp, desiredHp, ve, atmPsi]);

  /* ---------- HANDLERS ---------- */
  const resetCalculator = () => {
    setNaturalHp('200');
    setDesiredHp('350');
    setVe('90');
    setAtmosphericPressure('14.7');
    setPressureUnit('psi');
  };

  /* ---------- QUICK PRESETS ---------- */
  const PRESETS = [
    { name: 'Mild Street (200→260)', na: 200, desired: 260, ve: 90 },
    { name: 'Street Turbo (200→350)', na: 200, desired: 350, ve: 90 },
    { name: 'Performance (300→500)', na: 300, desired: 500, ve: 92 },
    { name: 'Big Turbo (250→550)', na: 250, desired: 550, ve: 88 },
    { name: 'Drag Build (400→900)', na: 400, desired: 900, ve: 90 },
    { name: 'E85 Monster (500→1200)', na: 500, desired: 1200, ve: 95 },
    { name: 'Daily Driver (150→220)', na: 150, desired: 220, ve: 88 },
    { name: 'Race Engine (350→700)', na: 350, desired: 700, ve: 93 },
  ];

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setNaturalHp(String(preset.na));
    setDesiredHp(String(preset.desired));
    setVe(String(preset.ve));
  };

  /* ---------- REFERENCE TABLE ---------- */
  const REFERENCE_ROWS = [
    { na: 100, desired: 150, ve: 90, boost: ((150 / (100 * 0.9)) - 1) * 14.7 },
    { na: 150, desired: 250, ve: 90, boost: ((250 / (150 * 0.9)) - 1) * 14.7 },
    { na: 200, desired: 350, ve: 90, boost: ((350 / (200 * 0.9)) - 1) * 14.7 },
    { na: 250, desired: 450, ve: 90, boost: ((450 / (250 * 0.9)) - 1) * 14.7 },
    { na: 300, desired: 550, ve: 90, boost: ((550 / (300 * 0.9)) - 1) * 14.7 },
    { na: 350, desired: 700, ve: 90, boost: ((700 / (350 * 0.9)) - 1) * 14.7 },
    { na: 400, desired: 800, ve: 90, boost: ((800 / (400 * 0.9)) - 1) * 14.7 },
    { na: 500, desired: 1000, ve: 90, boost: ((1000 / (500 * 0.9)) - 1) * 14.7 },
  ];

  /* ---------- BOOST CLASSIFICATION ---------- */
  const boostLevel = (() => {
    const psi = results.boostPsi;
    if (psi >= 25) return { label: 'Extreme Boost', cls: 'bg-rose-600 border-rose-500', icon: 'fa-fire' };
    if (psi >= 18) return { label: 'Race Boost', cls: 'bg-purple-600 border-purple-500', icon: 'fa-bolt' };
    if (psi >= 12) return { label: 'High Boost', cls: 'bg-amber-600 border-amber-500', icon: 'fa-gauge-high' };
    if (psi >= 7) return { label: 'Moderate Boost', cls: 'bg-teal-600 border-teal-500', icon: 'fa-gauge' };
    if (psi >= 3) return { label: 'Low Boost', cls: 'bg-blue-600 border-blue-500', icon: 'fa-wind' };
    if (psi > 0) return { label: 'Minimal Boost', cls: 'bg-slate-600 border-slate-500', icon: 'fa-wind' };
    return { label: 'No Boost Required', cls: 'bg-slate-600 border-slate-500', icon: 'fa-ban' };
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
            <i className="fa-solid fa-fan text-blue-600 text-lg mt-0.5 mr-3"></i>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Turbo Boost Pressure Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Calculate the required turbo boost pressure for your engine by providing
                the naturally aspirated power and your target horsepower.
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

            {/* Natural Horsepower */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Natural Horsepower (HP)
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter naturally aspirated HP..."
                  value={naturalHp}
                  onChange={(e) => setNaturalHp(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  HP
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Engine power without any forced induction (baseline).
              </p>
            </div>

            {/* Desired Horsepower */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Desired Horsepower (HP)
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter target HP..."
                  value={desiredHp}
                  onChange={(e) => setDesiredHp(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  HP
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Target power output after adding a turbocharger.
              </p>
            </div>

            {/* Volumetric Efficiency */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Volumetric Efficiency (VE)
                </label>
                <span className="text-sm font-black text-blue-600">{ve}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={110}
                value={ve}
                onChange={(e) => setVe(e.target.value)}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>50%</span>
                <span>Typical: 85–95%</span>
                <span>110%</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Percentage of cylinder capacity filled with air during intake stroke.
                Most engines: 85–95%.
              </p>
            </div>

            {/* Atmospheric Pressure */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Atmospheric Pressure
                </label>
                <div className="flex rounded-md border border-slate-200 overflow-hidden">
                  {(['psi', 'bar', 'kPa'] as PressureUnit[]).map((u) => (
                    <button
                      key={u}
                      onClick={() => {
                        if (u !== pressureUnit) {
                          const val = parseFloat(atmosphericPressure) || 0;
                          const inPsi = val * PRESSURE_CONVERSIONS[pressureUnit];
                          const newVal = inPsi / PRESSURE_CONVERSIONS[u];
                          setAtmosphericPressure(newVal.toFixed(u === 'psi' ? 2 : u === 'bar' ? 3 : 1));
                          setPressureUnit(u);
                        }
                      }}
                      className={`px-3 py-1 text-[10px] font-bold transition-colors ${
                        pressureUnit === u
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter atmospheric pressure..."
                  value={atmosphericPressure}
                  onChange={(e) => setAtmosphericPressure(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  {pressureUnit}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Sea level: 14.7 psi (1.013 bar). Reduce for high altitude.
              </p>
            </div>

            {/* Formula Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                Simplified Estimation Formula
              </div>
              <div className="font-mono text-xs text-slate-800 leading-relaxed">
                <span className="text-blue-600 font-bold">Boost</span> = [
                (<span className="text-slate-900">Desired HP</span> ÷ (
                <span className="text-slate-900">Natural HP</span> ×{' '}
                <span className="text-emerald-600">VE</span>)) −{' '}
                <span className="text-amber-600">1</span>] ×{' '}
                <span className="text-slate-900">Atmospheric Pressure</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Load Quick Turbo Preset:
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
                  Estimated Boost
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  Result
                </span>
              </div>

              {/* Primary Result — PSI */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Required Boost Pressure
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-extrabold text-blue-400 tracking-tight">
                    {formatNumber(results.boostPsi)}
                  </span>
                  <span className="text-lg font-bold text-slate-300">psi</span>
                </div>
              </div>

              {/* Alternate Units */}
              <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Bar</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {formatNumber(results.boostBar, 3)} bar
                  </div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">kPa</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {formatNumber(results.boostKpa, 1)} kPa
                  </div>
                </div>
              </div>

              {/* Pressure Ratio */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Pressure Ratio (PR)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">
                    {formatNumber(results.pressureRatio)}
                  </span>
                  <span className="text-sm font-bold text-slate-400">: 1</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  (Boost + Atmospheric) ÷ Atmospheric
                </p>
              </div>

              {/* Power Gain */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Estimated Power Gain
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-amber-400 tracking-tight">
                    +{formatNumber(results.hpGain, 0)} HP
                  </span>
                  <span className="text-sm font-bold text-amber-400/70">
                    (+{formatNumber(results.percentGain, 0)}%)
                  </span>
                </div>
              </div>

              {/* Boost Classification */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">
                  Boost Classification
                </span>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-white border ${boostLevel.cls}`}>
                  <i className={`fa-solid ${boostLevel.icon}`}></i>
                  <span>{boostLevel.label}</span>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  const text = `Boost: ${formatNumber(results.boostPsi)} psi (${formatNumber(results.boostBar, 3)} bar) | PR: ${formatNumber(results.pressureRatio)} | Gain: +${formatNumber(results.hpGain, 0)} HP`;
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
                  This is a simplified estimation model. It does not account for intake
                  temperature, other engine modifications, mechanical losses, and other
                  real-world complexities.
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
            Quick Reference: Common Power Targets → Boost
          </h2>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Natural HP</th>
                  <th className="p-3.5">Desired HP</th>
                  <th className="p-3.5">VE</th>
                  <th className="p-3.5">Boost (psi)</th>
                  <th className="p-3.5">Pressure Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {REFERENCE_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{row.na} HP</td>
                    <td className="p-3.5 text-slate-600">{row.desired} HP</td>
                    <td className="p-3.5 text-slate-500">{row.ve}%</td>
                    <td className="p-3.5 font-bold text-blue-600">
                      {formatNumber(row.boost)} psi
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {formatNumber((row.boost + 14.7) / 14.7)} : 1
                    </td>
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
              Understanding Turbo Boost Pressure
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Learn how boost pressure relates to horsepower targets, volumetric
              efficiency, and atmospheric conditions.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Natural Horsepower (HP)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The natural horsepower refers to the engine&apos;s power output without any
              forced induction, such as a turbocharger or supercharger. It represents the
              baseline performance of the engine in its naturally aspirated state.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Desired Horsepower (HP)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The desired horsepower is the target engine power output you aim to achieve
              after adding a turbocharger.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Volumetric Efficiency (VE)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Volumetric efficiency (VE) is the percentage of the engine&apos;s cylinder
              capacity effectively filled with air during the intake stroke. It reflects
              the engine&apos;s breathing efficiency and is typically between 85% and 95%
              for most engines. Higher VE values indicate better airflow management.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Atmospheric Pressure (psi)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Atmospheric pressure is the weight of the air surrounding us, typically
              14.7 psi at sea level. This value decreases at higher altitudes, which
              impacts the amount of air available for combustion. Atmospheric pressure
              plays a key role in determining the boost pressure required.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">How to Calculate Boost Pressure</h2>
            <p className="text-slate-600 text-sm mb-3">
              Boost pressure is calculated by determining how much additional air pressure
              a turbocharger must provide to achieve the desired horsepower. The formula
              is:
            </p>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center mb-3">
              <span className="text-blue-400 font-bold">Boost (psi)</span> = [
              (<span className="text-emerald-400">Desired HP</span> ÷{' '}
              (<span className="text-amber-400">Natural HP</span> ×{' '}
              <span className="text-purple-400">VE</span>)) −{' '}
              <span className="text-rose-400">1</span>] ×{' '}
              <span className="text-slate-300">Atmospheric Pressure</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Breaking it down: First, divide the desired horsepower by the product of
              natural horsepower and volumetric efficiency. Then subtract 1 to find the
              multiplier. Finally, multiply by atmospheric pressure to get the required
              boost in psi.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Example Calculation</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Natural HP:</span>
                <span className="font-bold text-slate-900">200 HP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Desired HP:</span>
                <span className="font-bold text-slate-900">350 HP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Volumetric Efficiency:</span>
                <span className="font-bold text-slate-900">90%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Atmospheric Pressure:</span>
                <span className="font-bold text-slate-900">14.7 psi</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="text-slate-600">Boost = [(350 ÷ (200 × 0.9)) − 1] × 14.7:</span>
                <span className="font-bold text-blue-600">11.24 psi</span>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Pressure Ratio</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Pressure ratio (PR) is the ratio of absolute outlet pressure to absolute
              inlet pressure at the compressor. It&apos;s a key metric when selecting a
              turbocharger from a compressor map:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <span className="text-sm font-mono font-bold text-slate-800">
                PR = (Boost + Atmospheric) ÷ Atmospheric
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              A pressure ratio of 1.0 means no boost. A PR of 2.0 means the compressor is
              doubling absolute pressure — roughly 14.7 psi of boost at sea level.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Boost Level Ranges</h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase font-bold">
                  <tr>
                    <th className="p-3">Boost Range</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Typical Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">0–3 psi</td>
                    <td className="p-3 text-slate-600">Minimal</td>
                    <td className="p-3 text-slate-600">Mild street, fuel economy</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">3–7 psi</td>
                    <td className="p-3 text-slate-600">Low</td>
                    <td className="p-3 text-slate-600">Street performance</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">7–12 psi</td>
                    <td className="p-3 text-slate-600">Moderate</td>
                    <td className="p-3 text-slate-600">Daily driver turbo</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">12–18 psi</td>
                    <td className="p-3 text-slate-600">High</td>
                    <td className="p-3 text-slate-600">Performance builds</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">18–25 psi</td>
                    <td className="p-3 text-slate-600">Race</td>
                    <td className="p-3 text-slate-600">Track / drag cars</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">25+ psi</td>
                    <td className="p-3 text-slate-600">Extreme</td>
                    <td className="p-3 text-slate-600">Dedicated race, E85/meth</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>
              Important Limitations
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              This calculator uses a simplified estimation model. It does not account for:
              intake air temperature, intercooler efficiency, camshaft profiles, exhaust
              restrictions, fuel octane, ECU tuning limits, or turbocharger compressor
              efficiency. Always consult a professional tuner and use a boost gauge when
              setting up a forced induction system.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}
