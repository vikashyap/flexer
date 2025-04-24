import {
  connectSolanaWallet,
  disconnectSolanaWallet,
} from "@/services/solanaWallet";
import { useWalletStore } from "@/store/walletStore";

export const useSolanaWallet = () => {
  // Zustand store to manage EVM wallet state, avoid unnecessary re-renders by using specific selectors
  const setSolanaWallet = useWalletStore((state) => state.setSolanaWallet);
  const connect = async () => {
    try {
      const { publicKey } = await connectSolanaWallet();

      if (!publicKey) {
        throw new Error("Failed to connect to Solana wallet");
      }

      setSolanaWallet({
        address: publicKey.toBase58(),
        ecosystem: "solana",
        isConnected: true,
        isConnecting: false,
      });
    } catch (error) {
      console.error("❌ Solana wallet connection failed:", error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectSolanaWallet();
      setSolanaWallet(null);
    } catch (error) {
      console.error("❌ Solana wallet disconnection failed:", error);
      throw error;
    }
  };

  return { connect, disconnect };
};
