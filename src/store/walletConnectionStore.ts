import { PublicKey } from "@solana/web3.js";
import { Address } from "viem";
import { create } from "zustand";

type WalletConnectionStore = {
  isSolanaConnected: boolean;
  solanaPublicKey: PublicKey | null;
  isEvmConnected: boolean;
  evmAddress: Address | null;
  isWalletConnected: boolean;
  connectedWalletCount: number;
  setSolanaConnection: (
    connected: boolean,
    publicKey: PublicKey | null
  ) => void;
  setEvmConnection: (connected: boolean, address: Address | null) => void;
};

export const useWalletConnectionStore = create<WalletConnectionStore>(
  (set) => ({
    isSolanaConnected: false,
    solanaPublicKey: null,
    isEvmConnected: false,
    evmAddress: null,
    isWalletConnected: false,
    connectedWalletCount: 0,

    setSolanaConnection: (connected, publicKey) =>
      set((state) => {
        const nextIsSolanaConnected = connected;
        const nextIsEvmConnected = state.isEvmConnected;
        return {
          isSolanaConnected: nextIsSolanaConnected,
          solanaPublicKey: publicKey,
          isWalletConnected: nextIsSolanaConnected || nextIsEvmConnected,
          connectedWalletCount:
            (nextIsSolanaConnected ? 1 : 0) + (nextIsEvmConnected ? 1 : 0),
        };
      }),

    setEvmConnection: (connected, address) =>
      set((state) => {
        const nextIsSolanaConnected = state.isSolanaConnected;
        const nextIsEvmConnected = connected;
        return {
          isEvmConnected: nextIsEvmConnected,
          evmAddress: address,
          isWalletConnected: nextIsSolanaConnected || nextIsEvmConnected,
          connectedWalletCount:
            (nextIsSolanaConnected ? 1 : 0) + (nextIsEvmConnected ? 1 : 0),
        };
      }),
  })
);
