import { NextResponse } from "next/server";

type YahooSearchQuote = {
  symbol?: string;
  shortname?: string;
  longname?: string;
  exchDisp?: string;
  quoteType?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") ?? "").trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=25&newsCount=0`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({ results: [] }, { status: 502 });
    }

    const payload = (await response.json()) as { quotes?: YahooSearchQuote[] };
    const quotes = payload.quotes ?? [];

    const results = quotes
      .filter((quote) => quote.symbol && quote.quoteType === "EQUITY")
      .map((quote) => ({
        symbol: quote.symbol as string,
        name: quote.longname || quote.shortname || (quote.symbol as string),
        exchange: quote.exchDisp ?? "",
      }))
      .slice(0, 20);

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
