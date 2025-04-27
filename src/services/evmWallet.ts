import { injected } from "@wagmi/connectors";
import { createConfig, http } from "@wagmi/core";
import { arbitrum, mainnet, sepolia } from "@wagmi/core/chains";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, arbitrum],
  connectors: [injected()],

  transports: {
    [mainnet.id]: http("https://rpc.ankr.com/eth"),
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/vriLHvVZ78KyULnVq2CwjAqWj1YaLfoM"
    ),
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
  },
});
