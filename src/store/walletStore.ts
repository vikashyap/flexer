import type { GetAccountReturnType as EvmWalletAccount } from "@wagmi/core";
import { create } from "zustand";

export interface Wallet {
  address: string;
  ecosystem: "evm" | "solana";
  isConnected: boolean;
  isConnecting: boolean;
}

interface WalletState {
  evmWalletAccount: EvmWalletAccount | null;
  solanaWallet: Wallet | null;
  connectedWalletCount: number;
  setEvmWalletAccount: (wallet: EvmWalletAccount | null) => void;
  setSolanaWallet: (wallet: Wallet | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  evmWalletAccount: null,
  solanaWallet: null,
  connectedWalletCount: 0,
  setEvmWalletAccount: (wallet) => {
    set({ evmWalletAccount: wallet });
  },

  setSolanaWallet: (wallet) => {
    set({ solanaWallet: wallet });
  },
}));
