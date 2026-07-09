/* Robinhood Chain mainnet config (docs.robinhood.com/chain) —
   override via env to target testnet (chain 46630). */

export const CHAIN = {
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 4663),
  name: process.env.NEXT_PUBLIC_CHAIN_NAME ?? "Robinhood Chain",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.mainnet.chain.robinhood.com",
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://robinhoodchain.blockscout.com",
  currency: { name: "Ether", symbol: "ETH", decimals: 18 },
};

// GeckoTerminal network slug for chart embeds (e.g. "base", "arbitrum").
// Unset = no GeckoTerminal coverage yet, token pages fall back to the local chart.
export const GECKO_NETWORK = process.env.NEXT_PUBLIC_GECKO_NETWORK ?? "";

export const CHAIN_ID_HEX = `0x${CHAIN.id.toString(16)}`;

export function explorerAddressUrl(address: string) {
  return `${CHAIN.explorerUrl}/address/${address}`;
}
export function explorerTxUrl(hash: string) {
  return `${CHAIN.explorerUrl}/tx/${hash}`;
}
