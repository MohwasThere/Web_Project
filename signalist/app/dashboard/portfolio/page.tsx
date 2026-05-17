'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getLogoCandidates, normalizeTicker } from '@/lib/market/logos';

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  changePercent?: number;
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
      <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200">
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={currentLogo}
      alt={`${name} logo`}
      onError={() => setLogoIndex((prev) => prev + 1)}
      className="w-9 h-9 rounded-full bg-zinc-900 ring-1 ring-zinc-700 p-1.5 object-contain"
    />
  );
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [symbol, setSymbol] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [shares, setShares] = useState(10);
  const [buyPrice, setBuyPrice] = useState(150);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; exchange: string }>>([]);

  const filteredSuggestions = searchResults;

  useEffect(() => {
    const query = symbol.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const response = await fetch(`/api/market/search?query=${encodeURIComponent(query)}`, { cache: 'no-store' });
      if (!response.ok) return;

      const payload = (await response.json()) as {
        results: Array<{ symbol: string; name: string; exchange: string }>;
      };
      setSearchResults(payload.results ?? []);
    }, 250);

    return () => clearTimeout(timeout);
  }, [symbol]);

  // Load from API
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio', { cache: 'no-store' });
        if (!response.ok) return;

        const payload = (await response.json()) as { holdings: Holding[] };
        setHoldings(payload.holdings ?? []);
      } finally {
        setIsLoaded(true);
      }
    };

    void loadPortfolio();
  }, []);

  const persistPortfolio = async (next: Holding[], previous: Holding[]) => {
    setHoldings(next);
    setSaveStatus('saving');

    const response = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ holdings: next }),
    });

    if (!response.ok) {
      setHoldings(previous);
      setSaveStatus('error');
      toast.error('Could not save portfolio. Reverted changes.');
      return;
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const refreshQuotes = async (inputHoldings: Holding[]) => {
    if (inputHoldings.length === 0) return;

    const symbols = Array.from(new Set(inputHoldings.map((h) => normalizeTicker(h.symbol))));
    setQuotesLoading(true);

    try {
      const response = await fetch(`/api/market/quotes?symbols=${encodeURIComponent(symbols.join(','))}`, {
        cache: 'no-store',
      });
      if (!response.ok) return;

      const payload = (await response.json()) as {
        quotes: Record<string, { price: number; changePercent: number }>;
      };

      const next = inputHoldings.map((holding) => {
        const quote = payload.quotes[normalizeTicker(holding.symbol)];
        if (!quote) return holding;

        return {
          ...holding,
          currentPrice: Number(quote.price.toFixed(2)),
          changePercent: Number(quote.changePercent.toFixed(2)),
        };
      });

      setHoldings(next);
    } finally {
      setQuotesLoading(false);
    }
  };

  // Refresh with market quotes every 30s
  useEffect(() => {
    if (!isLoaded) return;

    void refreshQuotes(holdings);
    const interval = setInterval(() => {
      void refreshQuotes(holdings);
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoaded, holdings.length]);

  const addHolding = () => {
    if (!symbol || shares <= 0 || buyPrice <= 0) return;

    const normalizedSymbol = normalizeTicker(symbol);
    const selectedStock = searchResults.find(s => s.symbol === normalizedSymbol);

    const newHolding: Holding = {
      symbol: normalizedSymbol,
      name: selectedStock?.name || `${normalizedSymbol} Inc.`,
      shares,
      buyPrice,
      currentPrice: buyPrice,
    };

    const previous = holdings;
    const next = [...holdings, newHolding];
    void persistPortfolio(next, previous);
    void refreshQuotes(next);
    setSymbol('');
    setIsSearchFocused(false);
  };

  const selectSuggestion = (stockSymbol: string) => {
    setSymbol(stockSymbol);
    setIsSearchFocused(false);
  };

  const removeHolding = (index: number) => {
    const previous = holdings;
    const next = holdings.filter((_, i) => i !== index);
    void persistPortfolio(next, previous);
  };

  // Calculations
  const totalInvested = holdings.reduce((sum, h) => sum + h.shares * h.buyPrice, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalPL = totalCurrent - totalInvested;
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Portfolio Simulator</h1>
        <p className="text-emerald-400 mb-8">● Live Market Prices {quotesLoading ? '(Refreshing...)' : '(Updates every 30 seconds)'}</p>
        <p className={`mb-4 text-sm ${saveStatus === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>
          {saveStatus === 'saving' && 'Saving portfolio...'}
          {saveStatus === 'saved' && 'Portfolio saved'}
          {saveStatus === 'error' && 'Save failed - reverted to previous data'}
          {saveStatus === 'idle' && isLoaded && 'Portfolio synced with your account'}
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400">Total Invested</p>
            <p className="text-3xl font-bold mt-2">${totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400">Current Portfolio Value</p>
            <p className="text-3xl font-bold mt-2">${totalCurrent.toFixed(2)}</p>
          </div>
          <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-medium ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <p className="text-zinc-400">Total Profit / Loss</p>
            <p className="text-3xl mt-2">
              ${totalPL.toFixed(2)} ({totalPLPercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Buy Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Buy Stocks (Simulation)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Symbol</label>
              <div className="relative">
                <input
                  type="text"
                  value={symbol}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Search symbol or company name"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-5 py-3"
                />

                {isSearchFocused && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden z-20">
                    {filteredSuggestions.map((stock) => (
                      <button
                        key={stock.symbol}
                        type="button"
                        onMouseDown={() => selectSuggestion(stock.symbol)}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition flex items-center gap-3"
                      >
                        <StockLogo name={stock.name} symbol={stock.symbol} />
                        <div>
                          <p className="font-semibold">{stock.symbol}</p>
                          <p className="text-sm text-zinc-400">{stock.name}</p>
                          <p className="text-xs text-zinc-500">{stock.exchange}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Shares</label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                min="1"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-5 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Buy Price ($)</label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-5 py-3"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addHolding}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-3.5 rounded-lg font-semibold"
              >
                Buy Stock
              </button>
            </div>
          </div>
        </div>

        {/* Holdings Table with Live Prices */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Your Holdings (Live)</h2>

          {holdings.length === 0 ? (
            <p className="text-center py-16 text-zinc-500">No stocks yet. Buy some above to see live price movement!</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700 text-zinc-400">
                  <th className="text-left py-4">Stock</th>
                  <th className="text-right py-4">Shares</th>
                  <th className="text-right py-4">Avg Buy</th>
                  <th className="text-right py-4">Live Price</th>
                  <th className="text-right py-4">Market Value</th>
                  <th className="text-right py-4">P/L</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, i) => {
                  const value = h.shares * h.currentPrice;
                  const pl = value - (h.shares * h.buyPrice);
                  const plPercent = ((h.currentPrice - h.buyPrice) / h.buyPrice) * 100;

                  return (
                    <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                          <StockLogo name={h.name} symbol={h.symbol} />
                          <div>
                            <div className="font-bold">{h.symbol}</div>
                            <div className="text-sm text-zinc-500">{h.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-6">{h.shares}</td>
                      <td className="text-right py-6">${h.buyPrice.toFixed(2)}</td>
                      <td className="text-right py-6 font-mono">${h.currentPrice.toFixed(2)}</td>
                      <td className="text-right py-6 font-medium">${value.toFixed(2)}</td>
                      <td className={`text-right py-6 font-medium ${pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${pl.toFixed(2)} ({plPercent.toFixed(2)}%)
                      </td>
                      <td>
                        <button onClick={() => removeHolding(i)} className="text-red-500 hover:text-red-400">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
