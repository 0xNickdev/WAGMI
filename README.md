# GreenMoon — Frontend

Frontend for **GreenMoon**, a simple ERC20 launchpad on **Robinhood Chain**.
Launch a token in under a minute: fixed 1B supply, no presales, no bonding
curves — every token launches straight onto Uniswap V3 and trades immediately.

Built from `GreenMoon_Launchpad_V1_Requirements.docx`.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-variable design tokens)
- **framer-motion** (motion) · **recharts** (fallback charts) · **lucide-react** (icons)
- **zustand** (wallet store) · injected EIP-1193 wallet (MetaMask, Rabby, Coinbase Wallet, …)

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Hero, price ticker, Trending / New Launches / Recently Launched |
| `/explore` | Full token list with search, sort, filters |
| `/launch` | 3-step launch wizard (Basic Info → Taxes → Review & Launch) |
| `/token/[address]` | Token page: chart, trade panel, holders, activity |
| `/creator/[address]` | Creator profile: tokens created, volume, LP fees earned |

## Configuration

Copy `.env.example` to `.env.local` and fill in:

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CHAIN_ID` / `NEXT_PUBLIC_RPC_URL` / `NEXT_PUBLIC_EXPLORER_URL` | Robinhood Chain params (placeholders until public values are announced) |
| `NEXT_PUBLIC_GECKO_NETWORK` | GeckoTerminal network slug — enables embedded pool charts on token pages |
| `NEXT_PUBLIC_API_URL` | GreenMoon indexer/REST API |

## Going live checklist

Real today:

- ✅ Wallet connect (`lib/wallet.ts`) — injected EIP-1193: real account, real ETH
  balance, auto add/switch to Robinhood Chain, account/chain-change listeners
- ✅ Explorer links route through `lib/chain.ts`
- ✅ Token charts (`components/token/GeckoChart.tsx`) — GeckoTerminal embed when
  `NEXT_PUBLIC_GECKO_NETWORK` is set and the token has `poolAddress`; local
  candle chart fallback otherwise

Still demo (waiting on contracts + indexer):

- ⏳ Token/market data comes from `lib/mock.ts` while `NEXT_PUBLIC_API_URL` is
  unset — the footer shows a **Demo data** badge in this mode. Replace the
  `lib/mock.ts` getters with API fetchers once the indexer ships (same
  signatures, swap the implementation).
- ⏳ Trading (`components/token/TradePanel.tsx`) and the launch wizard deploy
  step simulate transactions — wire to the launch/router contracts.

## Dev

```bash
npm install
npm run dev
```
