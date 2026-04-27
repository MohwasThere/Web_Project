import Tradingview from "@/components/Tradingview";
import { Button } from "@/components/ui/button";
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants";
import Image from "next/image";

const Home=() =>{
  return (
          <div className="flex min-h-screen home-warpper">
             <section className="grid w-full gap-8 home-section">
              <div className="md:col-span-1 xl:col-span-1">
                <Tradingview
                  title='Market overview' scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
                  config={MARKET_OVERVIEW_WIDGET_CONFIG}
                  height={600}
                  className="custom-chart">
                </Tradingview>


              </div>
              <div className='md-col-span xl:-span-2'>

                <Tradingview
                  title='Stock Heatmap' scriptUrl='https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js'
                  config={HEATMAP_WIDGET_CONFIG}
                  height={600}
                  >
                </Tradingview>
              </div>
             </section>
             <section  className="grid w-full gap-8 home-section">
              <div className="h-full md:col-span-1 xl:col-span-1">
                <Tradingview
                  scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
                  config={TOP_STORIES_WIDGET_CONFIG}
                  height={600}
                  className="custom-chart">
                </Tradingview>


              </div>
              <div className='h-full md:col-span-1 xl:col-span-2'>

                <Tradingview
                  scriptUrl='https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js'
                  config={MARKET_DATA_WIDGET_CONFIG}
                  height={600}
                  >
                </Tradingview>
              </div>
             </section>
          </div>
  );
}
export default Home

