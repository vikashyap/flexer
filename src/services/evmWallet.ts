import { injected } from "@wagmi/connectors";
import { createConfig, http } from "@wagmi/core";
import { sepolia } from "@wagmi/core/chains";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/vriLHvVZ78KyULnVq2CwjAqWj1YaLfoM"
    ),
  },
});
