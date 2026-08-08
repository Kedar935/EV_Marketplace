import React, { useState } from 'react';
import {
  Zap,
  BatteryCharging,
  DollarSign,
  TrendingDown,
  Calculator,
  ShieldCheck,
  Fuel,
  ArrowRight,
} from 'lucide-react';
import API from '../services/api';

const EVCalculators = () => {
  const [activeTab, setActiveTab] = useState('tco');

  // TCO State
  const [evPrice, setEvPrice] = useState(1699000);
  const [icePrice, setIcePrice] = useState(1450000);
  const [annualKm, setAnnualKm] = useState(15000);
  const [tcoResults, setTcoResults] = useState(null);

  // Range State
  const [dailyDist, setDailyDist] = useState(60);
  const [batteryCap, setBatteryCap] = useState(55);
  const [vehRange, setVehRange] = useState(450);
  const [rangeResults, setRangeResults] = useState(null);

  // Charging Cost State
  const [elecTariff, setElecTariff] = useState(8);
  const [chargingResults, setChargingResults] = useState(null);

  const calculateTco = async () => {
    try {
      const res = await API.post('/calculators/tco', {
        evPrice,
        icePrice,
        annualKm,
        batteryCapacity: batteryCap,
        evRange: vehRange,
      });
      setTcoResults(res.data.results);
    } catch (e) {
      console.error('TCO calculation error:', e);
    }
  };

  const calculateRange = async () => {
    try {
      const res = await API.post('/calculators/range', {
        dailyDistance: dailyDist,
        batteryCapacity: batteryCap,
        vehicleRange: vehRange,
      });
      setRangeResults(res.data.results);
    } catch (e) {
      console.error('Range calculation error:', e);
    }
  };

  const calculateCharging = async () => {
    try {
      const res = await API.post('/calculators/charging-cost', {
        batteryCapacity: batteryCap,
        electricityPrice: elecTariff,
        vehicleRange: vehRange,
      });
      setChargingResults(res.data.results);
    } catch (e) {
      console.error('Charging calculation error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-3">
            <Calculator className="w-4 h-4" />
            Transparent EV Financial Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            EV Intelligence & Financial Tools
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Calculate your exact electricity charging costs, battery consumption, and 5-year savings compared to petrol/diesel vehicles.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => {
                setActiveTab('tco');
                calculateTco();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tco'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              5-Year TCO Savings
            </button>
            <button
              onClick={() => {
                setActiveTab('range');
                calculateRange();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'range'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Range & Commute Usage
            </button>
            <button
              onClick={() => {
                setActiveTab('charging');
                calculateCharging();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'charging'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Charging Cost Estimator
            </button>
          </div>
        </div>

        {/* Tab 1: 5-Year TCO Savings */}
        {activeTab === 'tco' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white pb-3 border-b">
                Ownership Inputs
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  EV Purchase Price (₹)
                </label>
                <input
                  type="number"
                  value={evPrice}
                  onChange={(e) => setEvPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Comparable Petrol/Diesel Car Price (₹)
                </label>
                <input
                  type="number"
                  value={icePrice}
                  onChange={(e) => setIcePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Annual Driving Distance (km)
                </label>
                <input
                  type="number"
                  value={annualKm}
                  onChange={(e) => setAnnualKm(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <button
                onClick={calculateTco}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow"
              >
                Calculate Net 5-Year Savings
              </button>
            </div>

            <div className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs text-teal-400 font-bold uppercase tracking-wider block mb-2">
                  Financial Projection
                </span>

                {tcoResults ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950 to-emerald-950 border border-teal-500/30">
                      <span className="text-xs text-slate-300 block mb-1">Net 5-Year Cost Savings with EV</span>
                      <div className="text-4xl font-black text-emerald-400">
                        ₹{tcoResults.netSavings?.toLocaleString()}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Payback period on price difference: ~{tcoResults.paybackPeriodYears} Years
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                        <span className="text-[11px] text-slate-400 block">Electric Vehicle Cost / km</span>
                        <div className="text-xl font-bold text-teal-400">₹{tcoResults.ev?.costPerKm}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                        <span className="text-[11px] text-slate-400 block">Petrol Car Cost / km</span>
                        <div className="text-xl font-bold text-red-400">₹{tcoResults.ice?.costPerKm}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Click Calculate to generate comparison report.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Range & Usage */}
        {activeTab === 'range' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white pb-3 border-b">
                Daily Commute Inputs
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Daily Commute Distance (km)
                </label>
                <input
                  type="number"
                  value={dailyDist}
                  onChange={(e) => setDailyDist(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Battery Capacity (kWh)
                </label>
                <input
                  type="number"
                  value={batteryCap}
                  onChange={(e) => setBatteryCap(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Charge Range (km)
                </label>
                <input
                  type="number"
                  value={vehRange}
                  onChange={(e) => setVehRange(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <button
                onClick={calculateRange}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow"
              >
                Calculate Range Breakdown
              </button>
            </div>

            <div className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider block mb-2">
                Battery Usage Analysis
              </span>

              {rangeResults ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">Daily kWh Consumption</span>
                    <div className="text-2xl font-bold text-teal-400">{rangeResults.dailyKwhUsed} kWh</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">Days Between Full Charges</span>
                    <div className="text-2xl font-bold text-emerald-400">~{rangeResults.daysBetweenCharges} Days</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 col-span-2">
                    <span className="text-[11px] text-slate-400 block">Daily Battery Percent Used</span>
                    <div className="text-2xl font-bold text-cyan-400">{rangeResults.percentBatteryUsedDaily}%</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Click Calculate to view range breakdown.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Charging Cost */}
        {activeTab === 'charging' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white pb-3 border-b">
                Charging Tariff Inputs
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Home Electricity Tariff (₹ / kWh)
                </label>
                <input
                  type="number"
                  value={elecTariff}
                  onChange={(e) => setElecTariff(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Battery Size (kWh)
                </label>
                <input
                  type="number"
                  value={batteryCap}
                  onChange={(e) => setBatteryCap(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <button
                onClick={calculateCharging}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow"
              >
                Estimate Charging Cost
              </button>
            </div>

            <div className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider block mb-2">
                Charging Tariff Breakdown
              </span>

              {chargingResults ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">Full Charge at Home</span>
                    <div className="text-2xl font-bold text-emerald-400">₹{chargingResults.fullChargeCostHome}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">Full Charge at Public Fast DC</span>
                    <div className="text-2xl font-bold text-amber-400">₹{chargingResults.fullChargeCostFast}</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Click Estimate to calculate charging costs.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EVCalculators;
