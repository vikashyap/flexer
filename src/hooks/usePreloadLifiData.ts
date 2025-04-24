import { usePortfolioStore } from "@/store/portfolioStore";
import Worker from "@/workers/lifiPreload.worker?worker";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const usePreloadLifiData = () => {
  const { setEvmTokenMap, setEvmChains, setSolanaTokenMap } = usePortfolioStore(
    useShallow((state) => ({
      setEvmTokenMap: state.setEvmTokenMap,
      setEvmChains: state.setEvmChains,
      setSolanaTokenMap: state.setSolanaTokenMap,
    }))
  );

  useEffect(() => {
    const worker = new Worker();

    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === "success") {
        const { evmTokenMap, chains, solanaTokenMap } = payload;
        setEvmTokenMap(evmTokenMap);
        setEvmChains(chains);
        setSolanaTokenMap(solanaTokenMap);
      } else {
        console.error("LIFI preload worker error:", payload);
      }
    };

    worker.postMessage("start");

    return () => worker.terminate(); // Clean up the worker
  }, []);
};
