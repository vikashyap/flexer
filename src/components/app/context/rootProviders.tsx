import { wagmiConfig } from "@/services/evmWallet";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"; // or your Solana provider
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
const wallets = [new SolflareWalletAdapter(), new PhantomWalletAdapter()];

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  // const setEvmWallet = useWalletStore((state) => state.setEvmWalletAccount);

  // useEffect(() => {
  //   const unwatch = watchAccount(wagmiConfig, {
  //     onChange(data) {
  //       console.log("🟡 EVM Account changed!", data);
  //       if (data.address && data.isConnected) {
  //         console.log("🟢 EVM Account connected!", data.address);
  //         setEvmWallet(data);
  //       } else {
  //         console.log("🔴 EVM Account disconnected!");
  //         setEvmWallet(null);
  //       }
  //     },
  //   });

  //   return () => {
  //     console.log("🔻 Unsubscribing account watcher");
  //     unwatch();
  //   };
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
          <WalletProvider wallets={wallets} autoConnect>
            {children}
          </WalletProvider>
        </ConnectionProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
