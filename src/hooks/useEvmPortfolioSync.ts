import { syncEvmBalance } from "@/services/syncEvmBalance";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const useEvmPortfolioSync = () => {
  const {
    setEvmTopTokenMap,
    tokenMap,
    chains,
    setEvmTotalUSD,
    setIsPortfolioLoading,
  } = usePortfolioStore(
    useShallow((state) => ({
      setEvmTopTokenMap: state.setEvmTopTokenMap,
      setEvmTotalUSD: state.setEvmTotalUSD,
      tokenMap: state.evm.tokenMap,
      chains: state.evm.chains,
      setIsPortfolioLoading: state.setIsPortfolioLoading,
    }))
  );

  const isEvmConnected = useWalletConnectionStore(
    (state) => state.isEvmConnected
  );
  const evmAddress = useWalletConnectionStore((state) => state.evmAddress);

  useEffect(() => {
    const sync = async () => {
      if (!evmAddress && !isEvmConnected) {
        setEvmTotalUSD(0);
        setEvmTopTokenMap({});
        return;
      }
      if (evmAddress) {
        try {
          setIsPortfolioLoading(true);
          console.log("🔄 Syncing EVM wallet balances...", evmAddress);
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
    };

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    evmAddress,
    isEvmConnected,
    chains,
    setEvmTopTokenMap,
    setEvmTotalUSD,
    setIsPortfolioLoading,
  ]);
};
