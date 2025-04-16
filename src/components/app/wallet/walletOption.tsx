import { Button } from "@/components/base/button";
import { formatAddress } from "@/lib/utils";
import { Address } from "cluster";
import { motion } from "framer-motion";
import { BadgeCheck, XCircleIcon } from "lucide-react";

interface WalletOptionProps {
  name: string;
  icon: string;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  disabled: boolean;
  address: Address | undefined | string | null;
  chainId: number | undefined;
}

export function WalletOption({
  name,
  icon,
  isConnected,
  onConnect,
  onDisconnect,
  disabled,
  address,
}: WalletOptionProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <div
        className={`w-full flex items-center justify-between p-3 rounded-lg  border border-gray-300 cursor-pointer ${
          isConnected
            ? "bg-green-50 border-green-200"
            : disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-gray-50 hover:border-gray-300"
        }`}
        onClick={disabled ? undefined : onConnect}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm relative">
            <img
              src={icon || "/placeholder.svg"}
              alt={`${name} logo`}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/placeholder.svg?height=20&width=20";
              }}
            />
            {isConnected && (
              <BadgeCheck className="h-6 w-6 text-green-500 ml-2 absolute top-[-18px] right-[24px]" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium ">{name}</span>
            {address && (
              <span className="text-xs text-gray-500">
                {formatAddress(address as string)}
              </span>
            )}
          </div>
        </div>
        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDisconnect();
            }}
            className="text-red-500 border-red-200 hover:bg-red-50 cursor-pointer hover:text-red-800"
          >
            <XCircleIcon className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        ) : (
          <div className="text-sm text-purple-500">Connect</div>
        )}
      </div>
    </motion.div>
  );
}
