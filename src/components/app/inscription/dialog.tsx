import { Button } from "@/components/base/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/base/tabs";
import { useInscribeSolana } from "@/hooks/useInscribeSolana";
import { inscriptionFsmStore } from "@/store/inscriptionFsmStore";
import { usePortfolioStore } from "@/store/portfolioStore";

import { useInscribeEvm } from "@/hooks/useInscribeEvm";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { EvmInscription, SolanaInscription } from "./unifiedInscriptionView";

type Tabs = "evm" | "solana";

interface DialogIncProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogInc = (props: DialogIncProps) => {
  const { open, onOpenChange: setOpen } = props;

  const { isConnected } = useAccount();
  const { connected } = useWallet();
  const evmTotalUsd = usePortfolioStore((state) => state.evm.totalUSD);
  const solanaTotalUsd = usePortfolioStore((state) => state.solana.totalUSD);

  const [activeTab, setActiveTab] = useState<Tabs>(
    isConnected ? "evm" : "solana"
  );

  const { startEvmInscription } = useInscribeEvm();
  const { startSolanaInscription } = useInscribeSolana();

  const state = inscriptionFsmStore((s) => s.fsms[activeTab].state);

  const totalUsdValue = activeTab === "evm" ? evmTotalUsd : solanaTotalUsd;
  const reset = inscriptionFsmStore((s) => s.reset);

  const isInProgress = () => {
    return state !== "idle" && state !== "success" && state !== "error";
  };

  const canInscribe = (type: Tabs) => {
    return (type === "evm" && isConnected) || (type === "solana" && connected);
  };
  console.log(activeTab);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        reset("evm");
        reset("solana");
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inscribe Your Portfolio Value</DialogTitle>
          <DialogDescription>
            Show off your crypto wealth by inscribing your total portfolio value
            on-chain.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Current Portfolio Value
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ${totalUsdValue.toFixed(2)}
            </div>
          </div>

          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value as Tabs)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="evm" disabled={!isConnected}>
                EVM
              </TabsTrigger>
              <TabsTrigger value="solana" disabled={!connected}>
                Solana
              </TabsTrigger>
            </TabsList>

            <TabsContent value="evm" className="mt-4">
              <EvmInscription activeTab={activeTab} open={open} />
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                This will inscribe your portfolio value on the Sepolia testnet.
              </div>
              <Button
                className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => startEvmInscription(solanaTotalUsd)}
                disabled={isInProgress() || !canInscribe("evm")}
              >
                {isInProgress() ? "Inscribing..." : "Inscribe on EVM"}
              </Button>
            </TabsContent>

            <TabsContent value="solana" className="mt-4">
              <SolanaInscription activeTab={activeTab} open={open} />
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                This will inscribe your portfolio value on the Solana Devnet.
              </div>
              <Button
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => startSolanaInscription(solanaTotalUsd)}
                disabled={isInProgress() || !canInscribe("solana")}
              >
                {isInProgress() ? "Inscribing..." : "Inscribe on Solanaaaa"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="sm:justify-start">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Note: This is a testnet transaction and won't cost real funds.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DialogInc;
