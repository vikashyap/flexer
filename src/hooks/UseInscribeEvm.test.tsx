import { useInscribeEvm } from "@/hooks/useInscribeEvm";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import * as fsmStore from "@/store/inscriptionFsmStore";
import * as walletConnectionStore from "@/store/walletConnectionStore";
import * as wagmiHooks from "wagmi";

describe("useInscribeEvm", () => {
  const mockSend = vi.fn();
  const mockReset = vi.fn();
  const mockWriteContract = vi.fn();
  const mockUseWriteContract = wagmiHooks.useWriteContract as unknown as Mock;

  beforeEach(() => {
    vi.restoreAllMocks();

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

    vi.spyOn(fsmStore, "useInscriptionFsmStore").mockImplementation(
      (selector) =>
        selector({
          fsms: {
            evm: {
              state: "idle",
              context: { value: 0, walletAddress: null },
            },
            solana: {
              state: "idle",
              context: { value: 0, walletAddress: null },
            },
          },
          send: mockSend,
          reset: mockReset,
        })
    );
  });

  it("should call startEvmInscription correctly", async () => {
    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      data: "0xtxhash",
      isPending: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useInscribeEvm());

    await act(async () => {
      await result.current.startEvmInscription(123);
    });

    expect(mockReset).toHaveBeenCalledWith("evm");
    expect(mockSend).toHaveBeenCalledWith("evm", {
      type: "START",
      value: 123,
      walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    });
    expect(mockWriteContract).toHaveBeenCalled();
  });

  it("should handle pending transaction correctly", async () => {
    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      data: "0xtxhash",
      isPending: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useInscribeEvm());

    await act(async () => {
      await result.current.startEvmInscription(123);
    });

    expect(mockSend).toHaveBeenCalledWith("evm", { type: "SIGNED" });

    await new Promise((r) => setTimeout(r, 1100));

    expect(mockSend).toHaveBeenCalledWith("evm", { type: "TRANSACTION_SENT" });
  });

  it("should handle transaction error correctly", async () => {
    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      data: undefined,
      isPending: false,
      isError: true,
      error: {
        name: "ContractFunctionExecutionError",
        message: "Transaction failed",
        shortMessage: "fail",
        docsPath: "docs",
        metaMessages: [],
      },
    });

    const { result } = renderHook(() => useInscribeEvm());

    await act(async () => {
      await result.current.startEvmInscription(123);
    });

    expect(mockSend).toHaveBeenCalledWith("evm", {
      type: "FAILED",
      error: "Transaction failed",
    });
  });
});

vi.mock("wagmi", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useWriteContract: vi.fn(),
    useWaitForTransactionReceipt: vi.fn(),
  };
});

describe("useInscribeEvm", () => {
  const mockSend = vi.fn();
  const mockReset = vi.fn();
  const mockWriteContract = vi.fn();

  const useWriteContractMock = wagmiHooks.useWriteContract as unknown as Mock;

  beforeEach(() => {
    vi.restoreAllMocks();

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

    vi.spyOn(fsmStore, "useInscriptionFsmStore").mockImplementation(
      (selector) =>
        selector({
          fsms: {
            evm: { state: "idle", context: { value: 0, walletAddress: null } },
            solana: {
              state: "idle",
              context: { value: 0, walletAddress: null },
            },
          },
          send: mockSend,
          reset: mockReset,
        })
    );
  });

  it("should call startEvmInscription correctly", async () => {
    useWriteContractMock.mockReturnValue({
      writeContract: mockWriteContract,
      data: "0xtxhash",
      isPending: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useInscribeEvm());

    await act(async () => {
      await result.current.startEvmInscription(123);
    });

    expect(mockReset).toHaveBeenCalledWith("evm");
    expect(mockSend).toHaveBeenCalledWith("evm", {
      type: "START",
      value: 123,
      walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    });
    expect(mockWriteContract).toHaveBeenCalled();
  });

  it("should handle pending transaction correctly", async () => {
    useWriteContractMock.mockReturnValue({
      writeContract: mockWriteContract,
      data: "0xtxhash",
      isPending: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useInscribeEvm());

    await act(async () => {
      await result.current.startEvmInscription(123);
    });

    expect(mockSend).toHaveBeenCalledWith("evm", { type: "SIGNED" });

    await new Promise((r) => setTimeout(r, 1100));

    expect(mockSend).toHaveBeenCalledWith("evm", { type: "TRANSACTION_SENT" });
  });

  it("should handle transaction error correctly", async () => {
    useWriteContractMock.mockReturnValue({
      writeContract: mockWriteContract,
      data: undefined,
      isPending: false,
      isError: true,
      error: {
        name: "ContractFunctionExecutionError",
        message: "Transaction failed",
        shortMessage: "fail",
        docsPath: "docs",
        metaMessages: [],
      },
    });

    const { result } = renderHook(() => useInscribeEvm());

    await act(async () => {
      await result.current.startEvmInscription(123);
    });

    expect(mockSend).toHaveBeenCalledWith("evm", {
      type: "FAILED",
      error: "Transaction failed",
    });
  });
});
