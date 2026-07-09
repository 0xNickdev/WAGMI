import { GECKO_NETWORK } from "@/lib/chain";
import type { Token, Candle } from "@/lib/types";
import { PriceChart } from "./PriceChart";

/* GeckoTerminal embedded chart. Renders when the network slug is configured
   and the token has an indexed pool; otherwise falls back to the local chart. */
export function GeckoChart({ token, candles }: { token: Token; candles: Candle[] }) {
  if (GECKO_NETWORK && token.poolAddress) {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <iframe
          title={`${token.symbol} chart — GeckoTerminal`}
          src={`https://www.geckoterminal.com/${GECKO_NETWORK}/pools/${token.poolAddress}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
          className="w-full h-[420px] sm:h-[480px] border-0"
          allow="clipboard-write"
          allowFullScreen
        />
      </div>
    );
  }
  return <PriceChart candles={candles} symbol={token.symbol} />;
}
