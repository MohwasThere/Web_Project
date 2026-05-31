import { NextResponse } from "next/server";
import { normalizeTicker } from "@/lib/market/logos";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

type YahooChartMeta = {
  symbol?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
};

type YahooChartResponse = {
  chart?: {
    result?: Array<{ meta?: YahooChartMeta }>;
    error?: unknown;
  };
};

async function fetchQuote(
  symbol: string
): Promise<{ price: number; changePercent: number } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": UA,
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://finance.yahoo.com/",
      },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as YahooChartResponse;
    const meta = payload.chart?.result?.[0]?.meta;

    if (!meta?.regularMarketPrice) return null;

    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose ?? price;
    const changePercent =
      prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;

    return { price, changePercent };
  } catch {
    return null;
  }
}

// Convert Binance-style crypto pairs (BTCUSDT, ETHUSDT) to Yahoo Finance format (BTC-USD, ETH-USD)
function toYahooSymbol(raw: string): string {
  const s = normalizeTicker(raw);
  if (s.endsWith("USDT")) return s.slice(0, -4) + "-USD";
  if (s.endsWith("BUSD")) return s.slice(0, -4) + "-USD";
  return s;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get("symbols") ?? "";

  const rawSymbols = symbolsParam.split(",").map((s) => s.trim()).filter(Boolean);

  // Map each raw symbol to its Yahoo symbol, keeping original as the response key
  const symbolMap = rawSymbols.map((raw) => ({
    key: normalizeTicker(raw),
    yahoo: toYahooSymbol(raw),
  })).filter((e) => e.key);

  if (symbolMap.length === 0) {
    return NextResponse.json({ quotes: {} });
  }

  const results = await Promise.all(
    symbolMap.map(async ({ key, yahoo }) => {
      const quote = await fetchQuote(yahoo);
      return { key, quote };
    })
  );

  const quotes = results.reduce<
    Record<string, { price: number; changePercent: number }>
  >((acc, { key, quote }) => {
    if (quote) acc[key] = quote;
    return acc;
  }, {});

  return NextResponse.json({ quotes });
}
