// app/dashboard/market/page.tsx
'use client';

import { useState, useEffect } from 'react';
import TradingViewWidget from "@/components/TradingViewWidget";
import { CANDLE_CHART_WIDGET_CONFIG } from "@/lib/constants";
import { getLogoCandidates, normalizeTicker } from '@/lib/market/logos';

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

export default function MarketPage() {
  const [symbol, setSymbol] = useState("NVDA");
  const [inputSymbol, setInputSymbol] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; exchange: string }>>([]);

  useEffect(() => {
    const query = inputSymbol.trim();
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
  }, [inputSymbol]);

  const handleLoadSymbol = () => {
    const upper = normalizeTicker(inputSymbol);
    if (upper) {
      setSymbol(upper);
      setInputSymbol(upper);
      setIsSearchFocused(false);
    }
  };

  const selectSuggestion = (stockSymbol: string) => {
    const normalized = normalizeTicker(stockSymbol);
    setInputSymbol(normalized);
    setSymbol(normalized);
    setIsSearchFocused(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-bold">Stock Market</h2>
            <p className="text-zinc-400">Search any stock symbol</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                value={inputSymbol}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setInputSymbol(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoadSymbol()}
                placeholder="Search symbol or company name"
                className="bg-zinc-900 border border-zinc-700 px-5 py-2.5 rounded-lg w-80 focus:outline-none focus:border-blue-500"
              />

              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden z-20 max-h-96 overflow-y-auto">
                  {searchResults.map((stock) => (
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
            <button
              onClick={handleLoadSymbol}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-medium"
            >
              Load Chart
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <StockLogo name={symbol} symbol={symbol} />
            <h3 className="text-3xl font-bold text-blue-400">{symbol}</h3>
          </div>
          <p className="text-zinc-500 mt-1">Advanced Chart • Real Time</p>
        </div>

        {/* Main Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <TradingViewWidget
            title=""
            scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            height={780}
          />
        </div>

        {/* Quick Select */}
        <div className="mt-8">
          <p className="text-zinc-400 mb-4">Quick Select</p>
          <div className="flex flex-wrap gap-3">
            {['NVDA', 'AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD', 'AVGO', 'NFLX'].map((s) => (
              <button
                key={s}
                onClick={() => setSymbol(s)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                  symbol === s 
                    ? 'bg-blue-600 text-white scale-105' 
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <StockLogo name={s} symbol={s} />
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
