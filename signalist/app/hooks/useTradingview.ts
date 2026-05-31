// hooks/useTradingView.ts
'use client';

import { useEffect, useRef } from "react";

const useTradingView = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height: number = 600
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = `<div class="tradingview-widget-container__widget" style="width:100%;height:${height}px;"></div>`;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.type = "text/javascript";
    
    script.innerHTML = JSON.stringify({
      ...config,
      colorTheme: "dark",
      locale: "en",
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [scriptUrl, JSON.stringify(config), height]); // Important: depend on config

  return containerRef;
};

export default useTradingView;