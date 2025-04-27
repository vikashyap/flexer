import { Button } from "@/components/base/button";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { getChainId, switchChain } from "@wagmi/core";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";
import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";

export function WrongChainConnected() {
  const [isLoading, setIsLoading] = useState(false);
  const { chain } = useAccount();
  console.log("Current chain id:", chain?.id);
  const chainId = getChainId(wagmiConfig);

  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 WrongNetwork render:", renderCount.current);

  const isOnSepolia = chainId === sepolia.id;

  if (isOnSepolia || !chain) {
    return null;
  }

  const handleSwitchNetwork = async () => {
    try {
      setIsLoading(true);
      // Simulate network switching delay
      await switchChain(wagmiConfig, { chainId: sepolia.id });
      console.log("Switched to Sepolia network");
      // In a real app, you would use: await switchChain(wagmiConfig, { chainId: sepolia.id })
    } catch (error) {
      console.error("Failed to switch network:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative overflow-hidden rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-5 shadow-sm"
    >
      <motion.div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-pink-100 opacity-30"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="relative flex items-start space-x-4">
        <div className="flex-shrink-0">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{
              duration: 0.5,
              repeat: 3,
              repeatDelay: 5,
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
              <AlertTriangle className="h-6 w-6 text-purple-600" />
            </div>
          </motion.div>
        </div>

        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-purple-800">
            EVM Network Mismatch Detected
          </h3>
          <p className="mb-4 text-purple-700">
            Your wallet is connected to the wrong network. Please switch to
            Sepolia testnet to Inscribe Your Portfolio Value.
          </p>

          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSwitchNetwork}
                disabled={isLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <span className="relative z-10 flex items-center">
                  {isLoading ? "Switching..." : "Switch to Sepolia"}
                  {!isLoading && (
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </span>
                <motion.span
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{ opacity: 0.1 }}
                />
              </Button>
            </motion.div>

            <div className="hidden items-center space-x-1 text-xs text-purple-600 sm:flex">
              <CheckCircle2 className="h-4 w-4" />
              <span>Recommended: Sepolia Network</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
