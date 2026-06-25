# WAGMII — Frontend

Premium frontend for **WAGMII** (wagmii.money), a permissionless revenue-share token
launchpad on BNB Smart Chain. Launch a BEP-20 in seconds, every trade funds a shared
treasury, and that treasury pays back to eligible holders each epoch.

Built from `WAGMII_Frontend_PRD.docx` + `Wagmii PRD TDD v1.docx`.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-variable design tokens)
- **framer-motion** (motion) · **recharts** (charts) · **lucide-react** (icons)
- **zustand** (mock wallet store) · serialized mock data layer (stands in for the indexer/REST API)

> Wallet + on-chain calls are mocked (`lib/wallet.ts`, `lib/mock.ts`) so the whole UI is
> interactive end-to-end with no backend. Swap these for `wagmi`/`viem` + the real API when
> contracts and the indexer are live.

## Routes

| Route | Page |
|-------|------|
| `/` | Landing — hero, platform stats, trending, the flywheel, treasury teaser |
| `/explore` | Discovery feed — trending/new/gainers, search, sort, filters, grid/list |
| `/token/[address]` | Token terminal — overview, price+volume chart, trade panel, reward dashboard, holders, activity |
| `/launch` | 5-step token creation wizard with live preview + simulated deploy |
| `/claim` | Holder distribution dashboard (connect -> claim) |
| `/treasury` | Treasury stats, asset breakdown, epoch distribution history |
| `/leaderboard` | Top tokens by volume / market cap / holders / rewards |

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Design language

Warm-black canvas, BNB-gold primary, mint/red market signals, frosted-glass surfaces,
soft glow, tabular mono numerics. Dark theme, mobile-first. Tokens + utility classes
(.glass, .text-gradient-gold, .glow-gold, .tabular, ...) live in app/globals.css.
