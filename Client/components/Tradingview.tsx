"use client";
import useTradingView from "@/hooks/usetradingview";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface TradingViewProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

const TradingViewWidget = ({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewProps) => {
  const container = useTradingView(scriptUrl, config, height);

  return (
    <div className="w-full">
      {title && (
        <h3 className="font-semibold text-lg text-gray-200 mb-3 tracking-tight">
          {title}
        </h3>
      )}

      <div
        className={cn("tradingview-widget-container", className)}
        ref={container}
        style={{ height }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: "100%" }}
        />
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
