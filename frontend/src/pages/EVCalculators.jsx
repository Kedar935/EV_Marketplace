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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            EV Tools & Financial Calculators
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate your exact electricity charging costs, daily battery usage, and 5-year savings compared to petrol vehicles.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setActiveTab('tco');
                calculateTco();
              }}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'tco'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              5-Year TCO Savings
            </button>
            <button
              onClick={() => {
                setActiveTab('range');
                calculateRange();
              }}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'range'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Range & Usage
            </button>
            <button
              onClick={() => {
                setActiveTab('charging');
                calculateCharging();
              }}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'charging'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Charging Cost
            </button>
          </div>
        </div>

        {/* Tab 1: 5-Year TCO Savings */}
        {activeTab === 'tco' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800">
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <button
                onClick={calculateTco}
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors"
              >
                Calculate Net 5-Year Savings
              </button>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-2">
                  Financial Projection
                </span>

                {tcoResults ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                      <span className="text-xs text-slate-600 dark:text-slate-300 block mb-1">Net 5-Year Cost Savings with EV</span>
                      <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                        ₹{tcoResults.netSavings?.toLocaleString()}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Payback period on price difference: ~{tcoResults.paybackPeriodYears} Years
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 block">Electric Vehicle Cost / km</span>
                        <div className="text-lg font-bold text-teal-600 dark:text-teal-400">₹{tcoResults.ev?.costPerKm}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 block">Petrol Car Cost / km</span>
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">₹{tcoResults.ice?.costPerKm}</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800">
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <button
                onClick={calculateRange}
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors"
              >
                Calculate Range Breakdown
              </button>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-2">
                Battery Usage Analysis
              </span>

              {rangeResults ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Daily kWh Consumption</span>
                    <div className="text-xl font-bold text-teal-600 dark:text-teal-400">{rangeResults.dailyKwhUsed} kWh</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Days Between Full Charges</span>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">~{rangeResults.daysBetweenCharges} Days</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 col-span-2">
                    <span className="text-[11px] text-slate-500 block">Daily Battery Percent Used</span>
                    <div className="text-xl font-bold text-sky-600 dark:text-sky-400">{rangeResults.percentBatteryUsedDaily}%</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800">
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <button
                onClick={calculateCharging}
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors"
              >
                Estimate Charging Cost
              </button>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-2">
                Charging Tariff Breakdown
              </span>

              {chargingResults ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Full Charge at Home</span>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{chargingResults.fullChargeCostHome}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Full Charge at Public Fast DC</span>
                    <div className="text-xl font-bold text-amber-500">₹{chargingResults.fullChargeCostFast}</div>
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
