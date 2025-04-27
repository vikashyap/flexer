import { useEvmPortfolioSync } from "@/hooks/useEvmPortfolioSync";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as syncEvmService from "@/services/syncEvmBalance";
import * as portfolioStore from "@/store/portfolioStore";
import * as walletConnectionStore from "@/store/walletConnectionStore";

describe("useEvmPortfolioSync", () => {
  const setEvmTopTokenMap = vi.fn();
  const setEvmTotalUSD = vi.fn();
  const setIsPortfolioLoading = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should reset portfolio if not connected", async () => {
    // mock walletConnectionStore
    vi.spyOn(
      walletConnectionStore,
      "useWalletConnectionStore"
    ).mockImplementation((selector) =>
      selector({
        isSolanaConnected: false,
        solanaPublicKey: null,
        isEvmConnected: false,
        evmAddress: null,
        isWalletConnected: false,
        connectedWalletCount: 0,
        setSolanaConnection: vi.fn(),
        setEvmConnection: vi.fn(),
      })
    );

    // mock portfolioStore
    vi.spyOn(portfolioStore, "usePortfolioStore").mockImplementation(
      (selector) =>
        selector({
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
          setIsPortfolioLoading,
          setEvmTokenMap: vi.fn(),
          setEvmTopTokenMap,
          setEvmTotalUSD,
          setEvmChains: vi.fn(),
          setSolanaTokenMap: vi.fn(),
          setSolanaTopTokenMap: vi.fn(),
          setSolanaTotalUSD: vi.fn(),
        })
    );

    renderHook(() => useEvmPortfolioSync());

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let useEffect run

    expect(setEvmTotalUSD).toHaveBeenCalledWith(0);
    expect(setEvmTopTokenMap).toHaveBeenCalledWith({});
  });

  it("should call syncEvmBalance if connected", async () => {
    const mockSync = vi
      .spyOn(syncEvmService, "syncEvmBalance")
      .mockResolvedValue(undefined);

    vi.spyOn(
      walletConnectionStore,
      "useWalletConnectionStore"
    ).mockImplementation((selector) =>
      selector({
        isSolanaConnected: false,
        solanaPublicKey: null,
        isEvmConnected: true,
        evmAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        isWalletConnected: true,
        connectedWalletCount: 1,
        setSolanaConnection: vi.fn(),
        setEvmConnection: vi.fn(),
      })
    );

    vi.spyOn(portfolioStore, "usePortfolioStore").mockImplementation(
      (selector) =>
        selector({
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
          setIsPortfolioLoading,
          setEvmTokenMap: vi.fn(),
          setEvmTopTokenMap,
          setEvmTotalUSD,
          setEvmChains: vi.fn(),
          setSolanaTokenMap: vi.fn(),
          setSolanaTopTokenMap: vi.fn(),
          setSolanaTotalUSD: vi.fn(),
        })
    );

    renderHook(() => useEvmPortfolioSync());

    await new Promise((resolve) => setTimeout(resolve, 0)); // Let useEffect run

    expect(setIsPortfolioLoading).toHaveBeenCalledWith(true);
    expect(mockSync).toHaveBeenCalledWith({
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      tokenMap: {},
      chains: [],
      setEvmTopTokenMap,
      setEvmTotalUSD,
    });
    expect(setIsPortfolioLoading).toHaveBeenCalledWith(false);
  });
});
