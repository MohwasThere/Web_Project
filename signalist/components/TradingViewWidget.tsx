'use client';

import { memo } from "react";
import useTradingView from "@/app/hooks/useTradingview";
import { cn } from "@/lib/utils";

interface TradingViewProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
  isTransparent?: boolean;
}

const TradingViewWidget = ({
  title,
  scriptUrl,
  config,
  height = 620,
  className,
  isTransparent = true,
}: TradingViewProps) => {
  const containerRef = useTradingView(scriptUrl, config, height);

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-zinc-800">
          <h3 className="font-semibold text-lg text-white">{title}</h3>
        </div>
      )}
      <div
        ref={containerRef}
        className={cn("tradingview-widget-container", className)}
        style={{ height }}
      />
    </div>
  );
};

export default memo(TradingViewWidget);