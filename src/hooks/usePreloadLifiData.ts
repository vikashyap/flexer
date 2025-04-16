import { usePortfolioStore } from "@/store/portfolioStore";
import Worker from "@/workers/lifiPreload.worker?worker";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const usePreloadLifiData = () => {
  const { setEvmTokenMap, setEvmTopTokenMap, setEvmChains } = usePortfolioStore(
    useShallow((state) => ({
      setEvmTokenMap: state.setEvmTokenMap,
      setEvmTopTokenMap: state.setEvmTopTokenMap,
      setEvmChains: state.setEvmChains,
    }))
  );

  useEffect(() => {
    const worker = new Worker();

    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === "success") {
        const { tokenMap, topTokenMap, chains } = payload;
        setEvmTokenMap(tokenMap);
        setEvmTopTokenMap(topTokenMap);
        setEvmChains(chains);
      } else {
        console.error("LIFI preload worker error:", payload);
      }
    };

    worker.postMessage("start");

    return () => worker.terminate(); // Clean up the worker
  }, []);
};
