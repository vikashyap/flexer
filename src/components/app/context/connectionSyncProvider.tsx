import { useEvmPortfolioSync } from "@/hooks/useEvmPortfolioSync";
import { usePreloadLifiData } from "@/hooks/usePreloadLifiData";
import { useSolanaPortfolioSync } from "@/hooks/useSolanaPortfolioSync";
import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export function ConnectionSyncProvider() {
  usePreloadLifiData();
  useEvmPortfolioSync();
  useSolanaPortfolioSync();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { connected: isSolanaConnected, publicKey } = useWallet();

  const setEvmConnection = useWalletConnectionStore((s) => s.setEvmConnection);
  const setSolanaConnection = useWalletConnectionStore(
    (s) => s.setSolanaConnection
  );

  useEffect(() => {
    setEvmConnection(isEvmConnected, evmAddress ?? null);
  }, [isEvmConnected, evmAddress, setEvmConnection]);

  useEffect(() => {
    setSolanaConnection(isSolanaConnected, publicKey ?? null);
  }, [isSolanaConnected, publicKey, setSolanaConnection]);

  return null;
}
