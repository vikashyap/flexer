import { MOCK_CHAINS, MOCK_TOKEN_MAP } from "@/mock";
import { syncEvmBalance } from "@/services/syncEvmBalance";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetBalance = vi.fn();
const mockMulticall = vi.fn();

vi.mock("viem", async () => {
  const actual = await vi.importActual<typeof import("viem")>("viem");
  return {
    ...actual,
    createPublicClient: vi.fn(() => ({
      getBalance: mockGetBalance,
      multicall: mockMulticall,
    })),
    defineChain: actual.defineChain,
    erc20Abi: actual.erc20Abi,
    formatUnits: actual.formatUnits,
    http: actual.http,
  };
});

describe("syncEvmBalance", () => {
  let setEvmTopTokenMap: ReturnType<typeof vi.fn>;
  let setEvmTotalUSD: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setEvmTopTokenMap = vi.fn();
    setEvmTotalUSD = vi.fn();
    mockGetBalance.mockReset();
    mockMulticall.mockReset();
  });

  it("should fetch native and ERC20 balances and update top tokens", async () => {
    mockGetBalance.mockResolvedValue(BigInt("1000000000000000000")); // 1 ETH
    mockMulticall.mockResolvedValue([
      { status: "success", result: BigInt("2000000000000000000") }, // 2 tokens
      { status: "success", result: BigInt("0") }, // 0 tokens
    ]);

    await syncEvmBalance({
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      chains: MOCK_CHAINS,
      tokenMap: MOCK_TOKEN_MAP,
      setEvmTopTokenMap,
      setEvmTotalUSD,
    });

    expect(mockGetBalance).toHaveBeenCalled();
    expect(mockMulticall).toHaveBeenCalled();

    expect(setEvmTopTokenMap).toHaveBeenCalled();
    expect(setEvmTotalUSD).toHaveBeenCalled();

    const topTokenMapArg = setEvmTopTokenMap.mock.calls[0][0];
    const totalUsdArg = setEvmTotalUSD.mock.calls[0][0];

    expect(Object.keys(topTokenMapArg).length).toBeGreaterThan(0);
    expect(totalUsdArg).toBeGreaterThan(0);
  });

  it("should handle RPC errors gracefully", async () => {
    mockGetBalance.mockRejectedValue(new Error("RPC Error"));

    const tokenMap = {};

    await syncEvmBalance({
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      chains: MOCK_CHAINS,
      tokenMap,
      setEvmTopTokenMap,
      setEvmTotalUSD,
    });

    expect(setEvmTopTokenMap).toHaveBeenCalled();
    expect(setEvmTotalUSD).toHaveBeenCalled();
  });
});
