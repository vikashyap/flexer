import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import { META_MASK_LOGO, PHANTOM_LOGO } from "@/constants";
import { useEvmWallet } from "@/hooks/useEvmWallet";
import { motion } from "framer-motion";

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WalletDialog({
  open,
  onOpenChange,
}: WalletDialogProps) {
  const { connect: ConnectEvm } = useEvmWallet();
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
          <h3 className="text-sm font-medium text-gray-500">EVM Wallets</h3>
          <WalletOption
            name="MetaMask"
            icon={META_MASK_LOGO}
            isConnected={false}
            isConnecting={false}
            onClick={() => ConnectEvm()}
            disabled={false}
          />

          <h3 className="text-sm font-medium text-gray-500 mt-4">
            Solana Wallets
          </h3>
          <WalletOption
            name="Phantom"
            icon={PHANTOM_LOGO}
            isConnected={false}
            isConnecting={false}
            onClick={() => {}}
            disabled={false}
          />

          <div className="border-t my-4 border-gray-100"></div>
          <p className="text-xs text-gray-500 text-center">
            More wallet options coming soon
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface WalletOptionProps {
  name: string;
  icon: string;
  isConnected: boolean;
  isConnecting: boolean;
  onClick: () => void;
  disabled: boolean;
}

function WalletOption({
  name,
  icon,
  isConnected,
  isConnecting,
  onClick,
  disabled,
}: WalletOptionProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <button
        className={`w-full flex items-center justify-between p-3 rounded-lg  border border-gray-300 ${
          isConnected
            ? "bg-green-50 border-green-200"
            : disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-gray-50 hover:border-gray-300"
        }`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm">
            <img
              src={icon || "/placeholder.svg"}
              alt={`${name} logo`}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/placeholder.svg?height=20&width=20";
              }}
            />
          </div>
          <span className="font-medium">{name}</span>
        </div>
        <div>
          {isConnecting ? (
            <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          ) : isConnected ? (
            <div className="bg-green-500 text-white rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div className="text-sm text-purple-500">Connect</div>
          )}
        </div>
      </button>
    </motion.div>
  );
}
