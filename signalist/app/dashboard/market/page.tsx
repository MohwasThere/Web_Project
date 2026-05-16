// app/dashboard/market/page.tsx
'use client';

import { useState } from 'react';
import TradingViewWidget from "@/components/TradingViewWidget";
import { CANDLE_CHART_WIDGET_CONFIG } from "@/lib/constants";

export default function MarketPage() {
  const [symbol, setSymbol] = useState("NVDA");
  const [inputSymbol, setInputSymbol] = useState("");

  const handleLoadSymbol = () => {
    const upper = inputSymbol.trim().toUpperCase();
    if (upper) {
      setSymbol(upper);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-semibold">Signalist</h1>
        </div>

      </nav>

      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-bold">Stock Market</h2>
            <p className="text-zinc-400">Search any stock symbol</p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoadSymbol()}
              placeholder="AAPL, TSLA, GOOGL..."
              className="bg-zinc-900 border border-zinc-700 px-6 py-3.5 rounded-2xl w-80 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleLoadSymbol}
              className="bg-blue-600 hover:bg-blue-500 px-8 py-3.5 rounded-2xl font-medium"
            >
              Load Chart
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-3xl font-bold text-blue-400">{symbol}</h3>
          <p className="text-zinc-500">Advanced Chart • Real Time</p>
        </div>

        {/* Main Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
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
                className={`px-6 py-3 rounded-2xl transition-all ${
                  symbol === s 
                    ? 'bg-blue-600 text-white scale-105' 
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}