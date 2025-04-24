import { resetWalletBalances } from "@/services/resetBalance";
import { syncEvmBalance } from "@/services/syncEvmBalance";
import { syncSolanaBalance } from "@/services/syncSolanaBalance";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/react/shallow";

export const useWalletPortfolioSync = () => {
  const {
    setEvmTokenMap,
    setEvmTopTokenMap,
    tokenMap,
    solanaTokenMap,
    topTokenMap,
    chains,
    setEvmTotalUSD,
    setSolanaTotalUSD,
    setIsPortfolioLoading,
    setSolanaTopTokenMap,
  } = usePortfolioStore(
    useShallow((state) => ({
      setEvmTokenMap: state.setEvmTokenMap,
      setEvmTopTokenMap: state.setEvmTopTokenMap,
      setEvmTotalUSD: state.setEvmTotalUSD,
      setSolanaTotalUSD: state.setSolanaTotalUSD,
      tokenMap: state.evm.tokenMap,
      solanaTokenMap: state.solana.tokenMap,
      topTokenMap: state.evm.topTokenMap,
      chains: state.evm.chains,
      solonaTokenMap: state.solana.tokenMap,
      isPortfolioLoading: state.isPortfolioLoading,
      setIsPortfolioLoading: state.setIsPortfolioLoading,
      setSolanaTopTokenMap: state.setSolanaTopTokenMap,
    }))
  );

  const { address: evmAddress } = useAccount();
  const { publicKey } = useWallet();

  const { connection } = useConnection();

  const isTokenMapLoaded =
    Object.keys(tokenMap).length > 0 && chains.length > 0;

  useEffect(() => {
    const sync = async () => {
      if (!isTokenMapLoaded) return;

      if (Object.keys(topTokenMap).length > 0) {
        console.log("🔁 Resetting top tokens due to address change/disconnect");
        resetWalletBalances({
          tokenMap,
          topTokenMap,
          setEvmTokenMap,
          setEvmTopTokenMap,
          setEvmTotalUSD,
        });
      }

      if (evmAddress) {
        try {
          setIsPortfolioLoading(true);
          console.log("🔄 Syncing wallet balances...", evmAddress);
          await syncEvmBalance({
            address: evmAddress,
            tokenMap,
            chains,
            setEvmTopTokenMap,
            setEvmTotalUSD,
          });
        } finally {
          setIsPortfolioLoading(false);
        }
      }
      if (publicKey) {
        syncSolanaBalance({
          address: publicKey.toBase58(),
          solanaTokenMap,
          setSolanaTotalUSD,
          setSolanaTopTokenMap,
          connection,
        });
      }
    };

    sync();
  }, [evmAddress, isTokenMapLoaded, publicKey]);
};
