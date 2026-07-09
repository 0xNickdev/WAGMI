"use client";

import { create } from "zustand";
import { CHAIN, CHAIN_ID_HEX } from "./chain";

/* Real injected-wallet connection (MetaMask, Rabby, Coinbase Wallet, …)
   via EIP-1193. No mock: address and ETH balance come from the wallet. */

interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, cb: (...args: never[]) => void) => void;
  removeListener?: (event: string, cb: (...args: never[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

interface WalletState {
  address: string | null;
  connecting: boolean;
  ethBalance: number;
  chainId: number | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

function getProvider(): Eip1193Provider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

async function fetchBalance(provider: Eip1193Provider, address: string): Promise<number> {
  const wei = (await provider.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  })) as string;
  return Number(BigInt(wei)) / 1e18;
}

// True when the wallet reports it doesn't know the chain. MetaMask surfaces
// this as code 4902, but mobile/other wallets nest it or only say so in the
// message ("Unrecognized chain ID …"), so check all three shapes.
function isUnrecognizedChain(err: unknown): boolean {
  const e = err as {
    code?: number;
    message?: string;
    data?: { originalError?: { code?: number } };
  };
  return (
    e.code === 4902 ||
    e.data?.originalError?.code === 4902 ||
    /unrecognized chain/i.test(e.message ?? "")
  );
}

/* Best-effort: switch to Robinhood Chain, adding it to the wallet if needed.
   Never throws — with placeholder RPC params the add can legitimately fail,
   and the UI handles that via the wrong-network indicator instead. */
async function ensureChain(provider: Eip1193Provider) {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID_HEX }],
    });
  } catch (err) {
    if (!isUnrecognizedChain(err)) return;
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN_ID_HEX,
            chainName: CHAIN.name,
            rpcUrls: [CHAIN.rpcUrl],
            blockExplorerUrls: [CHAIN.explorerUrl],
            nativeCurrency: CHAIN.currency,
          },
        ],
      });
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch {
      /* wallet stays on its current chain; ConnectButton shows the switch prompt */
    }
  }
}

let listenersBound = false;

export const useWallet = create<WalletState>((set, get) => ({
  address: null,
  connecting: false,
  ethBalance: 0,
  chainId: null,
  error: null,

  connect: async () => {
    const provider = getProvider();
    if (!provider) {
      set({ error: "No wallet found. Install MetaMask or another browser wallet." });
      window.open("https://metamask.io/download/", "_blank", "noopener");
      return;
    }
    set({ connecting: true, error: null });
    try {
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      const address = accounts[0] ?? null;
      if (!address) throw new Error("No account returned");

      await ensureChain(provider);
      const chainId = Number(
        (await provider.request({ method: "eth_chainId" })) as string,
      );
      const ethBalance = await fetchBalance(provider, address);
      set({ address, chainId, ethBalance, connecting: false });

      if (!listenersBound && provider.on) {
        listenersBound = true;
        provider.on("accountsChanged", ((accs: string[]) => {
          if (!accs.length) get().disconnect();
          else {
            set({ address: accs[0] });
            get().refreshBalance();
          }
        }) as never);
        provider.on("chainChanged", ((id: string) => {
          set({ chainId: Number(id) });
          get().refreshBalance();
        }) as never);
      }
    } catch (err) {
      set({
        connecting: false,
        error: (err as Error).message || "Connection rejected",
      });
    }
  },

  disconnect: () => set({ address: null, ethBalance: 0, chainId: null }),

  refreshBalance: async () => {
    const provider = getProvider();
    const { address } = get();
    if (!provider || !address) return;
    try {
      set({ ethBalance: await fetchBalance(provider, address) });
    } catch {
      /* keep last known balance */
    }
  },
}));
