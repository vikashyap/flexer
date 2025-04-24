import { META_MASK_LOGO } from "@/constants";
import { wagmiConfig } from "@/services/evmWallet";
import { connect, disconnect, injected } from "@wagmi/core";
import { useRef } from "react";
import { useAccount } from "wagmi";
import { WalletOption } from "./walletOption";

export function EvmWallets() {
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 EvmWallets Render Count:", renderCount.current);
  const { address, isConnected, isConnecting, chainId } = useAccount();
  return (
    <>
      <h3 className="text-sm font-medium text-gray-500">EVM Wallets</h3>

      <WalletOption
        name="MetaMask"
        icon={META_MASK_LOGO}
        isConnected={!!isConnected}
        isConnecting={!!isConnecting}
        onConnect={() => connect(wagmiConfig, { connector: injected() })}
        onDisconnect={() => disconnect(wagmiConfig)}
        disabled={!!isConnected}
        address={address}
        chainId={chainId}
      />
    </>
  );
}
