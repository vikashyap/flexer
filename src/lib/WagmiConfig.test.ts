import { wagmiConfig } from "@/lib/wagmiConfig";
import { arbitrum, mainnet, sepolia } from "@wagmi/core/chains";
import { describe, expect, it } from "vitest";

describe("wagmiConfig", () => {
  it("should be defined", () => {
    expect(wagmiConfig).toBeDefined();
  });

  it("should have mainnet, sepolia, and arbitrum chains", () => {
    const chainIds = wagmiConfig.chains.map((chain) => chain.id);
    expect(chainIds).toContain(mainnet.id);
    expect(chainIds).toContain(sepolia.id);
    expect(chainIds).toContain(arbitrum.id);
  });

  it("should have at least one connector (injected)", () => {
    expect(wagmiConfig.connectors.length).toBeGreaterThan(0);
    const connector = wagmiConfig.connectors[0];
    expect(connector.id).toBe("injected");
  });
});
