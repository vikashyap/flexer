import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { usePreloadLifiData } from "@/hooks/usePreloadLifiData";
import * as portfolioStore from "@/store/portfolioStore";

interface MockWorkerInstance {
  postMessage: Mock;
  terminate: Mock;
  onmessage: (event: MessageEvent<unknown>) => void;
}

let latestWorkerInstance: MockWorkerInstance | null = null;

class MockWorker {
  postMessage = vi.fn();
  terminate = vi.fn();
  onmessage: (event: MessageEvent<unknown>) => void = () => {};

  constructor() {
    latestWorkerInstance = this as MockWorkerInstance;
  }
}

vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker);

describe("usePreloadLifiData", () => {
  const mockSetEvmTokenMap = vi.fn();
  const mockSetEvmChains = vi.fn();
  const mockSetSolanaTokenMap = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    latestWorkerInstance = null;

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
          setIsPortfolioLoading: vi.fn(),
          setEvmTokenMap: mockSetEvmTokenMap,
          setEvmChains: mockSetEvmChains,
          setSolanaTokenMap: mockSetSolanaTokenMap,
          setEvmTopTokenMap: vi.fn(),
          setEvmTotalUSD: vi.fn(),
          setSolanaTopTokenMap: vi.fn(),
          setSolanaTotalUSD: vi.fn(),
        })
    );
  });

  it("should post message to worker and update stores on success", async () => {
    const { unmount } = renderHook(() => usePreloadLifiData());

    expect(latestWorkerInstance).not.toBeNull();

    latestWorkerInstance?.onmessage({
      data: {
        type: "success",
        payload: {
          evmTokenMap: { "1:token": { symbol: "MOCK" } },
          chains: [{ id: 1, name: "Mock Chain" }],
          solanaTokenMap: { "solana:mint": { symbol: "SOL" } },
        },
      },
    } as unknown as MessageEvent);

    expect(mockSetEvmTokenMap).toHaveBeenCalledWith({
      "1:token": { symbol: "MOCK" },
    });
    expect(mockSetEvmChains).toHaveBeenCalledWith([
      { id: 1, name: "Mock Chain" },
    ]);
    expect(mockSetSolanaTokenMap).toHaveBeenCalledWith({
      "solana:mint": { symbol: "SOL" },
    });

    unmount();
    expect(latestWorkerInstance?.terminate).toHaveBeenCalled();
  });

  it("should log error on worker failure", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderHook(() => usePreloadLifiData());

    expect(latestWorkerInstance).not.toBeNull();

    latestWorkerInstance?.onmessage({
      data: {
        type: "error",
        payload: "Some error occurred",
      },
    } as unknown as MessageEvent);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "LIFI preload worker error:",
      "Some error occurred"
    );

    consoleErrorSpy.mockRestore();
  });
});
