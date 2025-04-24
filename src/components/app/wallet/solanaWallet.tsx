import { SOLFLARE_LOGO } from "@/constants";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRef } from "react";
import { WalletOption } from "./walletOption";

export function SolanaWallets() {
  const { connect, disconnect, select, publicKey, connected } = useWallet();
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 SoloanWallet Render Count:", renderCount.current);

  return (
    <>
      <h3 className="text-sm font-medium text-gray-500 mt-4">Solana Wallets</h3>
      <WalletOption
        name="Solflare"
        icon={SOLFLARE_LOGO}
        isConnected={!!connected}
        isConnecting={false}
        onConnect={async () => {
          await select("Solflare" as WalletName);
          await connect();
        }}
        onDisconnect={() => disconnect()}
        disabled={false}
        address={publicKey?.toBase58()}
        chainId={undefined}
      />
    </>
  );
}
