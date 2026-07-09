/* Robinhood Chain network config — defaults to the public testnet
   (docs.robinhood.com/chain), override via env for mainnet. */

export const CHAIN = {
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 46630),
  name: process.env.NEXT_PUBLIC_CHAIN_NAME ?? "Robinhood Chain Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.testnet.chain.robinhood.com/rpc",
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://explorer.testnet.chain.robinhood.com",
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
