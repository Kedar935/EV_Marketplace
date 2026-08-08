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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-3">
            <Cpu className="w-4 h-4" />
            Retrieval-Augmented Intelligent Matching Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            AI-Powered EV Recommendation System
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Our AI retrieves candidate electric vehicles directly from our live MongoDB inventory and ranks them according to your specific budget and driving requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              Specify Your Requirements
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Natural Language Query
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I need a long range SUV for 5 people under ₹25 Lakh for daily city commute..."
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Distance (km)
                  </label>
                  <input
                    type="number"
                    value={dailyDistance}
                    onChange={(e) => setDailyDistance(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
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
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Querying Candidates from MongoDB...</span>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Run AI Recommendation Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7 space-y-6">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Cpu className="w-12 h-12 text-teal-500/40 mb-3" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Ready for AI Analysis</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Click 'Run AI Recommendation Analysis' to retrieve candidates from live inventory.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Engine Metadata Badge */}
                {engineMeta && (
                  <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-between text-xs text-teal-700 dark:text-teal-300">
                    <span className="font-semibold">
                      Analyzed {engineMeta.totalCandidatesAnalyzed} candidates from MongoDB
                    </span>
                    <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">
                      {engineMeta.retrievalMethod}
                    </span>
                  </div>
                )}

                {/* Top Recommended Vehicle */}
                {result.topMatch && (
                  <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl border border-teal-500/40 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="teal">Top Recommendation #1 Choice</Badge>
                      <span className="text-xs font-bold text-emerald-400">
                        ₹{(result.topMatch.price / 100000).toFixed(2)} Lakh
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <img
                        src={result.topMatch.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80'}
                        alt={result.topMatch.title}
                        className="w-full sm:w-48 h-32 object-cover rounded-2xl shrink-0"
                      />

                      <div>
                        <h2 className="text-xl font-extrabold text-white">{result.topMatch.title}</h2>
                        <p className="text-xs text-slate-400 mt-1">{result.topMatch.brand} • {result.topMatch.rangeKm} km Range</p>

                        <div className="flex items-center gap-2 mt-3 text-xs">
                          <span className="bg-slate-800 px-2.5 py-1 rounded-lg text-teal-300">
                            Price Fit: {result.topFitMetrics?.priceFit}
                          </span>
                          <span className="bg-slate-800 px-2.5 py-1 rounded-lg text-emerald-300">
                            Range Fit: {result.topFitMetrics?.rangeFit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-teal-400 block mb-1">AI Recommendation Rationale:</strong>
                      {result.topRationale}
                    </div>

                    <Link
                      to={`/vehicles/${result.topMatch._id}`}
                      className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                    >
                      <span>View Vehicle & Purchase Options</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* Alternative Candidates */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Alternative Candidate Choices
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {result.alternatives.map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.vehicle.title}</h4>
                            <p className="text-xs text-slate-400">{item.vehicle.brand} • {item.vehicle.rangeKm} km • ₹{(item.vehicle.price / 100000).toFixed(2)} Lakh</p>
                            <p className="text-[11px] text-slate-500 mt-1">{item.rationale}</p>
                          </div>
                          <Link
                            to={`/vehicles/${item.vehicle._id}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold shrink-0"
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
