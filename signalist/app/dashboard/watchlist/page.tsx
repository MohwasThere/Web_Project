'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface WatchlistItem {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
}

const POPULAR_STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [newSymbol, setNewSymbol] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('signalist_watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('signalist_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Live Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist(prev =>
        prev.map(item => {
          const volatility = (Math.random() - 0.5) * 2.5; // ±2.5%
          const newPrice = Math.max(10, parseFloat((item.currentPrice * (1 + volatility / 100)).toFixed(2)));
          const changePercent = ((newPrice - item.currentPrice) / item.currentPrice) * 100;

          return {
            ...item,
            currentPrice: newPrice,
            changePercent: parseFloat(changePercent.toFixed(2))
          };
        })
      );
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const addToWatchlist = () => {
    if (!newSymbol) return;

    const symbolUpper = newSymbol.toUpperCase();

    // Prevent duplicate
    if (watchlist.some(item => item.symbol === symbolUpper)) {
      alert("Already in watchlist!");
      return;
    }

    const stockInfo = POPULAR_STOCKS.find(s => s.symbol === symbolUpper) || {
      symbol: symbolUpper,
      name: `${symbolUpper} Inc.`
    };

    const newItem: WatchlistItem = {
      symbol: stockInfo.symbol,
      name: stockInfo.name,
      currentPrice: Math.floor(Math.random() * 300) + 50,
      changePercent: (Math.random() - 0.5) * 5,
    };

    setWatchlist([...watchlist, newItem]);
    setNewSymbol('');
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">My Watchlist</h1>
        <p className="text-emerald-400 mb-8">● Live Prices • Updates every 4 seconds</p>

        {/* Add Stock */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 flex gap-4">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol (e.g. NVDA)"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
          />
          <button
            onClick={addToWatchlist}
            className="bg-blue-600 hover:bg-blue-500 px-10 rounded-2xl font-semibold"
          >
            Add to Watchlist
          </button>
        </div>

        {/* Watchlist Items */}
        {watchlist.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-3xl">
            <p className="text-2xl text-zinc-500">Your watchlist is empty</p>
            <p className="text-zinc-600 mt-2">Add stocks you want to monitor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((stock, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-600 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{stock.symbol}</h3>
                    <p className="text-zinc-500 text-sm">{stock.name}</p>
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
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                  </p>
                </div>

                <button
                  onClick={() => window.location.href = '/dashboard/portfolio'}
                  className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-2xl text-sm font-semibold"
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