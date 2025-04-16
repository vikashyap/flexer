import { injected } from "@wagmi/connectors";
import {
  connect,
  createConfig,
  disconnect,
  getAccount,
  getChainId,
  http,
} from "@wagmi/core";
import { arbitrumSepolia, sepolia } from "@wagmi/core/chains";

export const allowedChains = [sepolia, arbitrumSepolia];

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia],
  connectors: [injected()],
  transports: {
    [arbitrumSepolia.id]: http(
      "https://arb-sepolia.g.alchemy.com/v2/vriLHvVZ78KyULnVq2CwjAqWj1YaLfoM"
    ),
  },
});

export const connectEvmWallet = () =>
  connect(wagmiConfig, { connector: injected() });

export const disconnectEvmWallet = () => disconnect(wagmiConfig);

export const getEvmWalletInfo = async () => {
  const account = getAccount(wagmiConfig);
  const chainId = await getChainId(wagmiConfig);
  return { account, chainId };
};
