"use client";
import { useEffect, useRef } from "react";

const useTradingView = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent double-mounting in StrictMode / HMR
    if (container.dataset.loaded) return;

    // BUG FIX 1: was a plain string literal, not a template literal —
    // height was never interpolated, and `classNmae` typo meant no styling
    container.innerHTML = `<div class="tradingview-widget-container__widget" style="width:100%;height:${height}px;"></div>`;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    // BUG FIX 2: script.innerHTML sets the JSON config that TradingView reads
    script.innerHTML = JSON.stringify(config);

    container.appendChild(script);
    container.dataset.loaded = "true";

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        delete containerRef.current.dataset.loaded;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptUrl, height]);
  // NOTE: `config` is intentionally excluded from the dep array.
  // The config objects are defined as module-level constants so they are
  // stable, but because they are object literals their reference changes on
  // every render — including config would cause an infinite remount loop.

  return containerRef;
};

export default useTradingView;
