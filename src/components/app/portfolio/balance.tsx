import { formatNumber } from "@/lib/utils";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useRef } from "react";

export const PortfolioBalance = () => {
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 PortfolioBalance Render Count:", renderCount.current);
  const evmTotalRaw = usePortfolioStore((state) => state?.evm?.totalUSD);
  const solanaTotalRaw = usePortfolioStore((state) => state?.solana?.totalUSD);
  console.log("evmTotalRaw", evmTotalRaw);
  console.log("solanaTotalRaw", solanaTotalRaw);
  return (
    <div className="text-5xl font-bold text-center py-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      ${!evmTotalRaw ? "0.00" : formatNumber(evmTotalRaw + solanaTotalRaw)}
    </div>
  );
};
