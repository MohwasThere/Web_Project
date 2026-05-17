'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getLogoCandidates, normalizeTicker } from '@/lib/market/logos';

interface WatchlistItem {
  symbol: string;
  name: string;
  entryPrice: number;
  addedAt: string;
  currentPrice: number;
  changePercent: number;
}

function StockLogo({ name, symbol }: { name: string; symbol: string }) {
  const candidates = getLogoCandidates(symbol);
  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {
    setLogoIndex(0);
  }, [symbol]);

  const currentSrc = candidates[logoIndex];

  if (!currentSrc) {
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200">
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={`${name} logo`}
      onError={() => setLogoIndex((prev) => prev + 1)}
      className="w-9 h-9 rounded-full bg-zinc-900 ring-1 ring-zinc-700 p-1.5 object-contain"
    />
  );
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; exchange: string }>>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);

  const filteredSuggestions = searchResults;

  useEffect(() => {
    const query = newSymbol.trim();
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
  }, [newSymbol]);

  // Load from API
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const response = await fetch('/api/watchlist', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = (await response.json()) as {
          items: Array<{ symbol: string; name: string; entryPrice: number; addedAt?: string }>;
        };

        const items = (payload.items ?? []).map((item) => ({
          symbol: item.symbol,
          name: item.name,
          entryPrice: item.entryPrice ?? 0,
          addedAt: item.addedAt ?? new Date().toISOString(),
          currentPrice: 0,
          changePercent: 0,
        }));

        setWatchlist(items);
        if (items.length > 0) {
          await refreshQuotes(items);
        }
      } finally {
        setIsLoaded(true);
      }
    };

    void loadWatchlist();
  }, []);

  const persistWatchlist = async (next: WatchlistItem[], previous: WatchlistItem[]) => {
    setWatchlist(next);
    setSaveStatus('saving');

    const response = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: next.map((item) => ({
          symbol: item.symbol,
          name: item.name,
          entryPrice: item.entryPrice,
          addedAt: item.addedAt,
        })),
      }),
    });

    if (!response.ok) {
      setWatchlist(previous);
      setSaveStatus('error');
      toast.error('Could not save watchlist. Reverted changes.');
      return;
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const refreshQuotes = async (inputWatchlist: WatchlistItem[]) => {
    if (inputWatchlist.length === 0) return;

    const symbols = Array.from(new Set(inputWatchlist.map((item) => normalizeTicker(item.symbol))));
    setQuotesLoading(true);

    try {
      const response = await fetch(`/api/market/quotes?symbols=${encodeURIComponent(symbols.join(','))}`, {
        cache: 'no-store',
      });
      if (!response.ok) return;

      const payload = (await response.json()) as {
        quotes: Record<string, { price: number; changePercent: number }>;
      };

      setWatchlist((prev) =>
        prev.map((item) => {
          const quote = payload.quotes[normalizeTicker(item.symbol)];
          if (!quote) return item;

          return {
            ...item,
            currentPrice: Number(quote.price.toFixed(2)),
            changePercent: Number(quote.changePercent.toFixed(2)),
          };
        })
      );
    } finally {
      setQuotesLoading(false);
    }
  };

  // Refresh with real market quotes every 30s
  useEffect(() => {
    if (!isLoaded || watchlist.length === 0) return;

    void refreshQuotes(watchlist);
    const interval = setInterval(() => {
      void refreshQuotes(watchlist);
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoaded, watchlist.length]);

  const addToWatchlist = async () => {
    if (!newSymbol) return;

    const query = newSymbol.trim().toLowerCase();
    const matchedStock = searchResults.find(
      (s) => s.symbol.toLowerCase() === query || s.name.toLowerCase() === query
    );

    const symbolUpper = normalizeTicker(matchedStock?.symbol ?? newSymbol);

    // Prevent duplicate
    if (watchlist.some(item => item.symbol === symbolUpper)) {
      alert("Already in watchlist!");
      return;
    }

    const stockInfo = searchResults.find(s => s.symbol === symbolUpper) || {
      symbol: symbolUpper,
      name: `${symbolUpper} Inc.`,
    };

    const newItem: WatchlistItem = {
      symbol: stockInfo.symbol,
      name: stockInfo.name,
      entryPrice: 0,
      addedAt: new Date().toISOString(),
      currentPrice: 0,
      changePercent: 0,
    };

    const quoteResponse = await fetch(`/api/market/quotes?symbols=${encodeURIComponent(symbolUpper)}`, {
      cache: 'no-store',
    });
    const quotePayload = quoteResponse.ok
      ? ((await quoteResponse.json()) as { quotes: Record<string, { price: number; changePercent: number }> })
      : { quotes: {} };
    const latestQuote = quotePayload.quotes[normalizeTicker(symbolUpper)];

    const pricedItem: WatchlistItem = {
      ...newItem,
      entryPrice: latestQuote ? Number(latestQuote.price.toFixed(2)) : 0,
      currentPrice: latestQuote ? Number(latestQuote.price.toFixed(2)) : 0,
      changePercent: latestQuote ? Number(latestQuote.changePercent.toFixed(2)) : 0,
    };

    const previous = watchlist;
    const next = [...watchlist, pricedItem];
    void persistWatchlist(next, previous);
    void refreshQuotes(next);
    setNewSymbol('');
    setIsSearchFocused(false);
  };

  const selectSuggestion = (symbol: string) => {
    setNewSymbol(symbol);
    setIsSearchFocused(false);
  };

  const removeFromWatchlist = (symbol: string) => {
    const previous = watchlist;
    const next = watchlist.filter(item => item.symbol !== symbol);
    void persistWatchlist(next, previous);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">My Watchlist</h1>
        <p className="text-emerald-400 mb-8">● Live Market Prices {quotesLoading ? '(Refreshing...)' : '(Updates every 30 seconds)'}</p>
        <p className={`mb-4 text-sm ${saveStatus === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>
          {saveStatus === 'saving' && 'Saving watchlist...'}
          {saveStatus === 'saved' && 'Watchlist saved'}
          {saveStatus === 'error' && 'Save failed - reverted to previous data'}
          {saveStatus === 'idle' && isLoaded && 'Watchlist synced with your account'}
        </p>

        {/* Add Stock */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search by symbol or company name (e.g. NVDA, NVIDIA)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-5 py-3 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && void addToWatchlist()}
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
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => void addToWatchlist()}
            className="bg-blue-600 hover:bg-blue-500 px-10 rounded-lg font-semibold"
          >
            Add to Watchlist
          </button>
        </div>

        {/* Watchlist Items */}
        {watchlist.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
            <p className="text-2xl text-zinc-500">Your watchlist is empty</p>
            <p className="text-zinc-600 mt-2">Add stocks you want to monitor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((stock, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <StockLogo name={stock.name} symbol={stock.symbol} />
                      <h3 className="text-2xl font-bold">{stock.symbol}</h3>
                    </div>
                    <p className="text-zinc-500 text-sm mt-2">{stock.name}</p>
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(stock.symbol)}
                    className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mt-8">
                  <p className="text-4xl font-mono font-bold">
                    ${stock.currentPrice.toFixed(2)}
                  </p>
                  <p className={`flex items-center gap-1 text-lg mt-2 font-medium ${
                    stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {stock.changePercent >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    {stock.entryPrice > 0
                      ? `${(((stock.currentPrice - stock.entryPrice) / stock.entryPrice) * 100 >= 0 ? '+' : '')}${(((stock.currentPrice - stock.entryPrice) / stock.entryPrice) * 100).toFixed(2)}%`
                      : `${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                  </p>
                </div>

                <button
                  onClick={() => window.location.href = '/dashboard/portfolio'}
                  className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-sm font-semibold"
                >
                  Simulate Buy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
