'use client';

import TradingViewWidget from "@/components/TradingViewWidget";
import { TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants";

export default function NewsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Market News</h1>
        <p className="text-zinc-400">Latest financial news and market updates</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <TradingViewWidget
          title="Latest Market News & Top Stories"
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
          config={TOP_STORIES_WIDGET_CONFIG}
          height={720}
        />
      </div>

      <div className="mt-6 text-center text-zinc-500 text-sm">
        Real-time news powered by TradingView
      </div>
    </div>
  );
}