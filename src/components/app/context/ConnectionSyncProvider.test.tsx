import { render } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";
import { ConnectionSyncProvider } from "./connectionSyncProvider";

// Mock wagmi useAccount
vi.mock("wagmi", () => ({
  useAccount: vi.fn(),
}));

// Mock Solana wallet + connection
vi.mock("@solana/wallet-adapter-react", () => {
  return {
    useWallet: vi.fn(),
    useConnection: vi.fn().mockReturnValue({
      connection: {},
    }),
  };
});

// Mock Zustand store
vi.mock("@/store/walletConnectionStore", () => ({
  useWalletConnectionStore: vi.fn(),
}));

describe("ConnectionSyncProvider", () => {
  it("syncs EVM and Solana wallet connection states correctly", () => {
    (useAccount as unknown as Mock).mockReturnValue({
      address: "0x1234",
      isConnected: true,
    });

    (useWallet as unknown as Mock).mockReturnValue({
      connected: true,
      publicKey: { toString: () => "SolanaPublicKey" },
    });

    const setEvmConnection = vi.fn();
    const setSolanaConnection = vi.fn();

    (useWalletConnectionStore as unknown as Mock).mockImplementation(
      (selector) =>
        selector({
          setEvmConnection,
          setSolanaConnection,
        })
    );

    render(<ConnectionSyncProvider />);

    expect(setEvmConnection).toHaveBeenCalledWith(true, "0x1234");
    expect(setSolanaConnection).toHaveBeenCalledWith(true, {
      toString: expect.any(Function),
    });
  });
});
