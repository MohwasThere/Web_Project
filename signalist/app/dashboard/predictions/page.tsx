'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Zap, RefreshCw } from 'lucide-react';
import { subscriptionFeatures, SubscriptionPlan } from '@/lib/subscription';
import { useSubscription } from '@/app/context/SubscriptionContext';
import { getLogoCandidates } from '@/lib/market/logos';
import { toast } from 'react-hot-toast';

const SUGGESTED_SYMBOLS = ['NVDA', 'TSLA', 'AAPL', 'AMD', 'META'];

interface Prediction {
  id: string;
  symbol: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  target: string;
  reason: string;
  createdAt?: string;
}

interface QuotaInfo {
  plan: SubscriptionPlan;
  maxPredictions: number;
  usedToday: number;
  remaining: number;
}

function StockLogo({ name, symbol }: { name: string; symbol: string }) {
  const [logoIndex, setLogoIndex] = useState(0);
  const logoCandidates = getLogoCandidates(symbol);
  const currentLogo = logoCandidates[logoIndex];

  useEffect(() => {
    setLogoIndex(0);
  }, [symbol]);

  if (!currentLogo) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200">
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={currentLogo}
      alt={`${name} logo`}
      onError={() => setLogoIndex((prev) => prev + 1)}
      className="w-8 h-8 rounded-full bg-zinc-900 ring-1 ring-zinc-700 p-1 object-contain"
    />
  );
}

export default function AIPredictionsPage() {
  const { currentPlan } = useSubscription() as { currentPlan: SubscriptionPlan };
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const features = subscriptionFeatures[currentPlan];

  const loadQuota = useCallback(async () => {
    try {
      const response = await fetch('/api/predictions', { cache: 'no-store' });
      if (!response.ok) return;
      const data = (await response.json()) as QuotaInfo;
      setQuota(data);
    } catch {}
  }, []);

  // Re-fetch quota whenever the plan changes (e.g. after an upgrade)
  useEffect(() => {
    void loadQuota();
  }, [loadQuota, currentPlan]);

  const generatePredictions = async () => {
    const remaining = quota?.remaining ?? features.maxPredictions;
    if (remaining <= 0) return;

    setIsGenerating(true);
    const symbolsToGenerate = SUGGESTED_SYMBOLS.slice(0, Math.min(remaining, 5));

    const results = await Promise.allSettled(
      symbolsToGenerate.map(async (symbol) => {
        const response = await fetch('/api/predictions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          if (response.status === 429) {
            throw new Error('quota_exceeded');
          }
          throw new Error(payload?.error ?? `Failed for ${symbol}`);
        }

        const payload = (await response.json()) as { prediction: Prediction; remaining: number };
        return payload.prediction;
      })
    );

    const successful = results
      .filter((r): r is PromiseFulfilledResult<Prediction> => r.status === 'fulfilled')
      .map((r) => r.value);

    const quotaExceeded = results.some(
      (r) => r.status === 'rejected' && (r as PromiseRejectedResult).reason?.message === 'quota_exceeded'
    );

    const otherFailures = results.filter(
      (r) => r.status === 'rejected' && (r as PromiseRejectedResult).reason?.message !== 'quota_exceeded'
    ).length;

    if (successful.length > 0) {
      setPredictions(successful);
      toast.success(`Generated ${successful.length} prediction${successful.length !== 1 ? 's' : ''}`);
    }

    if (quotaExceeded) {
      toast.error('Daily prediction limit reached. Upgrade your plan for more.');
    } else if (otherFailures > 0 && successful.length === 0) {
      toast.error('Failed to generate predictions. Please try again.');
    }

    await loadQuota();
    setIsGenerating(false);
  };

  const addToWatchlist = async (symbol: string) => {
    try {
      // 1. Fetch current watchlist
      const response = await fetch('/api/watchlist', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch watchlist');
      const payload = await response.json();
      const items = payload.items || [];

      if (items.some((item: { symbol: string }) => item.symbol === symbol)) {
        toast.error(`${symbol} is already in your watchlist!`);
        return;
      }

      // 2. Fetch live price so entryPrice is set (needed for "% since added")
      const quoteRes = await fetch(`/api/market/quotes?symbols=${encodeURIComponent(symbol)}`, { cache: 'no-store' });
      const quotePayload = quoteRes.ok
        ? (await quoteRes.json() as { quotes: Record<string, { price: number }> })
        : { quotes: {} };
      const livePrice = quotePayload.quotes[symbol]?.price ?? 0;

      const newItem = {
        symbol,
        name: `${symbol} Inc.`,
        entryPrice: livePrice > 0 ? Number(livePrice.toFixed(2)) : 0,
        addedAt: new Date().toISOString(),
      };

      // 3. Save
      const updateResponse = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [...items, newItem] }),
      });

      if (!updateResponse.ok) throw new Error('Failed to update watchlist');

      toast.success(`Added ${symbol} to Watchlist`);
      setPredictions((prev) => prev.filter((p) => p.symbol !== symbol));
    } catch {
      toast.error('Could not add to watchlist');
    }
  };

  const usedToday = quota?.usedToday ?? 0;
  const maxPredictions = quota?.maxPredictions ?? features.maxPredictions;
  const remaining = quota?.remaining ?? features.maxPredictions;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">AI Predictions</h1>
            <p className="text-zinc-400 mt-2">Smart market insights powered by Gemini AI</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Current Plan: <span className="text-emerald-400 font-semibold">{currentPlan}</span></p>
            <p className="text-sm text-zinc-500">Predictions used today: {usedToday} / {maxPredictions}</p>
          </div>
        </div>

        {currentPlan === 'Free' && (
          <div className="bg-gradient-to-r from-amber-900/50 to-zinc-900 border border-amber-500/30 rounded-xl p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Free Plan Limited</h3>
              <p className="text-zinc-400">Upgrade to unlock unlimited powerful AI predictions</p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard/subscription'}
              className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 rounded-lg font-semibold"
            >
              Upgrade Now
            </button>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => void generatePredictions()}
            disabled={isGenerating || remaining <= 0}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-7 py-3 rounded-lg font-semibold flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <RefreshCw size={22} className="animate-spin" /> : <Zap size={22} />}
            {isGenerating ? 'Generating...' : 'Generate New AI Predictions'}
          </button>
          {remaining <= 0 && (
            <p className="flex items-center text-sm text-amber-400">
              Daily limit reached — resets at midnight UTC
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.length > 0 ? (
            predictions.map((pred, i) => (
              <div key={pred.id ?? i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-cyan-500/50 transition flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <StockLogo name={pred.symbol} symbol={pred.symbol} />
                      <h3 className="text-2xl font-bold">{pred.symbol}</h3>
                    </div>
                    <p className="text-sm text-zinc-500">Target: {pred.target}</p>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    pred.direction === 'bullish'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : pred.direction === 'bearish'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-zinc-500/10 text-zinc-400'
                  }`}>
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

                <p className="text-zinc-300 text-sm leading-relaxed mb-6 flex-1">
                  {pred.reason}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => void addToWatchlist(pred.symbol)}
                    className="flex-1 border border-zinc-700 hover:bg-zinc-800 py-3 rounded-lg text-sm"
                  >
                    Add to Watchlist
                  </button>
                  <button
                    onClick={() => { window.location.href = `/dashboard/portfolio?symbol=${pred.symbol}`; }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-sm font-semibold"
                  >
                    Simulate Buy
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-zinc-500">
              {isGenerating
                ? 'Generating AI predictions...'
                : 'Click "Generate New AI Predictions" to see smart signals'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
