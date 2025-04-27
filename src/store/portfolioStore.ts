import type { LifiChain, Token } from "@/types";
import { create } from "zustand";

export type TokenMap = Record<string, Token>;

interface PortfolioState {
  evm: {
    tokenMap: TokenMap;
    topTokenMap: TokenMap;
    totalUSD: number;
    chains: LifiChain[];
  };
  solana: {
    tokenMap: TokenMap;
    topTokenMap: TokenMap;
    totalUSD: number;
  };
  isPortfolioLoading: boolean;
  setIsPortfolioLoading: (isLoading: boolean) => void;
  setEvmTokenMap: (map: TokenMap) => void;
  setEvmTopTokenMap: (map: TokenMap) => void;
  setEvmTotalUSD: (value: number) => void;
  setEvmChains: (chains: LifiChain[]) => void;
  setSolanaTokenMap: (map: TokenMap) => void;
  setSolanaTopTokenMap: (map: TokenMap) => void;
  setSolanaTotalUSD: (value: number) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  evm: {
    tokenMap: {},
    topTokenMap: {},
    totalUSD: 0,
    chains: [],
  },
  solana: {
    tokenMap: {},
    topTokenMap: {},
    totalUSD: 0,
  },
  isPortfolioLoading: false,
  setIsPortfolioLoading: (isLoading) => set({ isPortfolioLoading: isLoading }),
  setEvmChains: (chains) => set((state) => ({ evm: { ...state.evm, chains } })),
  setEvmTokenMap: (map) =>
    set((state) => ({ evm: { ...state.evm, tokenMap: map } })),

  setEvmTopTokenMap: (map) =>
    set((state) => ({ evm: { ...state.evm, topTokenMap: map } })),

  setEvmTotalUSD: (value) =>
    set((state) => ({
      evm: {
        ...state.evm,
        totalUSD: value,
        chains: state.evm.chains,
        tokenMap: state.evm.tokenMap,
        topTokenMap: state.evm.topTokenMap,
      },
    })),

  setSolanaTokenMap: (map) =>
    set((state) => ({ solana: { ...state.solana, tokenMap: map } })),

  setSolanaTopTokenMap: (map) =>
    set((state) => ({ solana: { ...state.solana, topTokenMap: map } })),

  setSolanaTotalUSD: (value) =>
    set((state) => ({ solana: { ...state.solana, totalUSD: value } })),
}));
