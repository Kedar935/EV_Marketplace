import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  Award,
} from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import Badge from '../components/Badge';
import API from '../services/api';

const AIRecommendations = () => {
  const [prompt, setPrompt] = useState('I have a budget of ₹20 lakh, drive 60 km daily, need a family SUV and prefer good range.');
  const [maxPrice, setMaxPrice] = useState(2500000);
  const [dailyDistance, setDailyDistance] = useState(60);
  const [seatingCapacity, setSeatingCapacity] = useState(5);
  const [preferredBodyType, setPreferredBodyType] = useState('ALL');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [engineMeta, setEngineMeta] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/recommendations/recommend', {
        prompt,
        maxPrice,
        dailyDistance,
        seatingCapacity,
        preferredBodyType,
      });

      setResult(res.data.recommendation);
      setEngineMeta(res.data.engineMeta);
    } catch (err) {
      console.error('AI recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            AI EV Finder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Describe your driving habits and budget to retrieve the best matched electric vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Specify Requirements
            </h3>

            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Natural Language Query
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I need a long range SUV for 5 people under ₹25 Lakh for daily city commute..."
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Budget (₹ Lakh)
                </label>
                <input
                  type="number"
                  value={maxPrice / 100000}
                  onChange={(e) => setMaxPrice(Number(e.target.value) * 100000)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Distance (km)
                  </label>
                  <input
                    type="number"
                    value={dailyDistance}
                    onChange={(e) => setDailyDistance(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Seating Needed
                  </label>
                  <input
                    type="number"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Body Style
                </label>
                <select
                  value={preferredBodyType}
                  onChange={(e) => setPreferredBodyType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="ALL">Any Body Style</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Crossover">Crossover</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <span>Analyzing Candidates...</span>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Find Matching EVs</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7 space-y-5">
            {!result ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <Cpu className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Ready for Analysis</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Click 'Find Matching EVs' to search through current inventory.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Engine Metadata Badge */}
                {engineMeta && (
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg flex items-center justify-between text-xs text-teal-800 dark:text-teal-300">
                    <span className="font-medium">
                      Analyzed {engineMeta.totalCandidatesAnalyzed} vehicles
                    </span>
                    <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded font-semibold">
                      {engineMeta.retrievalMethod}
                    </span>
                  </div>
                )}

                {/* Top Recommended Vehicle */}
                {result.topMatch && (
                  <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-teal-500/50 dark:border-teal-500/30 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-teal-600 text-white">Top Choice</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        ₹{(result.topMatch.price / 100000).toFixed(2)} Lakh
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={result.topMatch.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80'}
                        alt={result.topMatch.title}
                        className="w-full sm:w-40 h-28 object-cover rounded-lg shrink-0"
                      />

                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{result.topMatch.title}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{result.topMatch.brand} · {result.topMatch.rangeKm} km Range</p>

                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                            Price Fit: {result.topFitMetrics?.priceFit}
                          </span>
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                            Range Fit: {result.topFitMetrics?.rangeFit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-white block mb-0.5">Recommendation Rationale:</strong>
                      {result.topRationale}
                    </div>

                    <Link
                      to={`/vehicles/${result.topMatch._id}`}
                      className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Vehicle Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* Alternative Candidates */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                      Alternative Options
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {result.alternatives.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{item.vehicle.title}</h4>
                            <p className="text-[11px] text-slate-400">{item.vehicle.brand} · {item.vehicle.rangeKm} km · ₹{(item.vehicle.price / 100000).toFixed(2)} Lakh</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.rationale}</p>
                          </div>
                          <Link
                            to={`/vehicles/${item.vehicle._id}`}
                            className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                          >
                            Details
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
