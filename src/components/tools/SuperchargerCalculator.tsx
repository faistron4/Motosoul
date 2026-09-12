'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
type DiameterUnit = 'in' | 'mm';
type DisplacementUnit = 'ci' | 'cc';
type PressureUnit = 'psi' | 'bar';

/* ---------- UNIT CONVERSIONS ---------- */
const DIAMETER_TO_IN: Record<DiameterUnit, number> = {
  'in': 1,
  'mm': 1 / 25.4,
};

const DISPLACEMENT_TO_CI: Record<DisplacementUnit, number> = {
  'ci': 1,
  'cc': 1 / 16.387064,
};

const PRESSURE_TO_PSI: Record<PressureUnit, number> = {
  'psi': 1,
  'bar': 14.5038,
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
export default function SuperchargerCalculator() {
  /* ---------- STATE ---------- */
  const [diameterUnit, setDiameterUnit] = useState<DiameterUnit>('in');
  const [displacementUnit, setDisplacementUnit] = useState<DisplacementUnit>('ci');
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>('psi');

  const [crankPulley, setCrankPulley] = useState('6.0');
  const [superchargerPulley, setSuperchargerPulley] = useState('2.5');
  const [engineRpm, setEngineRpm] = useState('6000');
  const [efficiency, setEfficiency] = useState('75');
  const [superchargerDisplacement, setSuperchargerDisplacement] = useState('122');
  const [engineDisplacement, setEngineDisplacement] = useState('350');
  const [ambientPressure, setAmbientPressure] = useState('14.7');

  /* ---------- CONVERT TO BASE UNITS ---------- */
  const crankIn = (parseFloat(crankPulley) || 0) * DIAMETER_TO_IN[diameterUnit];
  const scPulleyIn = (parseFloat(superchargerPulley) || 0) * DIAMETER_TO_IN[diameterUnit];
  const scDispCi = (parseFloat(superchargerDisplacement) || 0) * DISPLACEMENT_TO_CI[displacementUnit];
  const engDispCi = (parseFloat(engineDisplacement) || 0) * DISPLACEMENT_TO_CI[displacementUnit];
  const ambientPsi = (parseFloat(ambientPressure) || 0) * PRESSURE_TO_PSI[pressureUnit];

  /* ---------- CALCULATIONS ---------- */
  const results = useMemo(() => {
    const rpm = parseFloat(engineRpm) || 0;
    const eff = (parseFloat(efficiency) || 0) / 100;

    if (scPulleyIn <= 0 || engDispCi <= 0) {
      return {
        pulleyRatio: 0,
        superchargerRpm: 0,
        boostPsi: 0,
        boostBar: 0,
      };
    }

    // Pulley Ratio = Crank Pulley Diameter ÷ Supercharger Pulley Diameter
    const pulleyRatio = crankIn / scPulleyIn;

    // Supercharger RPM = Pulley Ratio × Engine RPM
    const superchargerRpm = pulleyRatio * rpm;

    // Boost Pressure = [(SC Displacement × SC RPM × Efficiency) ÷ (Engine Displacement × 1728)] × Ambient Pressure - Ambient Pressure
    const airflowNumerator = scDispCi * superchargerRpm * eff;
    const airflowDenominator = engDispCi * 1728;
    const pressureRatio = airflowDenominator > 0 ? airflowNumerator / airflowDenominator : 0;
    const boostPsi = pressureRatio * ambientPsi - ambientPsi;
    const boostBar = boostPsi / 14.5038;

    return {
      pulleyRatio,
      superchargerRpm,
      boostPsi: Math.max(boostPsi, 0),
      boostBar: Math.max(boostBar, 0),
    };
  }, [crankIn, scPulleyIn, engineRpm, efficiency, scDispCi, engDispCi, ambientPsi]);

  /* ---------- HANDLERS ---------- */
  const resetCalculator = () => {
    setCrankPulley('6.0');
    setSuperchargerPulley('2.5');
    setEngineRpm('6000');
    setEfficiency('75');
    setSuperchargerDisplacement('122');
    setEngineDisplacement('350');
    setAmbientPressure('14.7');
    setDiameterUnit('in');
    setDisplacementUnit('ci');
    setPressureUnit('psi');
  };

  /* ---------- QUICK PRESETS ---------- */
  const PRESETS = [
    {
      name: 'Street 5.0L V8 (6 psi)',
      crank: 6.0,
      sc: 3.0,
      rpm: 6000,
      eff: 75,
      scDisp: 122,
      engDisp: 302,
      ambient: 14.7,
    },
    {
      name: 'Drag 6.2L V8 (12 psi)',
      crank: 7.5,
      sc: 2.75,
      rpm: 6500,
      eff: 78,
      scDisp: 174,
      engDisp: 378,
      ambient: 14.7,
    },
    {
      name: 'LS3 6.2L (10 psi)',
      crank: 7.0,
      sc: 2.85,
      rpm: 6200,
      eff: 76,
      scDisp: 150,
      engDisp: 376,
      ambient: 14.7,
    },
    {
      name: '4.6L Mustang (8 psi)',
      crank: 6.5,
      sc: 2.9,
      rpm: 6000,
      eff: 74,
      scDisp: 140,
      engDisp: 281,
      ambient: 14.7,
    },
    {
      name: 'High Boost 15 psi',
      crank: 7.8,
      sc: 2.5,
      rpm: 6800,
      eff: 80,
      scDisp: 174,
      engDisp: 350,
      ambient: 14.7,
    },
  ];

  const loadPreset = (p: typeof PRESETS[0]) => {
    setCrankPulley(String(p.crank));
    setSuperchargerPulley(String(p.sc));
    setEngineRpm(String(p.rpm));
    setEfficiency(String(p.eff));
    setSuperchargerDisplacement(String(p.scDisp));
    setEngineDisplacement(String(p.engDisp));
    setAmbientPressure(String(p.ambient));
    setDiameterUnit('in');
    setDisplacementUnit('ci');
    setPressureUnit('psi');
  };

  /* ---------- BOOST CLASSIFICATION ---------- */
  const boostLevel = (() => {
    const psi = results.boostPsi;
    if (psi >= 15) return { label: 'Extreme Boost', cls: 'bg-rose-600 border-rose-500', icon: 'fa-fire' };
    if (psi >= 10) return { label: 'High Boost', cls: 'bg-purple-600 border-purple-500', icon: 'fa-bolt' };
    if (psi >= 6) return { label: 'Moderate Boost', cls: 'bg-amber-600 border-amber-500', icon: 'fa-gauge-high' };
    if (psi >= 3) return { label: 'Low Boost', cls: 'bg-teal-600 border-teal-500', icon: 'fa-gauge' };
    if (psi > 0) return { label: 'Minimal Boost', cls: 'bg-blue-600 border-blue-500', icon: 'fa-wind' };
    return { label: 'No Boost', cls: 'bg-slate-600 border-slate-500', icon: 'fa-ban' };
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
              <h2 className="text-sm font-bold text-slate-800">Supercharger Pulley Ratio &amp; Boost Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Optimize your supercharger setup — estimate boost levels, RPM limits, and
                performance gains for your build.
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

            {/* Diameter Unit Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Pulley Diameter Unit
              </span>
              <div className="flex rounded-md border border-slate-200 overflow-hidden">
                {(['in', 'mm'] as DiameterUnit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setDiameterUnit(u)}
                    className={`px-4 py-1.5 text-xs font-bold transition-colors ${
                      diameterUnit === u
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Crank Pulley Diameter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Crank Pulley Diameter
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter crank pulley diameter..."
                  value={crankPulley}
                  onChange={(e) => setCrankPulley(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  {diameterUnit}
                </span>
              </div>
            </div>

            {/* Supercharger Pulley Diameter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Supercharger Pulley Diameter
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter supercharger pulley diameter..."
                  value={superchargerPulley}
                  onChange={(e) => setSuperchargerPulley(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  {diameterUnit}
                </span>
              </div>
            </div>

            {/* Engine RPM */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Engine RPM
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter engine RPM..."
                  value={engineRpm}
                  onChange={(e) => setEngineRpm(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  RPM
                </span>
              </div>
            </div>

            {/* Supercharger Efficiency */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Supercharger Efficiency
                </label>
                <span className="text-sm font-black text-blue-600">{efficiency}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={100}
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>40%</span>
                <span>Typical: 60–85%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Displacement Unit Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Displacement Unit
              </span>
              <div className="flex rounded-md border border-slate-200 overflow-hidden">
                {(['ci', 'cc'] as DisplacementUnit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setDisplacementUnit(u)}
                    className={`px-4 py-1.5 text-xs font-bold transition-colors ${
                      displacementUnit === u
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Supercharger Displacement */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Supercharger Displacement
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter supercharger displacement..."
                  value={superchargerDisplacement}
                  onChange={(e) => setSuperchargerDisplacement(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  {displacementUnit}
                </span>
              </div>
            </div>

            {/* Engine Displacement */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Engine Displacement
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter engine displacement..."
                  value={engineDisplacement}
                  onChange={(e) => setEngineDisplacement(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  {displacementUnit}
                </span>
              </div>
            </div>

            {/* Ambient Pressure */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ambient Pressure
                </label>
                <div className="flex rounded-md border border-slate-200 overflow-hidden">
                  {(['psi', 'bar'] as PressureUnit[]).map((u) => (
                    <button
                      key={u}
                      onClick={() => setPressureUnit(u)}
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
                  placeholder="Enter ambient pressure..."
                  value={ambientPressure}
                  onChange={(e) => setAmbientPressure(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  {pressureUnit}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Sea level: 14.7 PSI (1 bar). Reduce for high altitude.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Load Quick Supercharger Preset:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="text-[11px] font-bold py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-colors text-left"
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
                  Calculated Results
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  Live
                </span>
              </div>

              {/* Pulley Ratio */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Pulley Ratio
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-blue-400 tracking-tight">
                    {formatNumber(results.pulleyRatio)}
                  </span>
                  <span className="text-sm font-bold text-slate-400">: 1</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Crank Pulley ÷ Supercharger Pulley
                </p>
              </div>

              {/* Supercharger RPM */}
              <div className="mb-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Supercharger RPM
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                    {formatNumber(results.superchargerRpm, 0)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">RPM</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pulley Ratio × Engine RPM
                </p>
              </div>

              {/* Boost Pressure */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Boost Pressure
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-amber-400 tracking-tight">
                    {formatNumber(results.boostPsi)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">PSI</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ≈ {formatNumber(results.boostBar)} bar
                </div>
              </div>

              {/* Boost Level Badge */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">
                  Boost Classification
                </span>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-white border ${boostLevel.cls}`}>
                  <i className={`fa-solid ${boostLevel.icon}`}></i>
                  <span>{boostLevel.label}</span>
                </div>
              </div>

              {/* Input Summary */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Crank Pulley</span>
                  <span className="text-white font-semibold">
                    {formatNumber(parseFloat(crankPulley) || 0)} {diameterUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SC Pulley</span>
                  <span className="text-white font-semibold">
                    {formatNumber(parseFloat(superchargerPulley) || 0)} {diameterUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Efficiency</span>
                  <span className="text-white font-semibold">{efficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SC Displacement</span>
                  <span className="text-white font-semibold">
                    {formatNumber(parseFloat(superchargerDisplacement) || 0)} {displacementUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Engine Displacement</span>
                  <span className="text-white font-semibold">
                    {formatNumber(parseFloat(engineDisplacement) || 0)} {displacementUnit}
                  </span>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  const text = `Pulley Ratio: ${formatNumber(results.pulleyRatio)}:1 | SC RPM: ${formatNumber(results.superchargerRpm, 0)} | Boost: ${formatNumber(results.boostPsi)} PSI`;
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
                  Boost estimates are theoretical. Actual boost depends on camshaft timing,
                  intake/exhaust restrictions, intercooler efficiency, and other factors.
                  Always consult a tuner before modifying your setup.
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
            Quick Reference: Common Pulley Ratios &amp; Boost
          </h2>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Pulley Ratio</th>
                  <th className="p-3.5">Typical Boost (PSI)</th>
                  <th className="p-3.5">Application</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">1.5 : 1</td>
                  <td className="p-3.5 font-bold text-blue-600">2–4 PSI</td>
                  <td className="p-3.5 text-slate-600">Mild street setup</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">2.0 : 1</td>
                  <td className="p-3.5 font-bold text-blue-600">5–7 PSI</td>
                  <td className="p-3.5 text-slate-600">Street performance</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">2.5 : 1</td>
                  <td className="p-3.5 font-bold text-blue-600">8–11 PSI</td>
                  <td className="p-3.5 text-slate-600">Aggressive street / track</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">3.0 : 1</td>
                  <td className="p-3.5 font-bold text-blue-600">12–15 PSI</td>
                  <td className="p-3.5 text-slate-600">Race / drag setup</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">3.5 : 1+</td>
                  <td className="p-3.5 font-bold text-blue-600">16+ PSI</td>
                  <td className="p-3.5 text-slate-600">Extreme / dedicated race</td>
                </tr>
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
              Understanding Supercharger Pulley Ratio &amp; Boost
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Learn how pulley sizing, supercharger speed, and engine displacement determine
              boost pressure and overall performance.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Crank Pulley Diameter (in/mm)
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The crankshaft pulley drives the supercharger via a belt. A larger crank pulley
              increases supercharger speed, leading to higher boost levels. Conversely, a
              smaller crank pulley reduces supercharger RPM and decreases boost.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Supercharger Pulley Diameter (in/mm)
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The supercharger pulley is mounted on the supercharger&apos;s input shaft. A
              smaller supercharger pulley results in a higher pulley ratio, making the
              supercharger spin faster and generating more boost. A larger pulley slows the
              supercharger down, reducing boost.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Engine RPM</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              This is the engine speed in revolutions per minute (RPM). Since the
              supercharger spins relative to the engine&apos;s RPM, higher engine speeds mean
              more air is forced into the intake, increasing power output.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Supercharger Efficiency (%)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Superchargers are not 100% efficient due to heat generation and internal losses.
              Most modern superchargers operate between 60% and 85% efficiency. A higher
              efficiency rating means the supercharger is delivering more usable boost with
              less wasted energy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Supercharger Displacement (ci/cc)
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Supercharger displacement refers to how much air the supercharger moves per
              revolution, usually measured in cubic inches (ci) or cubic centimeters (cc).
              Larger superchargers flow more air per rotation, generating more boost at lower
              speeds, while smaller units need to spin faster to produce the same effect.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Engine Displacement (ci/cc)
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The engine&apos;s displacement (size) is a major factor in determining how much
              boost pressure is created. A larger engine can absorb more air without
              increasing pressure dramatically, while a smaller engine will reach higher
              boost levels with the same amount of compressed air.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Ambient Pressure (PSI)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              This is the natural atmospheric pressure that varies based on altitude. At sea
              level, ambient pressure is 14.7 PSI (1 Bar). Higher altitudes have lower
              atmospheric pressure, reducing the amount of available oxygen and slightly
              lowering boost levels.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              How These Parameters Work Together
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Each of these inputs directly impacts the boost pressure and overall engine
              performance. The goal of optimizing a supercharger setup is to balance pulley
              sizing, efficiency, and engine displacement to achieve the desired boost
              without overloading the system.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              By tweaking these values, you can see how changes affect pulley ratio,
              supercharger RPM, and boost pressure, helping you fine-tune your setup for
              maximum performance.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">The Formulas</h2>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Pulley Ratio</h3>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-sm text-center mb-3">
              <span className="text-blue-400 font-bold">Pulley Ratio</span> ={' '}
              <span className="text-emerald-400">Crank Pulley Diameter</span> ÷{' '}
              <span className="text-amber-400">Supercharger Pulley Diameter</span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Supercharger RPM</h3>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-sm text-center mb-3">
              <span className="text-blue-400 font-bold">SC RPM</span> ={' '}
              <span className="text-emerald-400">Pulley Ratio</span> ×{' '}
              <span className="text-amber-400">Engine RPM</span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Boost Pressure</h3>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center mb-3">
              <span className="text-blue-400 font-bold">Boost</span> = [
              <span className="text-emerald-400">SC Displacement</span> ×{' '}
              <span className="text-emerald-400">SC RPM</span> ×{' '}
              <span className="text-emerald-400">Efficiency</span>] ÷ [
              <span className="text-amber-400">Engine Displacement</span> ×{' '}
              <span className="text-amber-400">1728</span>] ×{' '}
              <span className="text-slate-300">Ambient Pressure</span> −{' '}
              <span className="text-slate-300">Ambient Pressure</span>
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>
              Important Note
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              These calculations provide theoretical estimates. Actual boost pressure can
              vary based on camshaft profiles, intake and exhaust restrictions, intercooler
              efficiency, air temperature, and the specific supercharger model. Always
              verify with a qualified tuner and use a boost gauge to monitor real-world
              performance.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}