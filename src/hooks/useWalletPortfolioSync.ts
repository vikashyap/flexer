import { resetWalletBalances } from "@/services/resetWalletBalancesService";
import { syncWalletBalances } from "@/services/syncWalletBalancesService";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useWalletStore } from "@/store/walletStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const useWalletPortfolioSync = () => {
  const {
    setEvmTokenMap,
    setEvmTopTokenMap,
    tokenMap,
    topTokenMap,
    chains,
    setEvmTotalUSD,
  } = usePortfolioStore(
    useShallow((state) => ({
      setEvmTokenMap: state.setEvmTokenMap,
      setEvmTopTokenMap: state.setEvmTopTokenMap,
      setEvmTotalUSD: state.setEvmTotalUSD,
      tokenMap: state.evm.tokenMap,
      topTokenMap: state.evm.topTokenMap,
      chains: state.evm.chains,
    }))
  );

  const address = useWalletStore(
    useShallow((state) => state.evmWalletAccount?.address)
  );

  const isTokenMapLoaded =
    Object.keys(tokenMap).length > 0 && chains.length > 0;

  useEffect(() => {
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
    if (address && tokenMap && chains) {
      console.log("Syncing wallet balances...", address);
      syncWalletBalances({
        address,
        tokenMap,
        chains,
        setEvmTokenMap,
        setEvmTopTokenMap,
        setEvmTotalUSD,
      });
    }
  }, [address, isTokenMapLoaded]);
};
