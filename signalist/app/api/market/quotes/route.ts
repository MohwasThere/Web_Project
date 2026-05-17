import { NextResponse } from "next/server";
import { normalizeTicker } from "@/lib/market/logos";

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        regularMarketPrice?: number;
        previousClose?: number;
      };
    }>;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get("symbols") ?? "";

  const symbols = symbolsParam
    .split(",")
    .map((s) => normalizeTicker(s))
    .filter(Boolean);

  if (symbols.length === 0) {
    return NextResponse.json({ quotes: {} });
  }

  try {
    const quotePairs = await Promise.all(
      symbols.map(async (symbol) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          return null;
        }

        const payload = (await response.json()) as YahooChartResponse;
        const meta = payload.chart?.result?.[0]?.meta;
        if (!meta?.symbol || typeof meta.regularMarketPrice !== "number") {
          return null;
        }

        const previousClose = typeof meta.previousClose === "number" ? meta.previousClose : meta.regularMarketPrice;
        const changePercent = previousClose > 0
          ? ((meta.regularMarketPrice - previousClose) / previousClose) * 100
          : 0;

        return {
          symbol: normalizeTicker(meta.symbol),
          price: meta.regularMarketPrice,
          changePercent,
        };
      })
    );

    const quotes = quotePairs.reduce<Record<string, { price: number; changePercent: number }>>((acc, item) => {
      if (!item) return acc;

      acc[item.symbol] = {
        price: item.price,
        changePercent: item.changePercent,
      };
      return acc;
    }, {});

    return NextResponse.json({ quotes });
  } catch {
    return NextResponse.json({ quotes: {} }, { status: 502 });
  }
}
