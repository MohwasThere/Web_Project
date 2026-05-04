import Tradingview from "@/components/Tradingview";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from "@/lib/constants";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col gap-6">
      {/* Row 1: Market overview + Stock heatmap */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Tradingview
          title="Market Overview"
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
          config={MARKET_OVERVIEW_WIDGET_CONFIG}
          height={600}
          className="custom-chart"
        />
        <Tradingview
          title="Stock Heatmap"
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
          config={HEATMAP_WIDGET_CONFIG}
          height={600}
        />
      </section>

      {/* Row 2: Top stories + Market data */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Tradingview
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
          config={TOP_STORIES_WIDGET_CONFIG}
          height={600}
          className="custom-chart"
        />
        <Tradingview
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
          config={MARKET_DATA_WIDGET_CONFIG}
          height={600}
        />
      </section>
    </div>
  );
};

export default Home;


