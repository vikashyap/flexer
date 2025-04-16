import { SOLFLARE_LOGO } from "@/constants";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useWalletStore } from "@/store/walletStore";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { WalletOption } from "./walletOption";

export function SolanaWallets() {
  const { connect: connectSolana, disconnect: disconnectSolana } =
    useSolanaWallet();
  const { address, isConnected } = useWalletStore(
    useShallow((state) => ({
      address: state.solanaWallet?.address,
      isConnected: state.solanaWallet?.isConnected,
    }))
  );
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 SoloanWallet Render Count:", renderCount.current);

  return (
    <>
      <h3 className="text-sm font-medium text-gray-500 mt-4">Solana Wallets</h3>
      <WalletOption
        name="Solflare"
        icon={SOLFLARE_LOGO}
        isConnected={!!isConnected}
        isConnecting={false}
        onConnect={() => connectSolana()}
        onDisconnect={() => disconnectSolana()}
        disabled={false}
        address={address}
        chainId={undefined}
      />
    </>
  );
}
