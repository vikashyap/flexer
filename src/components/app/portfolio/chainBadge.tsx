import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { useState } from "react";

export function ChainBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const connectedWalletCount = useWalletConnectionStore(
    (state) => state.connectedWalletCount
  );

  const isMultichain = connectedWalletCount >= 2;
  const label =
    connectedWalletCount === 0
      ? "No wallets connected"
      : isMultichain
      ? "Multichain"
      : "EVM";

  return (
    <div
      className="inline-flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative overflow-hidden px-4 py-1.5 rounded-full text-sm font-medium
          transition-all duration-300 ease-out
          border
          ${
            isMultichain
              ? "bg-gradient-to-r from-purple-600/10 to-pink-500/10 text-purple-700 border-purple-200"
              : "bg-purple-50 text-purple-700 border-purple-100"
          }
          ${isHovered ? "shadow-sm" : ""}
        `}
      >
        {isHovered && (
          <div
            className={`
              absolute inset-0 opacity-20
              ${
                isMultichain
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-purple-200"
              }
            `}
          />
        )}

        <div className="relative flex items-center">
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
              isMultichain
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-purple-500"
            }`}
          ></span>
          <span>{label}</span>
        </div>
      </div>

      {isMultichain && (
        <div className="ml-2 text-xs text-purple-600 font-medium tracking-wide">
          {connectedWalletCount}
        </div>
      )}
    </div>
  );
}
