import {
  connectEvmWallet,
  disconnectEvmWallet,
  getEvmWalletInfo,
} from "@/services/evmWallet";
import { useWalletStore } from "@/store/walletStore";

export const useEvmWallet = () => {
  // Zustand store to manage EVM wallet state, avoid unnecessary re-renders by using specific selectors
  const setEvmWallet = useWalletStore((state) => state.setEvmWalletAccount);

  const connect = async () => {
    try {
      const connectedEvmWallet = await connectEvmWallet();

      if (!connectedEvmWallet) {
        throw new Error("Failed to connect to EVM wallet");
      }

      const { account } = await getEvmWalletInfo();
      if (!account?.address || !account?.chainId) {
        throw new Error("Incomplete EVM wallet data");
      }

      setEvmWallet(account);
    } catch (error) {
      console.error("❌ Wallet connection failed:", error);
      throw error; // or handle with toast/snackbar/alert
    }
  };

  const disconnect = async () => {
    try {
      await disconnectEvmWallet();
      setEvmWallet(null);
    } catch (error) {
      console.error("❌ Wallet disconnection failed:", error);
      throw error;
    }
  };

  return { connect, disconnect };
};
