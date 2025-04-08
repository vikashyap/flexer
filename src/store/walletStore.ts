import { create } from "zustand";

export interface Wallet {
  // Todo: Move to types.ts and include all wallet properties
  address: string;
  ecosystem: "evm" | "solana";
}

interface WalletState {
  evmWallet: Wallet | null;
  solanaWallet: Wallet | null;
  setEvmWallet: (wallet: Wallet | null) => void;
  setSolanaWallet: (wallet: Wallet | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  evmWallet: null,
  solanaWallet: null,
  setEvmWallet: (wallet) => set({ evmWallet: wallet }),
  setSolanaWallet: (wallet) => set({ solanaWallet: wallet }),
}));
