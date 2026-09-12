'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
interface WheelSetup {
  tyreWidth: string;      // mm
  tyreProfile: string;    // %
  tyreDiameter: string;   // inches
  wheelWidth: string;     // inches
  wheelOffset: string;    // mm
}

interface FitmentResults {
  diameter: number;
  circumference: number;
  inset: number;
  poke: number;
}

/* ---------- HELPERS ---------- */
function formatNumber(num: number, decimals: number = 2): string {
  if (isNaN(num) || !isFinite(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function calcFitment(setup: WheelSetup): FitmentResults {
  const width = parseFloat(setup.tyreWidth) || 0;
  const profile = parseFloat(setup.tyreProfile) || 0;
  const diameterInch = parseFloat(setup.tyreDiameter) || 0;
  const wheelWidthInch = parseFloat(setup.wheelWidth) || 0;
  const offset = parseFloat(setup.wheelOffset) || 0;

  // Tyre overall diameter (mm)
  const sidewallHeight = width * (profile / 100);
  const diameter = diameterInch * 25.4 + sidewallHeight * 2;

  // Circumference (mm)
  const circumference = Math.PI * diameter;

  // Wheel width (mm)
  const wheelWidthMm = wheelWidthInch * 25.4;

  // Inset = half wheel width + offset
  const inset = wheelWidthMm / 2 + offset;

  // Poke = half wheel width - offset
  const poke = wheelWidthMm / 2 - offset;

  return { diameter, circumference, inset, poke };
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function WheelFitmentCalculator() {
  /* ---------- CURRENT SETUP ---------- */
  const [current, setCurrent] = useState<WheelSetup>({
    tyreWidth: '225',
    tyreProfile: '45',
    tyreDiameter: '17',
    wheelWidth: '7.5',
    wheelOffset: '45',
  });

  /* ---------- NEW SETUP ---------- */
  const [newSetup, setNewSetup] = useState<WheelSetup>({
    tyreWidth: '245',
    tyreProfile: '40',
    tyreDiameter: '18',
    wheelWidth: '8.5',
    wheelOffset: '35',
  });

  /* ---------- CALCULATIONS ---------- */
  const currentResults = useMemo(() => calcFitment(current), [current]);
  const newResults = useMemo(() => calcFitment(newSetup), [newSetup]);

  const diameterDiff = newResults.diameter - currentResults.diameter;
  const circumferenceDiff = newResults.circumference - currentResults.circumference;

  // Speedo error (%) — based on circumference ratio
  const speedoError =
    currentResults.circumference > 0
      ? ((newResults.circumference / currentResults.circumference) - 1) * 100
      : 0;

  // Reading at 30 mph & 60 mph (speedo reads current, actual = new)
  const reading30 = 30 / (1 + speedoError / 100);
  const reading60 = 60 / (1 + speedoError / 100);

  // Ride height gain — change in radius (half diameter change)
  const rideHeightGain = diameterDiff / 2;

  // Arch gap change — same as ride height gain (absolute)
  const archGapChange = rideHeightGain;

  // Inset difference (inner rim clearance)
  const insetDiff = newResults.inset - currentResults.inset;

  // Poke difference (outer rim poke)
  const pokeDiff = newResults.poke - currentResults.poke;

  /* ---------- HANDLERS ---------- */
  const updateCurrent = (key: keyof WheelSetup, value: string) => {
    setCurrent((prev) => ({ ...prev, [key]: value }));
  };

  const updateNew = (key: keyof WheelSetup, value: string) => {
    setNewSetup((prev) => ({ ...prev, [key]: value }));
  };

  const resetCalculator = () => {
    setCurrent({
      tyreWidth: '225',
      tyreProfile: '45',
      tyreDiameter: '17',
      wheelWidth: '7.5',
      wheelOffset: '45',
    });
    setNewSetup({
      tyreWidth: '245',
      tyreProfile: '40',
      tyreDiameter: '18',
      wheelWidth: '8.5',
      wheelOffset: '35',
    });
  };

  /* ---------- QUICK PRESETS ---------- */
  const PRESETS = [
    {
      name: 'OEM → Sport',
      current: { tyreWidth: '205', tyreProfile: '55', tyreDiameter: '16', wheelWidth: '6.5', wheelOffset: '50' },
      new: { tyreWidth: '225', tyreProfile: '45', tyreDiameter: '17', wheelWidth: '7.5', wheelOffset: '45' },
    },
    {
      name: 'Plus-One Upgrade',
      current: { tyreWidth: '225', tyreProfile: '45', tyreDiameter: '17', wheelWidth: '7.5', wheelOffset: '45' },
      new: { tyreWidth: '235', tyreProfile: '40', tyreDiameter: '18', wheelWidth: '8.0', wheelOffset: '42' },
    },
    {
      name: 'Stance / Poke',
      current: { tyreWidth: '225', tyreProfile: '45', tyreDiameter: '17', wheelWidth: '7.5', wheelOffset: '45' },
      new: { tyreWidth: '255', tyreProfile: '35', tyreDiameter: '19', wheelWidth: '9.5', wheelOffset: '25' },
    },
    {
      name: 'Track / Wide',
      current: { tyreWidth: '245', tyreProfile: '40', tyreDiameter: '18', wheelWidth: '8.5', wheelOffset: '35' },
      new: { tyreWidth: '275', tyreProfile: '35', tyreDiameter: '18', wheelWidth: '10.0', wheelOffset: '30' },
    },
    {
      name: 'Winter / Narrow',
      current: { tyreWidth: '245', tyreProfile: '40', tyreDiameter: '18', wheelWidth: '8.5', wheelOffset: '35' },
      new: { tyreWidth: '225', tyreProfile: '50', tyreDiameter: '17', wheelWidth: '7.0', wheelOffset: '48' },
    },
  ];

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setCurrent(preset.current);
    setNewSetup(preset.new);
  };

  /* ---------- SPEEDO ERROR CLASSIFICATION ---------- */
  const speedoStatus = (() => {
    const abs = Math.abs(speedoError);
    if (abs <= 1) return { label: 'Minimal Difference', cls: 'bg-emerald-600 border-emerald-500', icon: 'fa-check-circle' };
    if (abs <= 3) return { label: 'Minor Difference', cls: 'bg-teal-600 border-teal-500', icon: 'fa-info-circle' };
    if (abs <= 5) return { label: 'Noticeable Difference', cls: 'bg-amber-600 border-amber-500', icon: 'fa-triangle-exclamation' };
    return { label: 'Significant Difference', cls: 'bg-rose-600 border-rose-500', icon: 'fa-exclamation-circle' };
  })();

  /* ---------- POKE CLASSIFICATION ---------- */
  const pokeStatus = (() => {
    if (pokeDiff > 10) return { label: 'Aggressive Poke', cls: 'bg-rose-600 border-rose-500', icon: 'fa-arrow-up' };
    if (pokeDiff > 3) return { label: 'Sporty Poke', cls: 'bg-amber-600 border-amber-500', icon: 'fa-arrow-up' };
    if (pokeDiff < -10) return { label: 'Significant Tuck', cls: 'bg-purple-600 border-purple-500', icon: 'fa-arrow-down' };
    if (pokeDiff < -3) return { label: 'Slight Tuck', cls: 'bg-blue-600 border-blue-500', icon: 'fa-arrow-down' };
    return { label: 'Similar Fitment', cls: 'bg-emerald-600 border-emerald-500', icon: 'fa-check-circle' };
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
            <i className="fa-solid fa-circle-dot text-blue-600 text-lg mt-0.5 mr-3"></i>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Wheel &amp; Tyre Fitment Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Visualise different wheel and tyre options by comparing tyre size, wheel
                width, and wheel offset between your current and new setup.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Input Cards — Current vs New ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* --- Current Setup --- */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-slate-500"></i> Current Setup
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold uppercase tracking-wider px-2 py-1 rounded border border-slate-200">
                Baseline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tyre Width */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Tyre Width
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={current.tyreWidth}
                    onChange={(e) => updateCurrent('tyreWidth', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">mm</span>
                </div>
              </div>

              {/* Tyre Profile */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Tyre Profile
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={current.tyreProfile}
                    onChange={(e) => updateCurrent('tyreProfile', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">%</span>
                </div>
              </div>

              {/* Tyre Diameter */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Tyre Diameter
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={current.tyreDiameter}
                    onChange={(e) => updateCurrent('tyreDiameter', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">in</span>
                </div>
              </div>

              {/* Wheel Width */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Wheel Width
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={current.wheelWidth}
                    onChange={(e) => updateCurrent('wheelWidth', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">in</span>
                </div>
              </div>

              {/* Wheel Offset */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Wheel Offset
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={current.wheelOffset}
                    onChange={(e) => updateCurrent('wheelOffset', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">mm</span>
                </div>
              </div>
            </div>

            {/* Current Results Snapshot */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">Diameter</span>
                <div className="font-bold text-slate-800">{formatNumber(currentResults.diameter)} mm</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Circumference</span>
                <div className="font-bold text-slate-800">{formatNumber(currentResults.circumference)} mm</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Inset</span>
                <div className="font-bold text-slate-800">{formatNumber(currentResults.inset)} mm</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Poke</span>
                <div className="font-bold text-slate-800">{formatNumber(currentResults.poke)} mm</div>
              </div>
            </div>
          </div>

          {/* --- New Setup --- */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-circle-plus text-blue-600"></i> New Setup
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold uppercase tracking-wider px-2 py-1 rounded border border-blue-200">
                Comparison
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tyre Width */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Tyre Width
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={newSetup.tyreWidth}
                    onChange={(e) => updateNew('tyreWidth', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">mm</span>
                </div>
              </div>

              {/* Tyre Profile */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Tyre Profile
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={newSetup.tyreProfile}
                    onChange={(e) => updateNew('tyreProfile', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">%</span>
                </div>
              </div>

              {/* Tyre Diameter */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Tyre Diameter
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={newSetup.tyreDiameter}
                    onChange={(e) => updateNew('tyreDiameter', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">in</span>
                </div>
              </div>

              {/* Wheel Width */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Wheel Width
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={newSetup.wheelWidth}
                    onChange={(e) => updateNew('wheelWidth', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">in</span>
                </div>
              </div>

              {/* Wheel Offset */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Wheel Offset
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number" step="any" value={newSetup.wheelOffset}
                    onChange={(e) => updateNew('wheelOffset', e.target.value)}
                    className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-slate-900 font-semibold text-base focus:z-10"
                  />
                  <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-600">mm</span>
                </div>
              </div>
            </div>

            {/* New Results Snapshot */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-blue-600 font-semibold">Diameter</span>
                <div className="font-bold text-blue-800">{formatNumber(newResults.diameter)} mm</div>
              </div>
              <div>
                <span className="text-blue-600 font-semibold">Circumference</span>
                <div className="font-bold text-blue-800">{formatNumber(newResults.circumference)} mm</div>
              </div>
              <div>
                <span className="text-blue-600 font-semibold">Inset</span>
                <div className="font-bold text-blue-800">{formatNumber(newResults.inset)} mm</div>
              </div>
              <div>
                <span className="text-blue-600 font-semibold">Poke</span>
                <div className="font-bold text-blue-800">{formatNumber(newResults.poke)} mm</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Reset + Presets Bar ===== */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 solid-shadow mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quick Presets &amp; Reset</h3>
              <p className="text-[11px] text-slate-500">Load a common setup or reset to defaults.</p>
            </div>
            <button
              onClick={resetCalculator}
              className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-rotate-left"></i> Reset All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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

        {/* ===== Results Comparison Table ===== */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 solid-shadow mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-table text-blue-600"></i>
              Fitment Comparison Results
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
              Current → New
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Parameter</th>
                  <th className="p-3.5 text-center">Current</th>
                  <th className="p-3.5 text-center">New</th>
                  <th className="p-3.5 text-center">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {/* Diameter */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">Diameter</td>
                  <td className="p-3.5 text-center text-slate-600">{formatNumber(currentResults.diameter)} mm</td>
                  <td className="p-3.5 text-center text-slate-600">{formatNumber(newResults.diameter)} mm</td>
                  <td className={`p-3.5 text-center font-bold ${diameterDiff > 0 ? 'text-emerald-600' : diameterDiff < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                    {diameterDiff > 0 ? '+' : ''}{formatNumber(diameterDiff)} mm
                  </td>
                </tr>
                {/* Circumference */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">Circumference</td>
                  <td className="p-3.5 text-center text-slate-600">{formatNumber(currentResults.circumference)} mm</td>
                  <td className="p-3.5 text-center text-slate-600">{formatNumber(newResults.circumference)} mm</td>
                  <td className={`p-3.5 text-center font-bold ${circumferenceDiff > 0 ? 'text-emerald-600' : circumferenceDiff < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                    {circumferenceDiff > 0 ? '+' : ''}{formatNumber(circumferenceDiff)} mm
                  </td>
                </tr>
                {/* Inset */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">Inset</td>
                  <td className="p-3.5 text-center text-slate-600">{formatNumber(currentResults.inset)} mm</td>
                  <td className="p-3.5 text-center text-slate-600">{formatNumber(newResults.inset)} mm</td>
                  <td className={`p-3.5 text-center font-bold ${insetDiff > 0 ? 'text-amber-600' : insetDiff < 0 ? 'text-blue-600' : 'text-slate-500'}`}>
                    {insetDiff > 0 ? '+' : ''}{formatNumber(insetDiff)} mm
                  </td>
                </tr>
                {/* Poke */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">Poke</td>
                  <td className="p-3.5 text-center text-slate-600">{formatNumber(currentResults.poke)} mm</td>
                  <td className="p-3.5 text-center text-slate-600">{formatNumber(newResults.poke)} mm</td>
                  <td className={`p-3.5 text-center font-bold ${pokeDiff > 0 ? 'text-rose-600' : pokeDiff < 0 ? 'text-blue-600' : 'text-slate-500'}`}>
                    {pokeDiff > 0 ? '+' : ''}{formatNumber(pokeDiff)} mm
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== Speedo & Geometry Results ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Speedometer Error Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-gauge-high text-blue-600"></i> Speedometer Error
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border text-white ${speedoStatus.cls}`}>
                {speedoStatus.label}
              </span>
            </div>

            <div className="text-center py-3">
              <div className="text-4xl font-black text-slate-900">
                {speedoError > 0 ? '+' : ''}{formatNumber(speedoError, 2)}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {speedoError > 0
                  ? 'New setup will make speedo read slower than actual speed.'
                  : speedoError < 0
                  ? 'New setup will make speedo read faster than actual speed.'
                  : 'No speedometer error.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reading at 30 mph</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{formatNumber(reading30, 2)} mph</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reading at 60 mph</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{formatNumber(reading60, 2)} mph</div>
              </div>
            </div>
          </div>

          {/* Geometry Changes Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-ruler-combined text-blue-600"></i> Geometry Changes
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border text-white ${pokeStatus.cls}`}>
                {pokeStatus.label}
              </span>
            </div>

            <div className="space-y-3">
              {/* Ride Height Gain */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ride Height Gain</div>
                  <div className="text-xs text-slate-500">Change in ground clearance</div>
                </div>
                <div className={`text-lg font-black ${rideHeightGain > 0 ? 'text-emerald-600' : rideHeightGain < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {rideHeightGain > 0 ? '+' : ''}{formatNumber(rideHeightGain)} mm
                </div>
              </div>

              {/* Arch Gap */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Arch Gap Change</div>
                  <div className="text-xs text-slate-500">Change in fender-to-tyre gap</div>
                </div>
                <div className={`text-lg font-black ${archGapChange > 0 ? 'text-emerald-600' : archGapChange < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {archGapChange > 0 ? '+' : ''}{formatNumber(archGapChange)} mm
                </div>
              </div>

              {/* Inner Rim Clearance */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inner Rim Clearance</div>
                  <div className="text-xs text-slate-500">
                    {insetDiff > 0 ? 'Further from suspension strut' : insetDiff < 0 ? 'Closer to suspension strut' : 'Unchanged'}
                  </div>
                </div>
                <div className={`text-lg font-black ${insetDiff > 0 ? 'text-emerald-600' : insetDiff < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {insetDiff > 0 ? '+' : ''}{formatNumber(insetDiff)} mm
                </div>
              </div>

              {/* Outer Rim Poke */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Outer Rim Poke</div>
                  <div className="text-xs text-slate-500">
                    {pokeDiff > 0 ? 'Pokes out more than before' : pokeDiff < 0 ? 'Tucks in more than before' : 'Unchanged'}
                  </div>
                </div>
                <div className={`text-lg font-black ${pokeDiff > 0 ? 'text-rose-600' : pokeDiff < 0 ? 'text-blue-600' : 'text-slate-500'}`}>
                  {pokeDiff > 0 ? '+' : ''}{formatNumber(pokeDiff)} mm
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Visual Diagram ===== */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow mb-8">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <i className="fa-solid fa-image text-blue-600"></i> Visual Diagram
          </h3>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Outer Poke Arrow */}
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-rose-600">Poke: {formatNumber(newResults.poke)} mm</span>
                <span className="text-slate-400">|</span>
                <span className="font-bold text-blue-600">Inset: {formatNumber(newResults.inset)} mm</span>
              </div>

              {/* Wheel representation */}
              <div className="relative w-full max-w-md">
                {/* Wheel body */}
                <div className="h-32 bg-slate-300 border-2 border-slate-400 rounded-lg relative overflow-hidden">
                  {/* Inner rim line */}
                  <div
                    className="absolute top-0 bottom-0 bg-blue-400/40 border-r-2 border-blue-600"
                    style={{
                      left: 0,
                      width: `${Math.min(90, Math.max(10, (newResults.inset / (newResults.inset + newResults.poke)) * 100))}%`,
                    }}
                  ></div>
                  {/* Outer rim line */}
                  <div
                    className="absolute top-0 bottom-0 bg-rose-400/40 border-l-2 border-rose-600"
                    style={{
                      right: 0,
                      width: `${Math.min(90, Math.max(10, (newResults.poke / (newResults.inset + newResults.poke)) * 100))}%`,
                    }}
                  ></div>
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>← Inset (strut side)</span>
                  <span>Poke (fender side) →</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center max-w-lg">
                {pokeDiff > 0
                  ? `Your new wheel's inner rim will be ${formatNumber(Math.abs(insetDiff))} mm ${insetDiff > 0 ? 'further away from' : 'closer to'} the suspension strut. The outside of the rim will poke out ${formatNumber(Math.abs(pokeDiff))} mm more than before.`
                  : pokeDiff < 0
                  ? `Your new wheel's inner rim will be ${formatNumber(Math.abs(insetDiff))} mm ${insetDiff > 0 ? 'further away from' : 'closer to'} the suspension strut. The outside of the rim will tuck in ${formatNumber(Math.abs(pokeDiff))} mm more than before.`
                  : `Your new wheel's inner rim will be ${formatNumber(Math.abs(insetDiff))} mm ${insetDiff > 0 ? 'further away from' : 'closer to'} the suspension strut. The outer rim position is unchanged.`}
              </p>

              <p className="text-[10px] text-slate-400 text-center">
                This diagram is for illustration purposes only and not to scale with your
                vehicle&apos;s hub, axle, suspension, and other components.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Article Section ===== */}
        <article className="mt-10 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 solid-shadow article-content">
          <header className="border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-2xl font-black text-slate-900">
              Wheel &amp; Tyre Fitment Calculator
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Visualise different wheel and tyre options by comparing the tyre size, wheel
              width and wheel offset.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Understanding Wheel &amp; Tyre Fitment
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              This calculator is designed to help you choose the optimum wheel and tyre
              combination for your car, taking into consideration the tyre width, tyre
              profile, tyre diameter, wheel width and wheel offset. It is important to
              understand that changing your wheel and tyre specifications from your
              manufacturer&apos;s original specifications will affect how accurate your
              speedo will read.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Understanding the Parameters</h2>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Tyre Width</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The tyre width is the measurement from a tyre&apos;s inner sidewall to its
              outer sidewall in millimetres. The wider the tyre, the more rolling
              resistance there is and therefore more grip — however, by using wider tyres
              you may notice a slight increase in fuel consumption.
            </p>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Tyre Profile</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The tyre profile is the height of the tyre&apos;s sidewall given as a
              percentage of its width. For example, a tyre with a width of 200 and a
              profile of 40 will have a sidewall height of 80 mm — as 40% of 200 is 80.
            </p>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Tyre Diameter</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The tyre diameter is quite simply the largest measurement of the cutout
              section of the tyre, from one side to the other. Therefore a 16-inch tyre
              will fit a 16-inch wheel rim.
            </p>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Wheel Width</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The wheel width is the measurement of a wheel&apos;s cross-section, from one
              side to the other in inches.
            </p>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Wheel Offset</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The wheel offset refers to how the wheel is mounted to your car&apos;s hub
              and is measured in millimetres. An offset is either positive, negative or
              zero. An offset of zero means that the car&apos;s hub mounting surface is in
              the centre of the wheel rim. A positive offset will result in the hub being
              towards the front of the wheel, and a negative offset will result in the hub
              being toward the back of the wheel.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">How to Calculate Fitment</h2>
            <p className="text-slate-600 text-sm mb-3">
              The calculations use the following formulas:
            </p>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Tyre Diameter</h3>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center mb-3">
              <span className="text-blue-400 font-bold">Diameter</span> ={' '}
              <span className="text-emerald-400">Tyre Diameter (in)</span> ×{' '}
              <span className="text-amber-400">25.4</span> + (
              <span className="text-purple-400">Tyre Width</span> ×{' '}
              <span className="text-rose-400">Profile %</span>) ÷ 100 ×{' '}
              <span className="text-slate-300">2</span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Circumference</h3>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center mb-3">
              <span className="text-blue-400 font-bold">Circumference</span> ={' '}
              <span className="text-slate-300">π</span> ×{' '}
              <span className="text-emerald-400">Diameter</span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Inset &amp; Poke</h3>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center mb-3">
              <span className="text-blue-400 font-bold">Inset</span> = (
              <span className="text-emerald-400">Wheel Width (mm)</span> ÷{' '}
              <span className="text-slate-300">2</span>) +{' '}
              <span className="text-amber-400">Offset</span>
              <br />
              <span className="text-blue-400 font-bold">Poke</span> = (
              <span className="text-emerald-400">Wheel Width (mm)</span> ÷{' '}
              <span className="text-slate-300">2</span>) −{' '}
              <span className="text-amber-400">Offset</span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Speedometer Error</h3>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-center mb-3">
              <span className="text-blue-400 font-bold">Error %</span> = [(
              <span className="text-emerald-400">New Circumference</span> ÷{' '}
              <span className="text-amber-400">Current Circumference</span>) −{' '}
              <span className="text-rose-400">1</span>] ×{' '}
              <span className="text-slate-300">100</span>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Example Calculation</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Current Tyre:</span>
                <span className="font-bold text-slate-900">225/45R17</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">New Tyre:</span>
                <span className="font-bold text-slate-900">245/40R18</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="text-slate-600">Diameter Change:</span>
                <span className="font-bold text-blue-600">-20.1 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Circumference Change:</span>
                <span className="font-bold text-blue-600">-63.2 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Speedo Error:</span>
                <span className="font-bold text-amber-600">-3.18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Poke Change:</span>
                <span className="font-bold text-rose-600">+39.1 mm</span>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>
              Important Note
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              These calculations are theoretical and for illustration purposes only. They
              do not account for your vehicle&apos;s specific suspension geometry, brake
              caliper clearance, fender liner clearance, or other real-world factors.
              Always test-fit wheels and tyres before committing to a purchase, and consult
              a professional if you are unsure about fitment.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}