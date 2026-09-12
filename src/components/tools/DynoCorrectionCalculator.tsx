'use client';

import { useState, useMemo } from 'react';

/* ---------- TYPES ---------- */
type PressureUnit = 'inHg' | 'mbar';
type TempUnit = 'F' | 'C';
type CorrectionStandard = 'sae-j1349' | 'sae-j607' | 'msa' | 'std' | 'din-70020' | 'eec-iso';

interface StandardConfig {
  label: string;
  tempF: number;
  pressureInHg: number;
  humidity: number;
  description: string;
}

/* ---------- STANDARD CONFIGURATIONS ---------- */
const STANDARDS: Record<CorrectionStandard, StandardConfig> = {
  'sae-j1349': {
    label: 'SAE J1349',
    tempF: 77,
    pressureInHg: 29.235,
    humidity: 0,
    description: 'US manufacturers since 2005. 77°F, 29.235 inHg, 0% RH.',
  },
  'sae-j607': {
    label: 'SAE J607',
    tempF: 60,
    pressureInHg: 29.92,
    humidity: 0,
    description: 'Older SAE standard. Used for many older vehicles and publications.',
  },
  msa: {
    label: 'MSA (Motorsports)',
    tempF: 60,
    pressureInHg: 29.92,
    humidity: 0,
    description: 'Motorsports Standard Atmosphere. Identical to SAE J607.',
  },
  std: {
    label: 'STD Atmosphere',
    tempF: 59,
    pressureInHg: 29.92,
    humidity: 0,
    description: 'Standard atmosphere. 59°F, 29.92 inHg, 0% RH.',
  },
  'din-70020': {
    label: 'DIN 70020',
    tempF: 68,
    pressureInHg: 29.53,
    humidity: 0,
    description: 'German standard used by many European manufacturers.',
  },
  'eec-iso': {
    label: 'EEC 80/1269 / ISO 1585',
    tempF: 77,
    pressureInHg: 29.92,
    humidity: 0,
    description: 'European / International standard. 77°F, 29.92 inHg, 0% RH.',
  },
};

/* ---------- HELPERS ---------- */
function formatNumber(num: number, decimals: number = 2): string {
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Calculate saturation vapor pressure (in inHg) from temperature in °F.
 * Uses the Magnus-Tetens approximation.
 */
function saturationVaporPressure(tempF: number): number {
  const tempC = (tempF - 32) * (5 / 9);
  const svp_hPa = 6.1078 * Math.pow(10, (7.5 * tempC) / (237.3 + tempC));
  return svp_hPa * 0.02953; // hPa -> inHg
}

/**
 * Estimate barometric pressure (inHg) from elevation in feet using
 * the standard atmosphere model.
 */
function pressureFromElevation(elevationFt: number): number {
  const elevationM = elevationFt * 0.3048;
  const pressurePa = 101325 * Math.pow(1 - (2.25577e-5 * elevationM), 5.25588);
  return pressurePa * 0.0002953; // Pa -> inHg
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function DynoCorrectionCalculator() {
  const [measuredHp, setMeasuredHp] = useState('300');
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>('inHg');
  const [pressureValue, setPressureValue] = useState('29.92');
  const [tempUnit, setTempUnit] = useState<TempUnit>('F');
  const [tempValue, setTempValue] = useState('77');
  const [humidity, setHumidity] = useState('0');
  const [elevation, setElevation] = useState('0');
  const [useElevation, setUseElevation] = useState(false);
  const [standard, setStandard] = useState<CorrectionStandard>('sae-j1349');

  /* ---------- CONVERSIONS TO BASE UNITS ---------- */
  const pressureInHg = useMemo(() => {
    if (useElevation) {
      const elev = parseFloat(elevation) || 0;
      return pressureFromElevation(elev);
    }
    const val = parseFloat(pressureValue) || 0;
    return pressureUnit === 'mbar' ? val * 0.02953 : val;
  }, [pressureValue, pressureUnit, elevation, useElevation]);

  const tempF = useMemo(() => {
    const val = parseFloat(tempValue) || 0;
    return tempUnit === 'C' ? (val * 9) / 5 + 32 : val;
  }, [tempValue, tempUnit]);

  const rh = useMemo(() => Math.min(Math.max(parseFloat(humidity) || 0, 0), 100), [humidity]);

  /* ---------- VAPOR PRESSURE ---------- */
  const svp = useMemo(() => saturationVaporPressure(tempF), [tempF]);
  const vaporPressure = useMemo(() => svp * (rh / 100), [svp, rh]);
  const dryAirPressure = useMemo(
    () => Math.max(pressureInHg - vaporPressure, 0.01),
    [pressureInHg, vaporPressure]
  );

  /* ---------- CORRECTION FACTOR ---------- */
  const correctionFactor = useMemo(() => {
    const config = STANDARDS[standard];

    // Standard dry air pressure (subtract standard vapor pressure)
    const stdSvp = saturationVaporPressure(config.tempF);
    const stdVapor = stdSvp * (config.humidity / 100);
    const stdDryPressure = config.pressureInHg - stdVapor;

    const tempK = tempF + 459.67;
    const stdTempK = config.tempF + 459.67;

    let cf = 1;

    switch (standard) {
      case 'sae-j1349': {
        // SAE J1349 JUN90 formula
        cf =
          1.18 *
            ((stdDryPressure / dryAirPressure) *
              Math.sqrt(tempK / stdTempK)) -
          0.18;
        break;
      }
      case 'sae-j607':
      case 'msa': {
        // SAE J607 / MSA: CF = (stdPressure/dryPressure) * sqrt(tempK/stdTempK)
        cf = (stdDryPressure / dryAirPressure) * Math.sqrt(tempK / stdTempK);
        break;
      }
      case 'std': {
        // STD atmosphere
        cf = (stdDryPressure / dryAirPressure) * Math.sqrt(tempK / stdTempK);
        break;
      }
      case 'din-70020': {
        // DIN 70020: CF = (1013.25 / pressure_mbar) * sqrt((273+tempC)/(273+20))
        const pressureMbar = pressureInHg / 0.02953;
        const tempC = (tempF - 32) * (5 / 9);
        cf = (1013.25 / pressureMbar) * Math.sqrt((273 + tempC) / 293);
        break;
      }
      case 'eec-iso': {
        // EEC / ISO: similar to SAE J1349 with different constants
        cf = (stdDryPressure / dryAirPressure) * Math.sqrt(tempK / stdTempK);
        break;
      }
    }

    return isFinite(cf) && cf > 0 ? cf : 1;
  }, [standard, dryAirPressure, tempF, pressureInHg]);

  /* ---------- CORRECTED HORSEPOWER ---------- */
  const correctedHp = useMemo(() => {
    const measured = parseFloat(measuredHp) || 0;
    return measured * correctionFactor;
  }, [measuredHp, correctionFactor]);

  const powerChange = correctedHp - (parseFloat(measuredHp) || 0);

  /* ---------- HANDLERS ---------- */
  const resetCalculator = () => {
    setMeasuredHp('300');
    setPressureUnit('inHg');
    setPressureValue('29.92');
    setTempUnit('F');
    setTempValue('77');
    setHumidity('0');
    setElevation('0');
    setUseElevation(false);
    setStandard('sae-j1349');
  };

  const config = STANDARDS[standard];

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
              <h2 className="text-sm font-bold text-slate-800">Dyno Correction Calculator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Correct your engine&apos;s power output for different atmospheric conditions
                using industry-standard correction factors.
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

            {/* Measured Horsepower */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Measured Horsepower
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter measured HP..."
                  value={measuredHp}
                  onChange={(e) => setMeasuredHp(e.target.value)}
                  className="block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg focus:z-10"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-700">
                  HP
                </span>
              </div>
            </div>

            {/* Correction Standard */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Correction Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(STANDARDS) as CorrectionStandard[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setStandard(key)}
                    className={`text-xs font-bold py-2.5 px-3 rounded-lg border transition-colors text-left ${
                      standard === key
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {STANDARDS[key].label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{config.description}</p>
            </div>

            {/* Atmospheric Conditions */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-cloud-sun text-blue-600"></i> Atmospheric Conditions
              </h4>

              {/* Barometric Pressure */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    Barometric Pressure
                  </label>
                  <div className="flex rounded-md border border-slate-200 overflow-hidden">
                    {(['inHg', 'mbar'] as PressureUnit[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => {
                          if (u !== pressureUnit) {
                            const val = parseFloat(pressureValue) || 0;
                            setPressureValue(
                              u === 'mbar'
                                ? (val / 0.02953).toFixed(1)
                                : (val * 0.02953).toFixed(2)
                            );
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
                <input
                  type="number"
                  step="any"
                  value={pressureValue}
                  onChange={(e) => setPressureValue(e.target.value)}
                  disabled={useElevation}
                  className={`w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-sm focus:z-10 ${
                    useElevation ? 'bg-slate-100' : ''
                  }`}
                  placeholder={pressureUnit === 'inHg' ? '29.92' : '1013.25'}
                />
              </div>

              {/* Elevation Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUseElevation(!useElevation)}
                  className={`text-xs font-bold py-2 px-3 rounded-lg border transition-colors flex items-center gap-2 ${
                    useElevation
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <i className={`fa-solid ${useElevation ? 'fa-check-square' : 'fa-square'}`}></i>
                  Use Elevation Instead
                </button>
              </div>

              {useElevation && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Elevation (ft)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={elevation}
                    onChange={(e) => setElevation(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-sm focus:z-10"
                    placeholder="0"
                  />
                  <p className="text-[10px] text-slate-500">
                    Pressure will be estimated from elevation using standard atmosphere model.
                  </p>
                </div>
              )}

              {/* Temperature */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    Ambient Temperature
                  </label>
                  <div className="flex rounded-md border border-slate-200 overflow-hidden">
                    {(['F', 'C'] as TempUnit[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => {
                          if (u !== tempUnit) {
                            const val = parseFloat(tempValue) || 0;
                            setTempValue(
                              u === 'C'
                                ? (((val - 32) * 5) / 9).toFixed(1)
                                : ((val * 9) / 5 + 32).toFixed(1)
                            );
                            setTempUnit(u);
                          }
                        }}
                        className={`px-3 py-1 text-[10px] font-bold transition-colors ${
                          tempUnit === u
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        °{u}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-sm focus:z-10"
                  placeholder={tempUnit === 'F' ? '77' : '25'}
                />
              </div>

              {/* Relative Humidity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    Relative Humidity
                  </label>
                  <span className="text-sm font-black text-blue-600">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0% (Dry)</span>
                  <span>50%</span>
                  <span>100% (Saturated)</span>
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
                  Calculated Results
                </span>
                <span className="text-[10px] bg-slate-800 text-blue-400 font-semibold px-2 py-1 rounded border border-slate-700">
                  {config.label}
                </span>
              </div>

              {/* Correction Factor */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Correction Factor
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-blue-400 tracking-tight">
                    {correctionFactor.toFixed(4)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Multiplier applied to measured horsepower
                </p>
              </div>

              {/* Corrected Horsepower */}
              <div className="mb-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Corrected Horsepower
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                    {formatNumber(correctedHp, 1)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">HP</span>
                </div>
              </div>

              {/* Measured HP */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Measured Horsepower
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    {formatNumber(parseFloat(measuredHp) || 0, 1)}
                  </span>
                  <span className="text-sm font-bold text-slate-300">HP</span>
                </div>
              </div>

              {/* Power Change */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">
                  Power Change
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`text-xl font-extrabold tracking-tight ${
                      powerChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {powerChange >= 0 ? '+' : ''}
                    {formatNumber(powerChange, 1)} HP
                  </span>
                </div>
              </div>

              {/* Atmospheric Details */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Dry Air Pressure</span>
                  <span className="text-white font-semibold">
                    {formatNumber(dryAirPressure, 4)} inHg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vapor Pressure</span>
                  <span className="text-white font-semibold">
                    {formatNumber(vaporPressure, 4)} inHg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Temperature</span>
                  <span className="text-white font-semibold">
                    {formatNumber(tempF, 1)}°F / {formatNumber(((tempF - 32) * 5) / 9, 1)}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Conditions</span>
                  <span className="text-white font-semibold">
                    {config.tempF}°F, {config.pressureInHg} inHg
                  </span>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-600 text-sm mt-0.5"></i>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  This calculator uses standard atmospheric models and industry correction
                  factors. Different standards use slightly different formulas to account
                  for air density effects on engine power.
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
              Understanding Dyno Correction Factors
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Learn how atmospheric conditions affect engine power and how correction
              factors normalize dyno results across different environments.
            </p>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Measured Horsepower</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              The raw power output measured on a dynamometer. This is the uncorrected value
              that needs to be adjusted to account for environmental conditions that affect
              engine performance.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Atmospheric Factors</h2>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Barometric Pressure</h3>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">inHg (inches of mercury):</strong> The
                standard unit for atmospheric pressure in the US. Standard sea level pressure
                is 29.92 inHg.
              </li>
              <li>
                <strong className="text-slate-900">mbar (millibars):</strong> The metric unit
                for atmospheric pressure. Standard sea level pressure is 1013.25 mbar.
              </li>
              <li>
                Lower barometric pressure (such as at higher elevations) means less oxygen
                available for combustion, which reduces engine power output.
              </li>
            </ul>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Temperature</h3>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>Colder air is denser and allows for more oxygen in the combustion chamber.</li>
              <li>Warmer air is less dense, reducing the mass of oxygen per unit volume.</li>
            </ul>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Relative Humidity</h3>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">0% Humidity:</strong> Completely dry air,
                which is optimal for combustion.
              </li>
              <li>
                <strong className="text-slate-900">100% Humidity:</strong> Air saturated with
                water vapor, which displaces oxygen and reduces power.
              </li>
            </ul>

            <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">Elevation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Height above sea level directly affects air density. Higher elevation means
              thinner air and less oxygen. If elevation is provided, the calculator estimates
              barometric pressure using standard atmospheric models.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Correction Standards</h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase font-bold">
                  <tr>
                    <th className="p-3">Standard</th>
                    <th className="p-3">Temp</th>
                    <th className="p-3">Pressure</th>
                    <th className="p-3">Used By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">SAE J1349</td>
                    <td className="p-3 text-slate-600">77°F</td>
                    <td className="p-3 text-slate-600">29.235 inHg</td>
                    <td className="p-3 text-slate-600">US manufacturers since 2005</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">SAE J607</td>
                    <td className="p-3 text-slate-600">60°F</td>
                    <td className="p-3 text-slate-600">29.92 inHg</td>
                    <td className="p-3 text-slate-600">Older vehicles</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">MSA</td>
                    <td className="p-3 text-slate-600">60°F</td>
                    <td className="p-3 text-slate-600">29.92 inHg</td>
                    <td className="p-3 text-slate-600">Motorsports</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">STD Atmosphere</td>
                    <td className="p-3 text-slate-600">59°F</td>
                    <td className="p-3 text-slate-600">29.92 inHg</td>
                    <td className="p-3 text-slate-600">General reference</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">DIN 70020</td>
                    <td className="p-3 text-slate-600">68°F</td>
                    <td className="p-3 text-slate-600">29.53 inHg</td>
                    <td className="p-3 text-slate-600">European manufacturers</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">EEC / ISO</td>
                    <td className="p-3 text-slate-600">77°F</td>
                    <td className="p-3 text-slate-600">29.92 inHg</td>
                    <td className="p-3 text-slate-600">International standard</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Correction Factor Formula</h2>
            <p className="text-slate-600 text-sm mb-3">
              The correction factor (CF) is a multiplier applied to measured horsepower to
              estimate power output under standardized conditions:
            </p>
            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-sm text-center mb-3">
              <span className="text-blue-400 font-bold">Corrected HP</span> ={' '}
              <span className="text-emerald-400">Measured HP</span> ×{' '}
              <span className="text-amber-400">CF</span>
            </div>
            <ul className="text-slate-600 text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-slate-900">CF &gt; 1.0:</strong> Standard conditions
                would produce more power than measured conditions (e.g., hot day, high altitude).
              </li>
              <li>
                <strong className="text-slate-900">CF &lt; 1.0:</strong> Standard conditions
                would produce less power (e.g., cold day, low altitude).
              </li>
              <li>
                <strong className="text-slate-900">CF = 1.0:</strong> Measured conditions
                match standard conditions.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Dry Air Pressure</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Barometric pressure minus water vapor pressure. This represents the pressure
              of just the dry components of air (oxygen, nitrogen, etc.) and is used in
              correction factor calculations because only dry air contributes to combustion.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center mt-3">
              <span className="text-sm font-mono font-bold text-slate-800">
                Dry Air Pressure = Barometric Pressure − Vapor Pressure
              </span>
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>
              Important Note
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Correction factors are estimates. Actual engine power output depends on many
              additional factors including fuel quality, engine condition, ECU calibration,
              and forced induction characteristics. Use these values as a reference for
              comparing runs, not as absolute truth.
            </p>
          </section>
        </article>

      </div>
    </div>
  );
}