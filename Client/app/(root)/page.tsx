import Tradingview from "@/components/Tradingview";
import { Button } from "@/components/ui/button";
import { MARKET_OVERVIEW_WIDGET_CONFIG } from "@/lib/constants";
import Image from "next/image";

export default function Home() {
  return (
          <div className="flex min-h-screen home-warpper">
             <section className="grid w-full gap-8 home-section">
              <div className="md:col-span-1 xl:col-span-1">
                <Tradingview
                  title='Market overview' scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                  config={MARKET_OVERVIEW_WIDGET_CONFIG}
                  className="custom-chart">
                </Tradingview>


              </div>

             </section>
          </div>
  );
}
