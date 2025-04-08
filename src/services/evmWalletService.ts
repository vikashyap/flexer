import { injected } from "@wagmi/connectors";
import {
  connect,
  createConfig,
  disconnect,
  getAccount,
  getChainId,
  http,
} from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";

export const allowedChains = [sepolia, mainnet];

const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http("https://rpc.ankr.com/eth"),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
});

export const connectEvmWallet = () =>
  connect(wagmiConfig, { connector: injected() });

export const disconnectEvmWallet = () => disconnect(wagmiConfig);

export const getEvmWalletInfo = async () => {
  const account = getAccount(wagmiConfig);
  const chainId = await getChainId(wagmiConfig);
  return { address: account.address, chainId };
};
