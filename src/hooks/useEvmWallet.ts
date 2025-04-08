import {
  connectEvmWallet,
  disconnectEvmWallet,
} from "@/services/evmWalletService";
import { useWalletStore } from "@/store/walletStore";

export const useEvmWallet = () => {
  const { setEvmWallet } = useWalletStore();

  const connect = async () => {
    const connectedEvmWallet = await connectEvmWallet();
    if (!connectedEvmWallet) {
      throw new Error("Failed to connect to EVM wallet");
    }
    console.log("Connected EVM wallet:", connectedEvmWallet);
    setEvmWallet({
      address: connectedEvmWallet.accounts[0],
      ecosystem: "evm",
    });
  };

  const disconnect = async () => {
    await disconnectEvmWallet();
    setEvmWallet(null);
  };

  return { connect, disconnect };
};
