import { resetWalletBalances } from "@/services/resetBalance";
import { syncEvmBalance } from "@/services/syncEvmBalance";
import { syncSolanaBalance } from "@/services/syncSolanaBalance";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useWalletStore } from "@/store/walletStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const useWalletPortfolioSync = () => {
  const {
    setEvmTokenMap,
    setEvmTopTokenMap,
    tokenMap,
    solTokenMap,
    topTokenMap,
    chains,
    setEvmTotalUSD,
    setSolanaTotalUSD,
    setIsPortfolioLoading,
  } = usePortfolioStore(
    useShallow((state) => ({
      setEvmTokenMap: state.setEvmTokenMap,
      setEvmTopTokenMap: state.setEvmTopTokenMap,
      setEvmTotalUSD: state.setEvmTotalUSD,
      setSolanaTotalUSD: state.setSolanaTotalUSD,
      tokenMap: state.evm.tokenMap,
      solTokenMap: state.solana.tokenMap,
      topTokenMap: state.evm.topTokenMap,
      chains: state.evm.chains,
      solonaTokenMap: state.solana.tokenMap,
      isPortfolioLoading: state.isPortfolioLoading,
      setIsPortfolioLoading: state.setIsPortfolioLoading,
    }))
  );

  const { evmAddress, solanaAddress } = useWalletStore(
    useShallow((state) => ({
      evmAddress: state.evmWalletAccount?.address,
      solanaAddress: state.solanaWallet?.address,
    }))
  );

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
            setEvmTokenMap,
            setEvmTopTokenMap,
            setEvmTotalUSD,
          });
        } finally {
          setIsPortfolioLoading(false);
        }
      }
      if (solanaAddress) {
        syncSolanaBalance(solanaAddress, solTokenMap, setSolanaTotalUSD);
      }
    };

    sync();
  }, [evmAddress, isTokenMapLoaded, solanaAddress]);
};
