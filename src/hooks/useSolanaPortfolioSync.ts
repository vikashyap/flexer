import { syncSolanaBalance } from "@/services/syncSolanaBalance";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const useSolanaPortfolioSync = () => {
  const {
    solanaTokenMap,
    setSolanaTotalUSD,
    setSolanaTopTokenMap,
    setIsPortfolioLoading,
  } = usePortfolioStore(
    useShallow((state) => ({
      solanaTokenMap: state.solana.tokenMap,
      setSolanaTotalUSD: state.setSolanaTotalUSD,
      setSolanaTopTokenMap: state.setSolanaTopTokenMap,
      setIsPortfolioLoading: state.setIsPortfolioLoading,
    }))
  );

  const isSolanaConnected = useWalletConnectionStore(
    (state) => state.isSolanaConnected
  );
  const publicKey = useWalletConnectionStore((state) => state.solanaPublicKey);
  const { connection } = useConnection();

  useEffect(() => {
    const sync = async () => {
      if (!isSolanaConnected || !publicKey) {
        setSolanaTotalUSD(0);
        setSolanaTopTokenMap({});
        return;
      }

      try {
        setIsPortfolioLoading(true);
        console.log(
          "🔄 Syncing Solana wallet balances...",
          publicKey.toBase58()
        );
        await syncSolanaBalance({
          address: publicKey.toBase58(),
          solanaTokenMap,
          setSolanaTotalUSD,
          setSolanaTopTokenMap,
          connection,
        });
      } finally {
        setIsPortfolioLoading(false);
      }
    };

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    publicKey,
    isSolanaConnected,
    setSolanaTotalUSD,
    setSolanaTopTokenMap,
    setIsPortfolioLoading,
    connection,
  ]);
};
