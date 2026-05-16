'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
}

const POPULAR_STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState(10);
  const [buyPrice, setBuyPrice] = useState(150);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('signalist_portfolio');
    if (saved) setHoldings(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('signalist_portfolio', JSON.stringify(holdings));
  }, [holdings]);

  // 🔥 LIVE MARKET SIMULATION - Prices change every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHoldings(prev => 
        prev.map(holding => {
          // Simulate small random price movement (±0.8%)
          const volatility = (Math.random() - 0.5) * 1.6; 
          const newPrice = Math.max(1, parseFloat((holding.currentPrice * (1 + volatility / 100)).toFixed(2)));
          
          return { ...holding, currentPrice: newPrice };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const addHolding = () => {
    if (!symbol || shares <= 0 || buyPrice <= 0) return;

    const newHolding: Holding = {
      symbol: symbol.toUpperCase(),
      name: POPULAR_STOCKS.find(s => s.symbol === symbol.toUpperCase())?.name || `${symbol} Inc.`,
      shares,
      buyPrice,
      currentPrice: buyPrice,
    };

    setHoldings([...holdings, newHolding]);
    setSymbol('');
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
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
        <p className="text-emerald-400 mb-8">● Live Market Simulation (Prices updating every 3 seconds)</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">Total Invested</p>
            <p className="text-3xl font-bold mt-2">${totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400">Current Portfolio Value</p>
            <p className="text-3xl font-bold mt-2">${totalCurrent.toFixed(2)}</p>
          </div>
          <div className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-6 font-medium ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <p className="text-zinc-400">Total Profit / Loss</p>
            <p className="text-3xl mt-2">
              ${totalPL.toFixed(2)} ({totalPLPercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Buy Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Buy Stocks (Simulation)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="NVDA"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Shares</label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                min="1"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Buy Price ($)</label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addHolding}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-3.5 rounded-2xl font-semibold"
              >
                Buy Stock
              </button>
            </div>
          </div>
        </div>

        {/* Holdings Table with Live Prices */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
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
                        <div className="font-bold">{h.symbol}</div>
                        <div className="text-sm text-zinc-500">{h.name}</div>
                      </td>
                      <td className="text-right py-6">{h.shares}</td>
                      <td className="text-right py-6">${h.buyPrice.toFixed(2)}</td>
                      <td className="text-right py-6 font-mono">${h.currentPrice.toFixed(2)}</td>
                      <td className="text-right py-6 font-medium">${value.toFixed(2)}</td>
                      <td className={`text-right py-6 font-medium ${pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${pl.toFixed(2)} ({plPercent.toFixed(1)}%)
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