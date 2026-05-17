'use client';

import { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react';
import { subscriptionFeatures, SubscriptionPlan } from '@/lib/subscription';
import { useSubscription } from '@/app/context/SubscriptionContext';

const mockPredictions = [
  { symbol: "NVDA", direction: "bullish", confidence: 89, target: "148.50", reason: "Strong AI demand and excellent earnings momentum" },
  { symbol: "TSLA", direction: "bullish", confidence: 76, target: "328.75", reason: "Robotaxi event hype and production ramp-up" },
  { symbol: "AAPL", direction: "bearish", confidence: 68, target: "218.40", reason: "iPhone sales slowdown in China" },
  { symbol: "AMD", direction: "bullish", confidence: 82, target: "142.80", reason: "Data center growth and new CPU launch" },
  { symbol: "META", direction: "bullish", confidence: 85, target: "592.10", reason: "AI advertising tools performing very well" },
];

export default function AIPredictionsPage() {
  const { currentPlan } = useSubscription() as { currentPlan: SubscriptionPlan };
  const [predictions, setPredictions] = useState<any[]>([]);
  const [usedToday, setUsedToday] = useState(0);

  // Load used predictions
  useEffect(() => {
    const savedUsed = parseInt(localStorage.getItem('predictionsUsed') || '0');
    setUsedToday(savedUsed);
  }, []);

  const features = subscriptionFeatures[currentPlan];

  const generatePredictions = () => {
    const remaining = features.maxPredictions - usedToday;
    if (remaining <= 0) return;

    const newPreds = mockPredictions.slice(0, Math.min(remaining, 5));
    setPredictions(newPreds);
    
    const newUsed = Math.min(features.maxPredictions, usedToday + newPreds.length);
    setUsedToday(newUsed);
    localStorage.setItem('predictionsUsed', newUsed.toString());
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">AI Predictions</h1>
            <p className="text-zinc-400 mt-2">Smart market insights powered by AI</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Current Plan: <span className="text-emerald-400 font-semibold">{currentPlan}</span></p>
            <p className="text-sm text-zinc-500">Predictions used today: {usedToday} / {features.maxPredictions}</p>
          </div>
        </div>

        {/* Subscription Status Banner */}
        {currentPlan === 'Free' && (
          <div className="bg-gradient-to-r from-amber-900/50 to-zinc-900 border border-amber-500/30 rounded-3xl p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Free Plan Limited</h3>
              <p className="text-zinc-400">Upgrade to unlock unlimited powerful AI predictions</p>
            </div>
            <button 
              onClick={() => window.location.href = '/dashboard/subscription'}
              className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 rounded-2xl font-semibold"
            >
              Upgrade Now
            </button>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <button
            onClick={generatePredictions}
            disabled={usedToday >= features.maxPredictions}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-10 py-4 rounded-2xl font-semibold flex items-center gap-3 disabled:opacity-50"
          >
            <Zap size={22} />
            Generate New AI Predictions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.length > 0 ? (
            predictions.map((pred, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-cyan-500/50 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{pred.symbol}</h3>
                    <p className="text-sm text-zinc-500">Next Target: ${pred.target}</p>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${pred.direction === 'bullish' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {pred.direction === 'bullish' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    {pred.direction.toUpperCase()}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-zinc-400 mb-1">AI Confidence</div>
                  <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                  <p className="text-right text-sm mt-1 font-medium">{pred.confidence}%</p>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {pred.reason}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => alert(`Added ${pred.symbol} to Watchlist`)}
                    className="flex-1 border border-zinc-700 hover:bg-zinc-800 py-3 rounded-2xl text-sm"
                  >
                    Add to Watchlist
                  </button>
                  <button 
                    onClick={() => window.location.href = '/dashboard/portfolio'}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-2xl text-sm font-semibold"
                  >
                    Simulate Buy
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-zinc-500">
              Click "Generate New AI Predictions" to see smart signals
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
