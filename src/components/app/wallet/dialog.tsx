import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import { EvmWallets } from "./evmWallet";
import { SolanaWallets } from "./solanaWallet";

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WalletDialog({
  open,
  onOpenChange,
}: WalletDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to the Flexer dApp.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Evm wallets */}
          <EvmWallets />
          {/* Solana wallets  */}
          <SolanaWallets />
          <div className="border-t my-4 border-gray-100"></div>
          <p className="text-xs text-gray-500 text-center">
            More wallet options coming soon
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
