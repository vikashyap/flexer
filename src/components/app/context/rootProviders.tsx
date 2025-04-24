import { wagmiConfig } from "@/services/evmWallet";
import { useWalletStore } from "@/store/walletStore";
import { ConnectionProvider } from "@solana/wallet-adapter-react"; // or your Solana provider
import { clusterApiUrl } from "@solana/web3.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { watchAccount } from "@wagmi/core";
import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const setEvmWallet = useWalletStore((state) => state.setEvmWalletAccount);

  useEffect(() => {
    const unwatch = watchAccount(wagmiConfig, {
      onChange(data) {
        console.log("🟡 EVM Account changed!", data);
        if (data.address && data.isConnected) {
          console.log("🟢 EVM Account connected!", data.address);
          setEvmWallet(data);
        } else {
          console.log("🔴 EVM Account disconnected!");
          setEvmWallet(null);
        }
      },
    });

    return () => {
      console.log("🔻 Unsubscribing account watcher");
      unwatch();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectionProvider endpoint={clusterApiUrl("mainnet-beta")}>
          {children}
        </ConnectionProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
