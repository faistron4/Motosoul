'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/* ---------- TYPES ---------- */
type PowerUnit = 'W' | 'kW' | 'MW' | 'hp' | 'bhp' | 'PS';
type MassUnit = 'kg' | 'g' | 'lb' | 't' | 'oz';
type PWRUnit = 'W/kg' | 'W/lb' | 'hp/lb' | 'hp/kg' | 'kW/kg' | 'kW/t' | 'hp/t';
type SolveMode = 'pwr' | 'power' | 'mass';
type TabId = 'calculator' | 'presets' | 'comparison' | 'article';
type PresetCategory = 'all' | 'hypercar' | 'race' | 'road' | 'human' | 'aviation';

interface Preset {
  id: string;
  name: string;
  category: Exclude<PresetCategory, 'all'>;
  power: number;
  powerUnit: PowerUnit;
  mass: number;
  massUnit: MassUnit;
  icon: string;
}

interface ComparisonItem {
  name: string;
  powerWatts: number;
  massKg: number;
}

/* ---------- CONSTANTS ---------- */
const POWER_CONVERSIONS: Record<PowerUnit, number> = {
  W: 1.0, kW: 1000.0, MW: 1000000.0,
  hp: 745.699872, bhp: 745.699872, PS: 735.49875,
};

const MASS_CONVERSIONS: Record<MassUnit, number> = {
  kg: 1.0, g: 0.001, lb: 0.45359237, t: 1000.0, oz: 0.028349523125,
};

const PRESETS_DATABASE: Preset[] = [
  { id: 'chiron',     name: 'Bugatti Chiron Super Sport',   category: 'hypercar', power: 1578,    powerUnit: 'hp', mass: 1995,   massUnit: 'kg', icon: 'fa-car-side' },
  { id: 'f1',         name: 'Formula 1 Race Car',           category: 'race',     power: 1000,    powerUnit: 'hp', mass: 798,    massUnit: 'kg', icon: 'fa-flag-checkered' },
  { id: 'plaid',      name: 'Tesla Model S Plaid',          category: 'road',     power: 1020,    powerUnit: 'hp', mass: 2162,   massUnit: 'kg', icon: 'fa-bolt' },
  { id: 'motogp',     name: 'MotoGP Racing Bike',           category: 'race',     power: 290,     powerUnit: 'hp', mass: 157,    massUnit: 'kg', icon: 'fa-motorcycle' },
  { id: 'cyclist',    name: 'Tour de France Sprinter',      category: 'human',    power: 1200,    powerUnit: 'W',  mass: 70,     massUnit: 'kg', icon: 'fa-person-biking' },
  { id: 'golf',       name: 'Volkswagen Golf 1.5 TSI',      category: 'road',     power: 148,     powerUnit: 'hp', mass: 1300,   massUnit: 'kg', icon: 'fa-car' },
  { id: 'cessna',     name: 'Cessna 172 Skyhawk',           category: 'aviation', power: 180,     powerUnit: 'hp', mass: 1111,   massUnit: 'kg', icon: 'fa-plane' },
  { id: 'falcon9',    name: 'Falcon 9 First Stage Rocket',  category: 'aviation', power: 9800000, powerUnit: 'hp', mass: 549054, massUnit: 'kg', icon: 'fa-rocket' },
  { id: 'human_avg',  name: 'Average Human Sprint',         category: 'human',    power: 400,     powerUnit: 'W',  mass: 75,     massUnit: 'kg', icon: 'fa-person-running' },
  { id: 'koenigsegg', name: 'Koenigsegg One:1',             category: 'hypercar', power: 1341,    powerUnit: 'hp', mass: 1341,   massUnit: 'kg', icon: 'fa-gauge-high' },
];

/* ---------- HELPERS ---------- */
function formatNumber(num: number, decimals = 2): string {
  if (isNaN(num)) return '0';
  if (num >= 1000000) return num.toExponential(2);
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

function convertRatioFromWKg(wKg: number, targetUnit: PWRUnit): number {
  switch (targetUnit) {
    case 'W/kg':  return wKg;
    case 'W/lb':  return wKg * MASS_CONVERSIONS.lb;
    case 'hp/lb': return (wKg / POWER_CONVERSIONS.hp) * MASS_CONVERSIONS.lb;
    case 'hp/kg': return wKg / POWER_CONVERSIONS.hp;
    case 'kW/kg': return wKg / 1000.0;
    case 'kW/t':  return wKg;
    case 'hp/t':  return (wKg / POWER_CONVERSIONS.hp) * 1000.0;
    default:      return wKg;
  }
}

function convertRatioToWKg(ratioVal: number, sourceUnit: PWRUnit): number {
  switch (sourceUnit) {
    case 'W/kg':  return ratioVal;
    case 'W/lb':  return ratioVal / MASS_CONVERSIONS.lb;
    case 'hp/lb': return (ratioVal * POWER_CONVERSIONS.hp) / MASS_CONVERSIONS.lb;
    case 'hp/kg': return ratioVal * POWER_CONVERSIONS.hp;
    case 'kW/kg': return ratioVal * 1000.0;
    case 'kW/t':  return ratioVal;
    case 'hp/t':  return (ratioVal * POWER_CONVERSIONS.hp) / 1000.0;
    default:      return ratioVal;
  }
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function PowerToWeightCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>('calculator');
  const [solveMode, setSolveMode] = useState<SolveMode>('pwr');

  // Calculator inputs
  const [powerValue, setPowerValue] = useState('1000');
  const [powerUnit, setPowerUnit] = useState<PowerUnit>('hp');
  const [massValue, setMassValue] = useState('1500');
  const [massUnit, setMassUnit] = useState<MassUnit>('kg');
  const [pwrValue, setPwrValue] = useState('');
  const [pwrUnit, setPwrUnit] = useState<PWRUnit>('hp/t');

  // UI state
  const [presetFilter, setPresetFilter] = useState<PresetCategory>('all');
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([
    { name: 'Bugatti Chiron Super Sport', powerWatts: 1578 * POWER_CONVERSIONS.hp, massKg: 1995 },
    { name: 'Formula 1 Race Car',         powerWatts: 1000 * POWER_CONVERSIONS.hp, massKg: 798 },
    { name: 'Tesla Model S Plaid',        powerWatts: 1020 * POWER_CONVERSIONS.hp, massKg: 2162 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalPower, setModalPower] = useState('');
  const [modalPowerUnit, setModalPowerUnit] = useState<PowerUnit>('hp');
  const [modalMass, setModalMass] = useState('');
  const [modalMassUnit, setModalMassUnit] = useState<MassUnit>('kg');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived raw values
  const powerWatts = (parseFloat(powerValue) || 0) * POWER_CONVERSIONS[powerUnit];
  const massKg     = (parseFloat(massValue) || 0) * MASS_CONVERSIONS[massUnit];

  /* ---------- SYNC EFFECTS (bidirectional solve) ---------- */
  // Solve PWR
  useEffect(() => {
    if (solveMode !== 'pwr') return;
    if (massKg <= 0) { setPwrValue('0'); return; }
    const wKg = powerWatts / massKg;
    setPwrValue(formatNumber(convertRatioFromWKg(wKg, pwrUnit)));
  }, [solveMode, powerWatts, massKg, pwrUnit]);

  // Solve Power
  useEffect(() => {
    if (solveMode !== 'power') return;
    const targetWKg = convertRatioToWKg(parseFloat(pwrValue) || 0, pwrUnit);
    const newWatts = targetWKg * massKg;
    setPowerValue(formatNumber(newWatts / POWER_CONVERSIONS[powerUnit]));
  }, [solveMode, pwrValue, pwrUnit, massKg, powerUnit]);

  // Solve Mass
  useEffect(() => {
    if (solveMode !== 'mass') return;
    const targetWKg = convertRatioToWKg(parseFloat(pwrValue) || 0, pwrUnit);
    if (targetWKg > 0) {
      setMassValue(formatNumber((powerWatts / targetWKg) / MASS_CONVERSIONS[massUnit]));
    }
  }, [solveMode, pwrValue, pwrUnit, powerWatts, massUnit]);

  /* ---------- COMPUTED DISPLAY ---------- */
  const ratioWKg   = massKg > 0 ? powerWatts / massKg : 0;
  const ratioHpTon = massKg > 0 ? (powerWatts / POWER_CONVERSIONS.hp) / (massKg / 1000.0) : 0;
  const ratioHpLb  = massKg > 0 ? (powerWatts / POWER_CONVERSIONS.hp) / (massKg / MASS_CONVERSIONS.lb) : 0;
  const kgPerKw    = powerWatts > 0 ? massKg / (powerWatts / 1000.0) : 0;
  const primaryDisplayVal = convertRatioFromWKg(ratioWKg, pwrUnit);

  /* ---------- TOAST ---------- */
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 2500);
  }, []);

  /* ---------- HANDLERS ---------- */
  const handleReset = () => {
    setPowerValue('1000'); setPowerUnit('hp');
    setMassValue('1500');  setMassUnit('kg');
    setPwrUnit('hp/t');
    setSolveMode('pwr');
  };

  const handleCopyPrimary = () => {
    const text = `${formatNumber(primaryDisplayVal)} ${pwrUnit}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    showToast(`Copied "${text}" to clipboard!`);
  };

  const loadQuickPreset = (id: string) => {
    const p = PRESETS_DATABASE.find((x) => x.id === id);
    if (!p) return;
    setPowerValue(String(p.power)); setPowerUnit(p.powerUnit);
    setMassValue(String(p.mass));   setMassUnit(p.massUnit);
    setSolveMode('pwr');
  };

  const addCurrentToComparison = () => {
    const pVal = parseFloat(powerValue) || 0;
    const mVal = parseFloat(massValue) || 0;
    if (pVal <= 0 || mVal <= 0) {
      showToast('Please enter valid power and weight values first.');
      return;
    }
    setComparisonItems([
      ...comparisonItems,
      { name: `Custom Item (${pVal} ${powerUnit})`, powerWatts: pVal * POWER_CONVERSIONS[powerUnit], massKg: mVal * MASS_CONVERSIONS[massUnit] },
    ]);
    setActiveTab('comparison');
    showToast('Added to comparison table!');
  };

  const removeComparisonItem = (idx: number) => {
    setComparisonItems(comparisonItems.filter((_, i) => i !== idx));
  };

  const saveCustomComparisonItem = () => {
    const pVal = parseFloat(modalPower) || 0;
    const mVal = parseFloat(modalMass) || 0;
    if (pVal <= 0 || mVal <= 0) { showToast('Please enter positive numbers.'); return; }
    setComparisonItems([
      ...comparisonItems,
      { name: modalName || 'Custom Subject', powerWatts: pVal * POWER_CONVERSIONS[modalPowerUnit], massKg: mVal * MASS_CONVERSIONS[modalMassUnit] },
    ]);
    setShowModal(false);
    setModalName(''); setModalPower(''); setModalMass('');
    showToast('Saved to comparison table!');
  };

  /* ---------- BENCHMARK BADGE ---------- */
  const benchmark = (() => {
    if (ratioHpTon >= 800) return { cls: 'bg-rose-600 border-rose-500', icon: 'fa-rocket', text: 'Extreme Aerospace / Formula 1 Tier' };
    if (ratioHpTon >= 500) return { cls: 'bg-purple-600 border-purple-500', icon: 'fa-gauge-high', text: 'Hypercar / Track Superbike' };
    if (ratioHpTon >= 250) return { cls: 'bg-amber-600 border-amber-500', icon: 'fa-car-side', text: 'Supercar Performance Level' };
    if (ratioHpTon >= 120) return { cls: 'bg-teal-600 border-teal-500', icon: 'fa-car', text: 'Sports Car / Hot Hatch' };
    if (ratioWKg <= 20)    return { cls: 'bg-slate-700 border-slate-600', icon: 'fa-person-biking', text: 'Human Athlete / Bicycle Tier' };
    return { cls: 'bg-blue-600 border-blue-500', icon: 'fa-car', text: 'Standard Commuter Vehicle' };
  })();

  /* ---------- ACCELERATION ESTIMATE ---------- */
  const totalHp = powerWatts / POWER_CONVERSIONS.hp;
  const kgPerHp = totalHp > 0 ? massKg / totalHp : 0;
  const est0100 = ratioHpTon < 30 ? '> 15.0 sec' : `~${Math.max(1.8, 1100 / (ratioHpTon + 30)).toFixed(1)} sec`;

  /* ---------- PRESETS FILTERED ---------- */
  const filteredPresets = presetFilter === 'all'
    ? PRESETS_DATABASE
    : PRESETS_DATABASE.filter((p) => p.category === presetFilter);

  /* ---------- COMPARISON MAX ---------- */
  const maxHpTon = comparisonItems.reduce((max, it) => {
    const hpTon = (it.powerWatts / POWER_CONVERSIONS.hp) / (it.massKg / 1000);
    return hpTon > max ? hpTon : max;
  }, 0);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <>
      {/* ===== Tabs Nav (original header ka nav part) ===== */}
      <div className="bg-slate-900 border-b-4 border-blue-600 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-center">
          <nav className="flex rounded-lg bg-slate-800 p-1 border border-slate-700 w-full sm:w-auto overflow-x-auto" aria-label="Main Navigation">
            {(['calculator', 'presets', 'comparison', 'article'] as TabId[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`tab-btn px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === t ? 'active' : ''}`}
              >
                {t === 'calculator' && <><i className="fa-solid fa-calculator mr-1.5"></i> Calculator</>}
                {t === 'presets'    && <><i className="fa-solid fa-car-side mr-1.5"></i> Presets</>}
                {t === 'comparison' && <><i className="fa-solid fa-code-compare mr-1.5"></i> Compare</>}
                {t === 'article'    && <><i className="fa-solid fa-book-open mr-1.5"></i> Complete Guide &amp; Blog</>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ===== Toast ===== */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl border-l-4 border-emerald-500 z-50 flex items-center space-x-3">
            <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
            <span className="text-sm font-medium">{toastMsg}</span>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 1: CALCULATOR */}
        {/* ==================================================== */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
              <div className="flex items-start">
                <i className="fa-solid fa-circle-info text-blue-600 text-lg mt-0.5 mr-3"></i>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Bidirectional Physics Calculator</h2>
                  <p className="text-xs text-slate-600 mt-0.5">Enter any two parameters (Power, Mass, or PWR) to compute the missing variable automatically. Convert units seamlessly without losing precision.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT: Inputs */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-sliders text-blue-600"></i> Calculator Inputs
                  </h3>
                  <button onClick={handleReset} className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-colors border border-slate-200 flex items-center gap-1.5">
                    <i className="fa-solid fa-rotate-left"></i> Reset
                  </button>
                </div>

                {/* Solve Switcher */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Solve For:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['pwr', 'power', 'mass'] as SolveMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setSolveMode(m)}
                        className={`text-xs font-bold py-2 px-3 rounded-md border transition-colors ${
                          solveMode === m
                            ? 'bg-blue-600 text-white border-blue-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m === 'pwr' ? 'PWR (Ratio)' : m === 'power' ? 'Total Power' : 'Total Mass'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Power Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                    <span>Power Output</span>
                    {solveMode === 'power' && <span className="text-blue-600 font-normal text-[11px]">(Calculated Output)</span>}
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="number" step="any" placeholder="Enter power..."
                      value={powerValue}
                      readOnly={solveMode === 'power'}
                      onChange={(e) => setPowerValue(e.target.value)}
                      className={`block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg ${solveMode === 'power' ? 'bg-slate-100' : ''}`}
                    />
                    <select value={powerUnit} onChange={(e) => setPowerUnit(e.target.value as PowerUnit)} className="rounded-r-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 border-l">
                      <option value="hp">Horsepower (hp)</option>
                      <option value="bhp">Brake Hp (bhp)</option>
                      <option value="kW">Kilowatts (kW)</option>
                      <option value="W">Watts (W)</option>
                      <option value="PS">Metric Hp (PS)</option>
                      <option value="MW">Megawatts (MW)</option>
                    </select>
                  </div>
                </div>

                {/* Mass Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                    <span>Total Weight / Mass</span>
                    {solveMode === 'mass' && <span className="text-blue-600 font-normal text-[11px]">(Calculated Output)</span>}
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="number" step="any" placeholder="Enter mass..."
                      value={massValue}
                      readOnly={solveMode === 'mass'}
                      onChange={(e) => setMassValue(e.target.value)}
                      className={`block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg ${solveMode === 'mass' ? 'bg-slate-100' : ''}`}
                    />
                    <select value={massUnit} onChange={(e) => setMassUnit(e.target.value as MassUnit)} className="rounded-r-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 border-l">
                      <option value="kg">Kilograms (kg)</option>
                      <option value="lb">Pounds (lbs)</option>
                      <option value="t">Metric Tons (t)</option>
                      <option value="g">Grams (g)</option>
                      <option value="oz">Ounces (oz)</option>
                    </select>
                  </div>
                </div>

                {/* PWR Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
                    <span>Power-to-Weight Ratio</span>
                    {solveMode === 'pwr' && <span className="text-blue-600 font-normal text-[11px]">(Calculated Output)</span>}
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="number" step="any" placeholder="Power to weight ratio..."
                      value={pwrValue}
                      readOnly={solveMode === 'pwr'}
                      onChange={(e) => setPwrValue(e.target.value)}
                      className={`block w-full rounded-l-lg border border-r-0 border-slate-300 px-3.5 py-2.5 text-slate-900 font-semibold text-lg ${solveMode === 'pwr' ? 'bg-slate-50' : ''}`}
                    />
                    <select value={pwrUnit} onChange={(e) => setPwrUnit(e.target.value as PWRUnit)} className="rounded-r-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 border-l">
                      <option value="hp/t">hp / ton (t)</option>
                      <option value="W/kg">Watts / kg (W/kg)</option>
                      <option value="W/lb">Watts / lb (W/lb)</option>
                      <option value="hp/lb">hp / lb</option>
                      <option value="hp/kg">hp / kg</option>
                      <option value="kW/kg">kW / kg</option>
                      <option value="kW/t">kW / ton (t)</option>
                    </select>
                  </div>
                </div>

                {/* Quick Preset */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Load Quick Example Preset:</label>
                  <select
                    onChange={(e) => { if (e.target.value) loadQuickPreset(e.target.value); }}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
                    defaultValue=""
                  >
                    <option value="" disabled>-- Select a preset vehicle / entity --</option>
                    <option value="f1">Formula 1 Race Car (1000 hp / 798 kg)</option>
                    <option value="chiron">Bugatti Chiron Super Sport (1578 hp / 1995 kg)</option>
                    <option value="plaid">Tesla Model S Plaid (1020 hp / 2162 kg)</option>
                    <option value="motogp">MotoGP Race Motorcycle (290 hp / 157 kg)</option>
                    <option value="cyclist">Tour de France Sprinter (1200 W / 70 kg)</option>
                    <option value="golf">VW Golf 1.5 TSI (148 hp / 1300 kg)</option>
                    <option value="cessna">Cessna 172 Light Aircraft (180 hp / 1111 kg)</option>
                    <option value="falcon9">Falcon 9 Rocket Stage 1 (9.8M hp / 549,054 kg)</option>
                  </select>
                </div>
              </div>

              {/* RIGHT: Results */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 solid-shadow flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Calculated Result</span>
                      <button onClick={handleCopyPrimary} className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold px-2.5 py-1 rounded transition-colors flex items-center gap-1 border border-slate-700">
                        <i className="fa-regular fa-copy"></i> Copy Output
                      </button>
                    </div>

                    <div className="my-4">
                      <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">Primary Power-to-Weight Ratio</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-extrabold text-blue-400 tracking-tight">{formatNumber(primaryDisplayVal)}</span>
                        <span className="text-lg font-bold text-slate-300">{pwrUnit}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Equivalent Unit Values</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                          <div className="text-slate-400">Watts per Kg</div>
                          <div className="text-sm font-bold text-white mt-0.5">{formatNumber(ratioWKg)} W/kg</div>
                        </div>
                        <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                          <div className="text-slate-400">Hp per Ton</div>
                          <div className="text-sm font-bold text-white mt-0.5">{formatNumber(ratioHpTon)} hp/t</div>
                        </div>
                        <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                          <div className="text-slate-400">Hp per Pound</div>
                          <div className="text-sm font-bold text-white mt-0.5">{formatNumber(ratioHpLb, 4)} hp/lb</div>
                        </div>
                        <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                          <div className="text-slate-400">Weight to Power</div>
                          <div className="text-sm font-bold text-white mt-0.5">{formatNumber(kgPerKw)} kg/kW</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">Performance Classification</span>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-white border ${benchmark.cls}`}>
                      <i className={`fa-solid ${benchmark.icon}`}></i>
                      <span>{benchmark.text}</span>
                    </div>
                  </div>
                </div>

                <button onClick={addCurrentToComparison} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2">
                  <i className="fa-solid fa-plus text-blue-400"></i> Add Calculation to Comparison Table
                </button>
              </div>
            </div>

            {/* Acceleration Estimate */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-bolt text-amber-500"></i> Estimated Automotive Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Estimated 0-100 km/h (0-62 mph)</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{est0100}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Estimated for road vehicles with street tires (μ ≈ 1.0).</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Specific Power Density</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{massKg > 0 ? (powerWatts / massKg / 1000).toFixed(2) : '0.00'} W/g</div>
                  <p className="text-[11px] text-slate-500 mt-1">Specific energy conversion rate per gram.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Mass Burden Per Horsepower</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{kgPerHp.toFixed(1)} kg/hp</div>
                  <p className="text-[11px] text-slate-500 mt-1">Total weight propelled by each single hp unit.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: PRESETS */}
        {/* ==================================================== */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Vehicle &amp; Physics Preset Database</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Examine power-to-weight ratios across motorsport, road cars, human athletes, and aerospace engineering.</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'hypercar', 'race', 'road', 'human', 'aviation'] as PresetCategory[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setPresetFilter(c)}
                      className={`preset-filter-btn px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        presetFilter === c
                          ? 'bg-slate-900 text-white border border-slate-900'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {c === 'all' ? 'All' : c === 'hypercar' ? 'Supercars' : c === 'race' ? 'Motorsport' : c === 'road' ? 'Road Cars' : c === 'human' ? 'Human / Cycling' : 'Aerospace'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPresets.map((p) => {
                  const pWatts = p.power * POWER_CONVERSIONS[p.powerUnit];
                  const mKg = p.mass * MASS_CONVERSIONS[p.massUnit];
                  const ratioHpTon = (pWatts / POWER_CONVERSIONS.hp) / (mKg / 1000);
                  return (
                    <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500 transition-colors">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                          <span className="bg-slate-200 text-slate-700 p-1.5 rounded-md text-xs"><i className={`fa-solid ${p.icon}`}></i></span>
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-slate-600">
                          <div>Power: <span className="font-bold text-slate-800">{p.power} {p.powerUnit}</span></div>
                          <div>Weight: <span className="font-bold text-slate-800">{p.mass} {p.massUnit}</span></div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-baseline">
                          <span className="text-xs text-slate-500 font-semibold uppercase">PWR</span>
                          <span className="text-base font-extrabold text-blue-600">{formatNumber(ratioHpTon)} hp/t</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { loadQuickPreset(p.id); setActiveTab('calculator'); showToast('Preset loaded into calculator!'); }}
                        className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-solid fa-arrow-right"></i> Load in Calculator
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: COMPARISON */}
        {/* ==================================================== */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 solid-shadow space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Side-by-Side Comparison Tool</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Compare power-to-weight metrics across multiple custom inputs or preset vehicles.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Add Custom Entry
                  </button>
                  <button onClick={() => setComparisonItems([])} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2 rounded-lg transition-colors border border-slate-200">
                    Clear All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Vehicle / Subject Name</th>
                      <th className="p-3.5">Power</th>
                      <th className="p-3.5">Weight / Mass</th>
                      <th className="p-3.5">PWR (hp / ton)</th>
                      <th className="p-3.5">PWR (W / kg)</th>
                      <th className="p-3.5 text-center">Relative Scale</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {comparisonItems.map((item, idx) => {
                      const hpTon = (item.powerWatts / POWER_CONVERSIONS.hp) / (item.massKg / 1000);
                      const wKg = item.powerWatts / item.massKg;
                      const hp = item.powerWatts / POWER_CONVERSIONS.hp;
                      const pct = maxHpTon > 0 ? (hpTon / maxHpTon) * 100 : 0;
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                          <td className="p-3.5">{formatNumber(hp)} hp</td>
                          <td className="p-3.5">{formatNumber(item.massKg)} kg</td>
                          <td className="p-3.5 font-bold text-blue-600">{formatNumber(hpTon)} hp/t</td>
                          <td className="p-3.5 font-bold text-slate-800">{formatNumber(wKg)} W/kg</td>
                          <td className="p-3.5 text-center">
                            <div className="w-24 bg-slate-200 rounded-full h-2.5 mx-auto overflow-hidden">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </td>
                          <td className="p-3.5 text-right">
                            <button onClick={() => removeComparisonItem(idx)} className="text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded" aria-label="Delete entry">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {comparisonItems.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <i className="fa-solid fa-list-check text-4xl mb-3 text-slate-300"></i>
                  <p className="text-sm font-semibold">No entries in the comparison table.</p>
                  <p className="text-xs mt-1">Add items from the calculator or preset database.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: ARTICLE */}
        {/* ==================================================== */}
        {activeTab === 'article' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3">
              <div className="bg-white p-5 rounded-xl border border-slate-200 solid-shadow sticky top-24">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <i className="fa-solid fa-list text-blue-600"></i> Navigation Index
                </h3>
                <nav className="text-xs space-y-2 text-slate-600">
                  <a href="#art-intro" className="block hover:text-blue-600 hover:font-semibold transition-colors">1. Introduction to Power-to-Weight Ratio</a>
                  <a href="#art-formula" className="block hover:text-blue-600 hover:font-semibold transition-colors">2. The Mathematics &amp; Conversion Units</a>
                  <a href="#art-chapman" className="block hover:text-blue-600 hover:font-semibold transition-colors">3. Why Weight Reduction Beats Horsepower</a>
                  <a href="#art-benchmarks" className="block hover:text-blue-600 hover:font-semibold transition-colors">4. Real-World Vehicle Benchmarks</a>
                  <a href="#art-improvement" className="block hover:text-blue-600 hover:font-semibold transition-colors">5. How to Improve Your Vehicle&apos;s PWR</a>
                  <a href="#art-faq" className="block hover:text-blue-600 hover:font-semibold transition-colors">6. Frequently Asked Questions (FAQ)</a>
                </nav>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button onClick={() => { setActiveTab('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition-colors">
                    Back to Calculator Tool
                  </button>
                </div>
              </div>
            </aside>

            <article className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 solid-shadow article-content">
              {/* --- Article content (same as original HTML) --- */}
              <header className="border-b border-slate-200 pb-6 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  <span className="bg-blue-50 px-2.5 py-1 rounded border border-blue-200">Engineering &amp; Physics Guide</span>
                  <span>•</span><span>12 Min Read</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  The Ultimate Guide to Power-to-Weight Ratio: Formula, Calculation &amp; Performance Impact
                </h1>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Discover how power-to-weight ratio (PWR) governs acceleration, vehicle dynamics, and cycling power outputs. Learn the fundamental physics equations, conversion methods, and real-world performance benchmarks.
                </p>
              </header>

              <section id="art-intro" className="scroll-mt-24">
                <h2>1. What is Power-to-Weight Ratio (PWR)?</h2>
                <p>The <strong>Power-to-Weight Ratio (PWR)</strong> is a fundamental physical metric defined as the measurement of an engine or power source&apos;s total power output divided by the total mass or weight of the vehicle (or object) being moved.</p>
                <p>In mechanical engineering and physics, power represents the rate at which work is performed over time (P = W/t), while mass (m) determines the inertial resistance of an object to acceleration according to Newton&apos;s second law of motion (F = ma).</p>
                <p>Whether analyzing a <strong>Formula 1 race car</strong>, an electric supercar, a commercial aircraft, or a competitive Tour de France cyclist, power-to-weight ratio serves as the definitive indicator of acceleration capabilities, hill-climbing prowess, and dynamic agility.</p>
                <blockquote>&quot;Power-to-weight ratio is the ultimate equalizer in physics. A lightweight 200 hp sports car can easily out-accelerate a heavy 400 hp luxury sedan because each unit of horsepower has less mass to move.&quot;</blockquote>
              </section>

              <section id="art-formula" className="scroll-mt-24">
                <h2>2. The Power-to-Weight Ratio Formula &amp; Calculation</h2>
                <p>The basic mathematical equation for calculating power-to-weight ratio is straightforward:</p>
                <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-center my-4 border border-slate-800">
                  <span className="text-blue-400 font-bold">PWR</span> = <span className="text-emerald-400">Total Power Output</span> / <span className="text-amber-400">Total Vehicle Mass</span>
                </div>
                <h3>Standard Units of Measurement</h3>
                <ul className="space-y-1">
                  <li><strong>Horsepower per Ton (hp/ton):</strong> Predominantly used in the UK and automotive journalism.</li>
                  <li><strong>Watts per Kilogram (W/kg):</strong> The standard SI metric, used in cycling, human physiology, and electric mobility.</li>
                  <li><strong>Horsepower per Pound (hp/lb):</strong> Common in American motorsport, drag racing, and aviation.</li>
                  <li><strong>Kilowatts per Kilogram (kW/kg):</strong> Standard in industrial mechanical engineering and EV motors.</li>
                </ul>
                <h3>Unit Conversion Reference Guide</h3>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase font-bold">
                      <tr><th className="p-3">From Unit</th><th className="p-3">To Unit</th><th className="p-3">Multiply By Factor</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-slate-50 font-mono">
                      <tr><td className="p-3 font-semibold text-slate-800">Horsepower (hp)</td><td className="p-3 text-slate-600">Watts (W)</td><td className="p-3 text-blue-600 font-bold">745.7</td></tr>
                      <tr><td className="p-3 font-semibold text-slate-800">Kilowatts (kW)</td><td className="p-3 text-slate-600">Horsepower (hp)</td><td className="p-3 text-blue-600 font-bold">1.34102</td></tr>
                      <tr><td className="p-3 font-semibold text-slate-800">Pounds (lbs)</td><td className="p-3 text-slate-600">Kilograms (kg)</td><td className="p-3 text-blue-600 font-bold">0.453592</td></tr>
                      <tr><td className="p-3 font-semibold text-slate-800">W/kg</td><td className="p-3 text-slate-600">hp / Metric Ton</td><td className="p-3 text-blue-600 font-bold">1.34102</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="art-chapman" className="scroll-mt-24">
                <h2>3. Why Weight Reduction Beats Adding Horsepower</h2>
                <p>In automotive engineering, legendary Lotus founder Colin Chapman famously stated his design philosophy:</p>
                <blockquote className="border-l-4 border-amber-500 bg-amber-50 text-amber-900">
                  &quot;Adding power makes you faster on the straights. Subtracting weight makes you faster everywhere.&quot;
                  <cite className="block text-xs font-normal mt-1 text-amber-700">— Colin Chapman, Founder of Lotus Cars</cite>
                </blockquote>
                <ol>
                  <li><strong>Reduced Inertia in Cornering:</strong> Lower mass means less centrifugal force on the tires during cornering (F_c = mv²/r).</li>
                  <li><strong>Superior Braking Performance:</strong> Kinetic energy E_k = ½mv². Reducing mass decreases kinetic energy that brakes must convert into heat.</li>
                  <li><strong>Saves Fuel &amp; Reduces Component Wear:</strong> Lighter vehicles require less force to maintain speed, reducing wear.</li>
                </ol>
              </section>

              <section id="art-benchmarks" className="scroll-mt-24">
                <h2>4. Real-World Vehicle &amp; Entity Benchmarks</h2>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase font-bold">
                      <tr><th className="p-3">Vehicle / Entity</th><th className="p-3">Power</th><th className="p-3">Weight</th><th className="p-3">hp / Ton</th><th className="p-3">W / kg</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr className="hover:bg-slate-50"><td className="p-3 font-bold text-slate-900">Formula 1 Race Car</td><td className="p-3">1,000 hp</td><td className="p-3">798 kg</td><td className="p-3 font-bold text-rose-600">1,253 hp/t</td><td className="p-3 font-bold text-slate-800">934 W/kg</td></tr>
                      <tr className="hover:bg-slate-50"><td className="p-3 font-bold text-slate-900">MotoGP Superbike</td><td className="p-3">290 hp</td><td className="p-3">157 kg</td><td className="p-3 font-bold text-purple-600">1,847 hp/t</td><td className="p-3 font-bold text-slate-800">1,377 W/kg</td></tr>
                      <tr className="hover:bg-slate-50"><td className="p-3 font-bold text-slate-900">Bugatti Chiron Super Sport</td><td className="p-3">1,578 hp</td><td className="p-3">1,995 kg</td><td className="p-3 font-bold text-amber-600">791 hp/t</td><td className="p-3 font-bold text-slate-800">590 W/kg</td></tr>
                      <tr className="hover:bg-slate-50"><td className="p-3 font-bold text-slate-900">Tesla Model S Plaid</td><td className="p-3">1,020 hp</td><td className="p-3">2,162 kg</td><td className="p-3 font-bold text-teal-600">471 hp/t</td><td className="p-3 font-bold text-slate-800">352 W/kg</td></tr>
                      <tr className="hover:bg-slate-50"><td className="p-3 font-bold text-slate-900">Standard Hatchback (VW Golf)</td><td className="p-3">148 hp</td><td className="p-3">1,300 kg</td><td className="p-3 font-bold text-blue-600">113 hp/t</td><td className="p-3 font-bold text-slate-800">84 W/kg</td></tr>
                      <tr className="hover:bg-slate-50"><td className="p-3 font-bold text-slate-900">Pro Cyclist (Sprint Peak)</td><td className="p-3">1,200 W (1.61 hp)</td><td className="p-3">70 kg</td><td className="p-3 font-bold text-slate-600">23 hp/t</td><td className="p-3 font-bold text-slate-800">17.1 W/kg</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="art-improvement" className="scroll-mt-24">
                <h2>5. How to Improve Your Vehicle&apos;s Power-to-Weight Ratio</h2>
                <h3>Method A: Mass Reduction (Lightweighting)</h3>
                <ul className="space-y-1">
                  <li><strong>Unsprung Weight Reduction:</strong> Replacing heavy cast alloy wheels with lightweight forged aluminum or carbon fiber wheels.</li>
                  <li><strong>Bodywork Panels:</strong> Swapping steel bonnets, roofs, and trunk lids for carbon fiber or composite panels.</li>
                  <li><strong>Interior Stripping:</strong> Removing rear seats, sound deadening, and switching to lightweight bucket seats.</li>
                </ul>
                <h3>Method B: Power Amplification (Engine Tuning)</h3>
                <ul className="space-y-1">
                  <li><strong>ECU Remapping:</strong> Optimizing fuel delivery, ignition timing, and boost pressure on forced-induction engines.</li>
                  <li><strong>High-Flow Exhaust &amp; Intake Systems:</strong> Reducing backpressure so the engine can breathe more efficiently.</li>
                </ul>
              </section>

              <section id="art-faq" className="scroll-mt-24 border-t border-slate-200 pt-6 mt-8">
                <h2>6. Frequently Asked Questions (FAQ)</h2>
                <div className="space-y-4 my-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mt-0">What is a good power-to-weight ratio for a road car?</h3>
                    <p className="text-xs text-slate-600 mb-0 mt-1">An everyday economy car typically has around 80-120 hp/ton. Sports cars average 200-350 hp/ton. Supercars range from 400 to 600 hp/ton. Above 700 hp/ton is hypercar/motorsport territory.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mt-0">Does power-to-weight ratio affect top speed?</h3>
                    <p className="text-xs text-slate-600 mb-0 mt-1">PWR primarily dictates acceleration. Top speed is dictated by aerodynamic drag (C_d × frontal area) and gearing, since air resistance increases with v².</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mt-0">How does power-to-weight ratio impact electric vehicles (EVs)?</h3>
                    <p className="text-xs text-slate-600 mb-0 mt-1">EVs generate massive instant torque, giving strong initial acceleration. However, heavy battery packs increase total mass, lowering their PWR versus lightweight ICE track cars.</p>
                  </div>
                </div>
              </section>
            </article>
          </div>
        )}
      </main>

      {/* ===== Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-300 solid-shadow space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Add Custom Item to Comparison Table</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600" aria-label="Close modal"><i className="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle / Subject Name</label>
                <input type="text" placeholder="e.g. Porsche 911 GT3" value={modalName} onChange={(e) => setModalName(e.target.value)} className="w-full border border-slate-300 rounded-md p-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Power Value</label>
                  <input type="number" placeholder="502" value={modalPower} onChange={(e) => setModalPower(e.target.value)} className="w-full border border-slate-300 rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Power Unit</label>
                  <select value={modalPowerUnit} onChange={(e) => setModalPowerUnit(e.target.value as PowerUnit)} className="w-full border border-slate-300 rounded-md p-2 text-sm bg-slate-50">
                    <option value="hp">hp</option><option value="kW">kW</option><option value="W">W</option><option value="PS">PS</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight Value</label>
                  <input type="number" placeholder="1435" value={modalMass} onChange={(e) => setModalMass(e.target.value)} className="w-full border border-slate-300 rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight Unit</label>
                  <select value={modalMassUnit} onChange={(e) => setModalMassUnit(e.target.value as MassUnit)} className="w-full border border-slate-300 rounded-md p-2 text-sm bg-slate-50">
                    <option value="kg">kg</option><option value="lb">lbs</option><option value="t">tons</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-md font-bold text-xs hover:bg-slate-200">Cancel</button>
              <button onClick={saveCustomComparisonItem} className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold text-xs hover:bg-blue-700">Save to Table</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}