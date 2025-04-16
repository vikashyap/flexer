import { useWalletStore } from "@/store/walletStore";
import { useShallow } from "zustand/react/shallow";
export function ConnectedWalletsCount() {
  const { evmWalletAccount, solanaWallet } = useWalletStore(
    useShallow((state) => ({
      evmWalletAccount: state.evmWalletAccount,
      solanaWallet: state.solanaWallet,
    }))
  );
  const evmConnected = evmWalletAccount?.isConnected ? 1 : 0;
  const solanaConnected = solanaWallet?.address ? 1 : 0;
  const connectedWalletCount = evmConnected + solanaConnected;

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
