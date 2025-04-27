import { wagmiConfig } from "@/lib/wagmiConfig";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { ConnectionSyncProvider } from "./connectionSyncProvider";
const wallets = [new SolflareWalletAdapter(), new PhantomWalletAdapter()];

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
          <WalletProvider wallets={wallets} autoConnect>
            <ConnectionSyncProvider />
            {children}
          </WalletProvider>
        </ConnectionProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
