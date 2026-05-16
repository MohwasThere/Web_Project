
'use client';

import TradingViewWidget from "@/components/TradingViewWidget";
import {
  MARKET_OVERVIEW_WIDGET_CONFIG,
  HEATMAP_WIDGET_CONFIG,
} from "@/lib/constants";

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Welcome back, Mazen 👋</h1>
        <p className="text-zinc-400 mt-2">Here's what's happening in the market today</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Market Overview */}
        <div className="xl:col-span-7">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            height={520}
          />
        </div>

        {/* Heatmap */}
        <div className="xl:col-span-5">
          <TradingViewWidget
            title="Stock Heatmap"
            scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
            config={HEATMAP_WIDGET_CONFIG}
            height={520}
          />
        </div>
      </div>

      <div className="mt-8 text-center text-zinc-500 text-sm">
        Use the sidebar to navigate between Market, Watchlist, AI Predictions, Portfolio, etc.
      </div>
    </div>
  );
}