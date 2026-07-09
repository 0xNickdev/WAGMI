"use client";

import { create } from "zustand";

/* Mock wallet — stands in for wagmi/viem until contracts are wired.
   Simulates a connect flow so the whole UI is interactive end-to-end. */

interface WalletState {
  address: string | null;
  connecting: boolean;
  ethBalance: number;
  connect: (connector?: string) => Promise<void>;
  disconnect: () => void;
}

const DEMO_ADDR = "0x7A91cE4dBb09f2a3E5f8C1d0B2a4F6e8D3c9A0b1";

export const useWallet = create<WalletState>((set) => ({
  address: null,
  connecting: false,
  ethBalance: 12.48,
  connect: async () => {
    set({ connecting: true });
    await new Promise((r) => setTimeout(r, 700));
    set({ address: DEMO_ADDR, connecting: false });
  },
  disconnect: () => set({ address: null }),
}));
