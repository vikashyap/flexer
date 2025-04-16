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
  setEvmTokenMap: (map: TokenMap) => void;
  updateEvmToken: (key: string, token: Partial<Token>) => void;
  setEvmTopTokenMap: (map: TokenMap) => void;
  updateEvmTopToken: (key: string, token: Partial<Token>) => void;
  setEvmTotalUSD: (value: number) => void;
  setEvmChains: (chains: LifiChain[]) => void;

  setSolanaTokenMap: (map: TokenMap) => void;
  updateSolanaToken: (key: string, token: Partial<Token>) => void;
  setSolanaTopTokenMap: (map: TokenMap) => void;
  updateSolanaTopToken: (key: string, token: Partial<Token>) => void;
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
  setEvmChains: (chains) => set((state) => ({ evm: { ...state.evm, chains } })),
  setEvmTokenMap: (map) =>
    set((state) => ({ evm: { ...state.evm, tokenMap: map } })),
  updateEvmToken: (key, partial) =>
    set((state) => ({
      evm: {
        ...state.evm,
        tokenMap: {
          ...state.evm.tokenMap,
          [key]: {
            ...state.evm.tokenMap[key],
            ...partial,
          },
        },
      },
    })),
  setEvmTopTokenMap: (map) =>
    set((state) => ({ evm: { ...state.evm, topTokenMap: map } })),
  updateEvmTopToken: (key, partial) =>
    set((state) => ({
      evm: {
        ...state.evm,
        topTokenMap: {
          ...state.evm.topTokenMap,
          [key]: {
            ...state.evm.topTokenMap[key],
            ...partial,
          },
        },
      },
    })),
  setEvmTotalUSD: (value) =>
    set((state) => ({ evm: { ...state.evm, totalUSD: value } })),

  setSolanaTokenMap: (map) =>
    set((state) => ({ solana: { ...state.solana, tokenMap: map } })),
  updateSolanaToken: (key, partial) =>
    set((state) => ({
      solana: {
        ...state.solana,
        tokenMap: {
          ...state.solana.tokenMap,
          [key]: {
            ...state.solana.tokenMap[key],
            ...partial,
          },
        },
      },
    })),
  setSolanaTopTokenMap: (map) =>
    set((state) => ({ solana: { ...state.solana, topTokenMap: map } })),
  updateSolanaTopToken: (key, partial) =>
    set((state) => ({
      solana: {
        ...state.solana,
        topTokenMap: {
          ...state.solana.topTokenMap,
          [key]: {
            ...state.solana.topTokenMap[key],
            ...partial,
          },
        },
      },
    })),
  setSolanaTotalUSD: (value) =>
    set((state) => ({ solana: { ...state.solana, totalUSD: value } })),
}));
