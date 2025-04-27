import { MOCK_CHAINS, MOCK_SOLANA_TOKEN_MAP } from "@/mock";
import { usePortfolioStore } from "@/store/portfolioStore";
import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("usePortfolioStore", () => {
  beforeEach(() => {
    act(() => {
      usePortfolioStore.setState({
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
      });
    });
  });

  it("should update isPortfolioLoading", () => {
    act(() => {
      usePortfolioStore.getState().setIsPortfolioLoading(true);
    });

    expect(usePortfolioStore.getState().isPortfolioLoading).toBe(true);
  });

  it("should set EVM token map", () => {
    act(() => {
      usePortfolioStore.getState().setEvmTokenMap(MOCK_SOLANA_TOKEN_MAP);
    });

    expect(usePortfolioStore.getState().evm.tokenMap).toEqual(
      MOCK_SOLANA_TOKEN_MAP
    );
  });

  it("should set EVM top token map", () => {
    act(() => {
      usePortfolioStore.getState().setEvmTopTokenMap(MOCK_SOLANA_TOKEN_MAP);
    });

    expect(usePortfolioStore.getState().evm.topTokenMap).toEqual(
      MOCK_SOLANA_TOKEN_MAP
    );
  });

  it("should set EVM total USD", () => {
    act(() => {
      usePortfolioStore.getState().setEvmTotalUSD(1234);
    });

    expect(usePortfolioStore.getState().evm.totalUSD).toBe(1234);
  });

  it("should set EVM chains", () => {
    act(() => {
      usePortfolioStore.getState().setEvmChains(MOCK_CHAINS);
    });

    expect(usePortfolioStore.getState().evm.chains).toEqual(MOCK_CHAINS);
  });

  it("should set Solana token map", () => {
    act(() => {
      usePortfolioStore.getState().setSolanaTokenMap(MOCK_SOLANA_TOKEN_MAP);
    });

    expect(usePortfolioStore.getState().solana.tokenMap).toEqual(
      MOCK_SOLANA_TOKEN_MAP
    );
  });

  it("should set Solana top token map", () => {
    act(() => {
      usePortfolioStore.getState().setSolanaTopTokenMap(MOCK_SOLANA_TOKEN_MAP);
    });

    expect(usePortfolioStore.getState().solana.topTokenMap).toEqual(
      MOCK_SOLANA_TOKEN_MAP
    );
  });

  it("should set Solana total USD", () => {
    act(() => {
      usePortfolioStore.getState().setSolanaTotalUSD(789);
    });

    expect(usePortfolioStore.getState().solana.totalUSD).toBe(789);
  });
});
