import { META_MASK_LOGO } from "@/constants";
import { useEvmWallet } from "@/hooks/useEvmWallet";
import { useWalletStore } from "@/store/walletStore";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { WalletOption } from "./walletOption";

export function EvmWallets() {
  const { connect: connectEvm, disconnect: disconnectEvm } = useEvmWallet();

  // re-renders avoided using useShallow directly in the component to prevent unnecessary re-renders
  const { address, chainId, isConnected, isConnecting } = useWalletStore(
    useShallow((state) => ({
      address: state.evmWalletAccount?.address,
      chainId: state.evmWalletAccount?.chainId,
      isConnected: state.evmWalletAccount?.isConnected,
      isConnecting: state.evmWalletAccount?.status === "connecting",
    }))
  );

  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 EvmWallets Render Count:", renderCount.current);

  return (
    <>
      <h3 className="text-sm font-medium text-gray-500">EVM Wallets</h3>

      {/* <ConnectKitWalletOption name="kjbfw" icon={META_MASK_LOGO} /> */}

      <WalletOption
        name="MetaMask"
        icon={META_MASK_LOGO}
        isConnected={!!isConnected}
        isConnecting={!!isConnecting}
        onConnect={() => connectEvm()}
        onDisconnect={() => disconnectEvm()}
        disabled={!!isConnected}
        address={address}
        chainId={chainId}
      />
    </>
  );
}
