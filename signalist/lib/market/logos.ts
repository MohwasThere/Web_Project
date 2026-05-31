const TRADINGVIEW_SLUGS: Record<string, string> = {
  AAPL: "apple",
  MSFT: "microsoft",
  GOOGL: "alphabet",
  GOOG: "alphabet",
  AMZN: "amazon",
  TSLA: "tesla",
  NVDA: "nvidia",
  META: "meta-platforms",
  AMD: "amd",
  NFLX: "netflix",
  AVGO: "broadcom",
  ORCL: "oracle",
  INTC: "intel",
  JPM: "jpmorgan-chase",
  V: "visa",
  MA: "mastercard",
  BAC: "bank-of-america",
  WMT: "walmart",
};

export const normalizeTicker = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) return "";

  const noExchangePrefix = trimmed.includes(":") ? trimmed.split(":").pop() ?? trimmed : trimmed;
  return noExchangePrefix.replace(/[^A-Z0-9.\-]/g, "");
};

export const getLogoCandidates = (symbol: string) => {
  const ticker = normalizeTicker(symbol);
  const slug = TRADINGVIEW_SLUGS[ticker];

  return [
    slug ? `https://s3-symbol-logo.tradingview.com/${slug}.svg` : undefined,
    `https://eodhd.com/img/logos/US/${ticker}.png`,
    `https://companiesmarketcap.com/img/company-logos/64/${ticker}.png`,
  ].filter((src): src is string => Boolean(src));
};
