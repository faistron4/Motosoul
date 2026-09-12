'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
type WeightUnit = 'kg' | 'lbs';
type VehicleConfig = 'street-rwd' | 'street-fwd' | 'race-rwd' | 'race-fwd' | 'oval';

interface CornerWeights {
  fl: string;
  fr: string;
  rl: string;
  rr: string;
}

/* ---------- VEHICLE CONFIG PRESETS ---------- */
const VEHICLE_CONFIGS: Record<
  VehicleConfig,
  {
    label: string;
    frontRange: [number, number];
    crossRange: [number, number];
    description: string;
  }
> = {
  'street-rwd': {
    label: 'Street Car (RWD)',
    frontRange: [45, 52],
    crossRange: [49, 51.5],
    description: 'Rear-wheel drive street car with balanced handling target.',
  },
  'street-fwd': {
    label: 'Street Car (FWD)',
    frontRange: [55, 62],
    crossRange: [49, 51.5],
    description: 'Front-wheel drive street car with front-biased weight.',
  },
  'race-rwd': {
    label: 'Race Car (RWD)',
    frontRange: [48, 50],
    crossRange: [49.5, 50.5],
    description: 'Rear-wheel drive race car with near-perfect 50/50 balance.',
  },
  'race-fwd': {
    label: 'Race Car (FWD)',
    frontRange: [55, 58],
    crossRange: [52, 54],
    description: 'Front-wheel drive race car with intentional front bias.',
  },
  oval: {
    label: 'Oval Track',
    frontRange: [48, 52],
    crossRange: [52, 58],
    description: 'Oval racer with intentional cross weight bias for left turns.',
  },
};

/* ---------- HELPERS ---------- */
function formatNumber(num: number, decimals: number = 1): string {
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return value;
  return from === 'kg' ? value * 2.20462 : value / 2.20462;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function CornerWeightCalculator() {
  const [unit, setUnit] = useState<WeightUnit>('kg');
  const [vehicleConfig, setVehicleConfig] = useState<VehicleConfig>('street-rwd');
  const [weights, setWeights] = useState<CornerWeights>({
    fl: '300',
    fr: '310',
    rl: '290',
    rr: '295',
  });
  const [targetFront, setTargetFront] = useState(50);
  const [targetCross, setTargetCross] = useState(50);
  const [targetLR, setTargetLR] = useState(50);

  const config = VEHICLE_CONFIGS[vehicleConfig];

  /* ---------- PARSE WEIGHTS ---------- */
  const numFL = parseFloat(weights.fl) || 0;
  const numFR = parseFloat(weights.fr) || 0;
  const numRL = parseFloat(weights.rl) || 0;
  const numRR = parseFloat(weights.rr) || 0;

  /* ---------- CALCULATIONS ---------- */
  const totalWeight = numFL + numFR + numRL + numRR;
  const frontAxle = numFL + numFR;
  const rearAxle = numRL + numRR;
  const leftSide = numFL + numRL;
  const rightSide = numFR + numRR;
  const crossWeight = numFL + numRR; // FL + RR diagonal

  const frontPercent = totalWeight > 0 ? (frontAxle / totalWeight) * 100 : 0;
  const rearPercent = totalWeight > 0 ? (rearAxle / totalWeight) * 100 : 0;
  const leftPercent = totalWeight > 0 ? (leftSide / totalWeight) * 100 : 0;
  const rightPercent = totalWeight > 0 ? (rightSide / totalWeight) * 100 : 0;
  const crossPercent = totalWeight > 0 ? (crossWeight / totalWeight) * 100 : 0;

  /* ---------- HANDLING TENDENCY ---------- */
  const handlingTendency = useMemo(() => {
    if (crossPercent >= 50.3) {
      return {
        label: 'Oversteer Tendency',
        desc: 'Positive wedge — rear tends to step out in corners.',
        cls: 'bg-rose-600 border-rose-500',
        icon: 'fa-arrow-trend-up',
      };
    }
    if (crossPercent <= 49.7) {
      return {
        label: 'Understeer Tendency',
        desc: 'Negative wedge — front pushes toward outside of turn.',
        cls: 'bg-amber-600 border-amber-500',
        icon: 'fa-arrow-trend-down',
      };
    }
    return {
      label: 'Neutral Handling',
      desc: 'Balanced cross weight provides equal grip in both directions.',
      cls: 'bg-emerald-600 border-emerald-500',
      icon: 'fa-scale-balanced',
    };
  }, [crossPercent]);

  /* ---------- TARGET CALCULATIONS ---------- */
  const targetFrontWeight = totalWeight * (targetFront / 100);
  const targetRearWeight = totalWeight - targetFrontWeight;
  const targetCrossWeight = totalWeight * (targetCross / 100);
  const targetLeftWeight = totalWeight * (targetLR / 100);
  const targetRightWeight = totalWeight - targetLeftWeight;

  // Solve for individual corner weights from targets
  const targetFL = (targetFrontWeight + targetLeftWeight + targetCrossWeight - totalWeight) / 2;
  const targetFR = targetFrontWeight - targetFL;
  const targetRL = targetLeftWeight - targetFL;
  const targetRR = targetRearWeight - targetRL;

  const diffFL = targetFL - numFL;
  const diffFR = targetFR - numFR;
  const diffRL = targetRL - numRL;
  const diffRR = targetRR - numRR;

  /* ---------- HANDLERS ---------- */
  const resetCalculator = () => {
    setWeights({ fl: '300', fr: '310', rl: '290', rr: '295' });
    setVehicleConfig('street-rwd');
    setTargetFront(50);
    setTargetCross(50);
    setTargetLR(50);
  };

  const switchUnit = (newUnit: WeightUnit) => {
    if (newUnit === unit) return;
    setWeights({
      fl: convertWeight(parseFloat(weights.fl) || 0, unit, newUnit).toFixed(1),
      fr: convertWeight(parseFloat(weights.fr) || 0, unit, newUnit).toFixed(1),
      rl: convertWeight(parseFloat(weights.rl) || 0, unit, newUnit).toFixed(1),
      rr: convertWeight(parseFloat(weights.rr) || 0, unit, newUnit).toFixed(1),
    });
    setUnit(newUnit);
  };

  const updateWeight = (corner: keyof CornerWeights, value: string) => {
    setWeights((prev) => ({ ...prev, [corner]: value }));
  };

  /* ---------- RANGE CHECK ---------- */
  const inFrontRange =
    frontPercent >= config.frontRange[0] && frontPercent <= config.frontRange[1];
  const inCrossRange =
    crossPercent >= config.crossRange[0] && crossPercent <= config.crossRange[1];

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ===== Info Banner ===== */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
          <div className="flex items-start">
            <i className="fa-solid fa-scale-balanced text-blue-600 text-lg mt-0.5 mr-3"></i>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Corner Weight & Cross Weight Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Enter your four wheel weights to calculate front/rear distribution, left/right balance, and cross weight (wedge).
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
                <i className="fa-solid fa-sliders text-blue-600"></i> Corner Weight Inputs
              </h3>
              <button
                onClick={resetCalculator}
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-rotate-left"></i> Reset
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Weight Unit
              </span>
              <div className="flex rounded-md border border-slate-200 overflow-hidden">
                {(['kg', 'lbs'] as WeightUnit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => switchUnit(u)}
                    className={`px-4 py-1.5 text-xs font-bold transition-colors ${
                      unit === u
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Configuration */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Vehicle Configuration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(VEHICLE_CONFIGS) as VehicleConfig[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setVehicleConfig(key)}
                    className={`text-xs font-bold py-2.5 px-3 rounded-lg border transition-colors text-left ${
                      vehicleConfig === key
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {VEHICLE_CONFIGS[key].label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {config.description}
              </p>
            </div>

            {/* Corner Weight Inputs — 2x2 Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Corner Weights ({unit})
              </label>

              {/* Top row: Front axle */}
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex-1 text-center">Front Left</div>
                <div className="w-16"></div>
                <div className="flex-1 text-center">Front Right</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={weights.fl}
                  onChange={(e) => updateWeight('fl', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 font-semibold text-lg text-center focus:z-10"
                  placeholder="FL"
                />
                <div className="w-16 flex items-center justify-center">
                  <div className="w-full h-px bg-slate-200"></div>
                </div>
                <input
                  type="number"
                  step="any"
                  value={weights.fr}
                  onChange={(e) => updateWeight('fr', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 font-semibold text-lg text-center focus:z-10"
                  placeholder="FR"
                />
              </div>

              {/* Rear axle row */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={weights.rl}
                  onChange={(e) => updateWeight('rl', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 font-semibold text-lg text-center focus:z-10"
                  placeholder="RL"
                />
                <div className="w-16 flex items-center justify-center">
                  <div className="w-full h-px bg-slate-200"></div>
                </div>
                <input
                  type="number"
                  step="any"
                  value={weights.rr}
                  onChange={(e) => updateWeight('rr', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 font-semibold text-lg text-center focus:z-10"
                  placeholder="RR"
                />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex-1 text-center">Rear Left</div>
                <div className="w-16"></div>
                <div className="flex-1 text-center">Rear Right</div>
              </div>
            </div>

            {/* Target Mode */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <i className="fa-solid fa-bullseye text-blue-600"></i> Target Mode
                </h4>
                <p className="text-[11px] text-slate-500">
                  Work backwards from desired percentages to see required corner weights.
                </p>
              </div>

              {/* Target Front % */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Target Front Weight %</label>
                  <span className="text-sm font-black text-blue-600">{targetFront}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={65}
                  value={targetFront}
                  onChange={(e) => setTargetFront(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>40%</span>
                  <span>Recommended: {config.frontRange[0]}–{config.frontRange[1]}%</span>
                  <span>65%</span>
                </div>
              </div>

              {/* Target Cross % */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Target Cross Weight %</label>
                  <span className="text-sm font-black text-blue-600">{targetCross}%</span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={57}
                  step={0.5}
                  value={targetCross}
                  onChange={(e) => setTargetCross(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>45%</span>
                  <span>Recommended: {config.crossRange[0]}–{config.crossRange[1]}%</span>
                  <span>57%</span>
                </div>
              </div>

              {/* Target L/R % */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Target Left Weight %</label>
                  <span className="text-sm font-black text-blue-600">{targetLR}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={60}
                  value={targetLR}
                  onChange={(e) => setTargetLR(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>40%</span>
                  <span>Ideal: ~50%</span>
                  <span>60%</span>
                </div>
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
                  Weight Distribution Results
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  {unit.toUpperCase()}
                </span>
              </div>

              {/* Total Weight */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Total Vehicle Weight
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-blue-400 tracking-tight">
                    {formatNumber(totalWeight)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">{unit}</span>
                </div>
              </div>

              {/* Front / Rear */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Front Axle</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {formatNumber(frontAxle)} {unit}
                  </div>
                  <div className={`text-xs font-bold mt-0.5 ${inFrontRange ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {formatNumber(frontPercent)}%
                  </div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Rear Axle</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {formatNumber(rearAxle)} {unit}
                  </div>
                  <div className="text-xs font-bold mt-0.5 text-slate-300">
                    {formatNumber(rearPercent)}%
                  </div>
                </div>
              </div>

              {/* Left / Right */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Left Side</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {formatNumber(leftSide)} {unit}
                  </div>
                  <div className="text-xs font-bold mt-0.5 text-slate-300">
                    {formatNumber(leftPercent)}%
                  </div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Right Side</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {formatNumber(rightSide)} {unit}
                  </div>
                  <div className="text-xs font-bold mt-0.5 text-slate-300">
                    {formatNumber(rightPercent)}%
                  </div>
                </div>
              </div>

              {/* Cross Weight */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                    Cross Weight (Wedge)
                  </span>
                  <span className={`text-xs font-bold ${inCrossRange ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {inCrossRange ? 'In Range' : 'Out of Range'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                    {formatNumber(crossPercent)}%
                  </span>
                  <span className="text-sm font-bold text-slate-400">
                    ({formatNumber(crossWeight)} {unit})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  FL + RR diagonal · Target: {config.crossRange[0]}–{config.crossRange[1]}%
                </p>
              </div>

              {/* Handling Badge */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">
                  Handling Tendency
                </span>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-white border ${handlingTendency.cls}`}>
                  <i className={`fa-solid ${handlingTendency.icon}`}></i>
                  <span>{handlingTendency.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{handlingTendency.desc}</p>
              </div>
            </div>

            {/* Target Corner Weights Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 solid-shadow">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <i className="fa-solid fa-bullseye text-blue-600"></i>
                Target Corner Weights
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Front Left', target: targetFL, current: numFL, diff: diffFL },
                  { label: 'Front Right', target: targetFR, current: numFR, diff: diffFR },
                  { label: 'Rear Left', target: targetRL, current: numRL, diff: diffRL },
                  { label: 'Rear Right', target: targetRR, current: numRR, diff: diffRR },
                ].map((corner) => {
                  const isAdd = corner.diff > 0.5;
                  const isRemove = corner.diff < -0.5;
                  return (
                    <div
                      key={corner.label}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-3"
                    >
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {corner.label}
                      </div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">
                        {formatNumber(corner.target)} {unit}
                      </div>
                      <div
                        className={`text-[11px] font-bold mt-1 ${
                          isAdd
                            ? 'text-emerald-600'
                            : isRemove
                            ? 'text-rose-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {isAdd && (
                          <>
                            <i className="fa-solid fa-plus-circle mr-1"></i>
                            Add {formatNumber(Math.abs(corner.diff))} {unit}
                          </>
                        )}
                        {isRemove && (
                          <>
                            <i className="fa-solid fa-minus-circle mr-1"></i>
                            Remove {formatNumber(Math.abs(corner.diff))} {unit}
                          </>
                        )}
                        {!isAdd && !isRemove && (
                          <>
                            <i className="fa-solid fa-check-circle mr-1"></i>
                            On target
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                This calculator solves for the optimal corner weights to achieve your target
                percentages while maintaining total weight. In practice, weight adjustments
                often involve suspension changes rather than adding/removing physical weight.
              </p>
            </div>

            {/* Info Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-600 text-sm mt-0.5"></i>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  For accurate results, measure on a level surface with all fluids at proper
                  levels and equal tire pressures. Driver weight should be accounted for in
                  performance applications.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================ */}
        {/* ARTICLE / GUIDE SECTION */}
        {/* ============================================ */}
        <article className="mt-10 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 solid-shadow article-content">
          <header className="border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-2xl font-black text-slate-900">
              Understanding Corner Weights & Cross Weight
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Learn what corner weights tell you about your car&apos;s handling, and how
              cross weight (wedge) affects left and right turn behavior.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Corner Weight Measurement</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The individual weight measured at each wheel of a vehicle. These measurements
              are taken using specialized scales or weight pads placed under each tire, with
              the vehicle in its normal driving position.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Total Vehicle Weight</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The sum of all four corner weights. This represents the complete weight of the
              vehicle including all fluids, fuel, and any accessories or modifications. When
              measuring for performance applications, it&apos;s recommended to include driver
              weight to get an accurate picture of actual driving conditions.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Front-to-Rear Distribution</h2>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">Front Weight Percentage:</strong> The
                percentage of total vehicle weight supported by the front axle. Calculated as
                (Front Left + Front Right) ÷ Total Weight × 100%.
              </li>
              <li>
                <strong className="text-slate-900">Front-heavy (55-60% front):</strong> Common
                in front-wheel drive vehicles. Tends to promote understeer.
              </li>
              <li>
                <strong className="text-slate-900">Balanced (50/50):</strong> Ideal for
                balanced handling. Common target for sports cars.
              </li>
              <li>
                <strong className="text-slate-900">Rear-heavy (55-60% rear):</strong> Common
                in rear-engine vehicles. Can promote oversteer but provides better traction
                for RWD vehicles.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Left-to-Right Distribution</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The side-to-side weight balance of a vehicle. For road cars, this should
              ideally be close to 50/50 for balanced handling. For oval track racing, an
              intentional left or right bias may be implemented.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Cross Weight (Wedge)</h2>
            <p className="text-slate-600 text-sm mb-3">
              The diagonal weight distribution from front-left to rear-right, expressed as a
              percentage of total vehicle weight. This is one of the most critical
              measurements for vehicle handling balance. Calculated as:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center mb-3">
              <span className="text-sm font-mono font-bold text-slate-800">
                Cross Weight % = (FL + RR) ÷ Total Weight × 100%
              </span>
            </div>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">50% Cross Weight:</strong> Neutral handling
                balance with equal grip in left and right turns.
              </li>
              <li>
                <strong className="text-slate-900">Greater than 50%:</strong> Positive wedge
                — promotes oversteer.
              </li>
              <li>
                <strong className="text-slate-900">Less than 50%:</strong> Negative wedge —
                promotes understeer.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Typical Target Values</h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase font-bold">
                  <tr>
                    <th className="p-3">Application</th>
                    <th className="p-3">Front Weight</th>
                    <th className="p-3">Cross Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Street Cars</td>
                    <td className="p-3 text-slate-600">Manufacturer spec</td>
                    <td className="p-3 text-blue-600 font-bold">50–52%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">FWD Race Cars</td>
                    <td className="p-3 text-slate-600">55–58%</td>
                    <td className="p-3 text-blue-600 font-bold">52–54%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">RWD Race Cars</td>
                    <td className="p-3 text-slate-600">48–50%</td>
                    <td className="p-3 text-blue-600 font-bold">49–52%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Circuit Racing</td>
                    <td className="p-3 text-slate-600">Balanced</td>
                    <td className="p-3 text-blue-600 font-bold">~50%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Oval Track</td>
                    <td className="p-3 text-slate-600">Varies</td>
                    <td className="p-3 text-blue-600 font-bold">52–58%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>
              Best Practices for Measurement
            </h3>
            <ul className="text-slate-600 text-xs space-y-1.5 list-disc pl-5">
              <li>Use a level surface for measurement</li>
              <li>Ensure equal tire pressures at all four corners</li>
              <li>Fill all fluids to normal operating levels</li>
              <li>Include driver weight (and passenger if applicable)</li>
              <li>Set the suspension at normal ride height</li>
              <li>Make sure the steering is centered</li>
              <li>Allow suspension to settle after each adjustment</li>
            </ul>
          </section>
        </article>

      </div>
    </div>
  );
}