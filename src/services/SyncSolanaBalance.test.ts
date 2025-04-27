import { MOCK_SOLANA_TOP_TOKEN } from "@/mock";
import { syncSolanaBalance } from "@/services/syncSolanaBalance";
import { Token } from "@/types"; // adjust if needed
import { Connection } from "@solana/web3.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("syncSolanaBalance", () => {
  let mockConnection: Partial<Connection>;
  let setSolanaTopTokenMap: ReturnType<typeof vi.fn>;
  let setSolanaTotalUSD: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setSolanaTopTokenMap = vi.fn();
    setSolanaTotalUSD = vi.fn();

    mockConnection = {
      getBalance: vi.fn(),
      getParsedTokenAccountsByOwner: vi.fn(),
    };
  });

  it("should sync native SOL and SPL token balances", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockConnection.getBalance as any).mockResolvedValue(1e9); // 1 SOL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockConnection.getParsedTokenAccountsByOwner as any).mockResolvedValue({
      value: [
        {
          account: {
            data: {
              parsed: {
                info: {
                  mint: "MockTokenMintAddress",
                  tokenAmount: {
                    amount: "5000000", // 5 tokens
                    uiAmountString: "5",
                  },
                },
              },
            },
          },
        },
      ],
    });

    await syncSolanaBalance({
      address: "9xQeWvG816bUbjTz3seFJMC3HRtHBGi28z5mu5MPm4T8",
      solanaTokenMap: MOCK_SOLANA_TOP_TOKEN,
      setSolanaTopTokenMap,
      setSolanaTotalUSD,
      connection: mockConnection as Connection,
    });

    expect(mockConnection.getBalance).toHaveBeenCalled();
    expect(mockConnection.getParsedTokenAccountsByOwner).toHaveBeenCalled();
    expect(setSolanaTopTokenMap).toHaveBeenCalled();
    expect(setSolanaTotalUSD).toHaveBeenCalled();

    const topTokenMapArg = setSolanaTopTokenMap.mock.calls[0][0];
    const totalUsdArg = setSolanaTotalUSD.mock.calls[0][0];

    expect(topTokenMapArg["solana:native"]).toBeDefined();
    expect(topTokenMapArg["solana:mocktokenmintaddress"]).toBeDefined();
    expect(totalUsdArg).toBeGreaterThan(0);
  });

  it("should handle fetch errors gracefully (just warn, no crash)", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockConnection.getBalance as any).mockRejectedValue(
      new Error("Connection error")
    );

    const solanaTokenMap: Record<string, Token> = {};

    // Should not crash even if getBalance fails
    await expect(
      syncSolanaBalance({
        address: "9xQeWvG816bUbjTz3seFJMC3HRtHBGi28z5mu5MPm4T8",
        solanaTokenMap,
        setSolanaTopTokenMap,
        setSolanaTotalUSD,
        connection: mockConnection as Connection,
      })
    ).resolves.not.toThrow();

    // Just verify it doesn't call anything
    expect(setSolanaTopTokenMap).not.toHaveBeenCalled();
    expect(setSolanaTotalUSD).not.toHaveBeenCalled();
  });
});
