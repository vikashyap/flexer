import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { describe, expect, it } from "vitest";
import { walletAdapter } from "./solanaAdapers";

describe("walletAdapter", () => {
  it("should be defined", () => {
    expect(walletAdapter).toBeDefined();
  });

  it("should be instance of SolflareWalletAdapter", () => {
    expect(walletAdapter).toBeInstanceOf(SolflareWalletAdapter);
  });

  it("should have a name property 'Solflare'", () => {
    expect(walletAdapter.name).toBe("Solflare");
  });
});
