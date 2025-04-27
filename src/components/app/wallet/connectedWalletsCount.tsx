import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { useRef } from "react";

export function ConnectedWalletsCount() {
  const connectedWalletCount = useWalletConnectionStore(
    (state) => state.connectedWalletCount
  );

  // code to track render count
  // This is just for debugging purposes to see how many times the component re-renders
  // and should not be included in production code
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 ConnectedWalletsCount:", renderCount.current);

  return (
    <div className="flex items-center gap-2">
      <span>
        {connectedWalletCount > 0
          ? `${connectedWalletCount} Wallet${
              connectedWalletCount > 1 ? "s" : ""
            } Connected`
          : "Connect Wallet"}
      </span>
      {connectedWalletCount > 0 && (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      )}
    </div>
  );
}
