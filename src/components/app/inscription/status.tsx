"use client";

import { Alert, AlertDescription } from "@/components/base/alert";
import { inscriptionFsmStore } from "@/store/inscriptionFsmStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSignature,
  Loader2,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface StatusProps {
  activeTab: "evm" | "solana";
  open: boolean;
}
export type Tabs = "evm" | "solana";

export const StatusInscription = (props: StatusProps) => {
  const { activeTab } = props;
  const state = inscriptionFsmStore((s) => s.fsms[activeTab].state);
  const context = inscriptionFsmStore((s) => s.fsms[activeTab].context);
  const [prevState, setPrevState] = useState(state);

  // Track state changes for animation
  useEffect(() => {
    if (state !== prevState) {
      setPrevState(state);
    }
  }, [state, prevState]);

  const getExplorerUrl = (type: Tabs, txHash: string) =>
    type === "evm"
      ? `https://sepolia.etherscan.io/tx/${txHash}`
      : `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;

  // Define progress steps
  const steps = [
    "preparing",
    "waitingForSignature",
    "sending",
    "waitingForConfirmation",
  ];
  const currentStepIndex = steps.indexOf(state);
  const progress =
    state === "success"
      ? 100
      : state === "error"
      ? 0
      : currentStepIndex >= 0
      ? (currentStepIndex + 1) * 25
      : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
    },
    success: {
      scale: [1, 1.3, 1],
      transition: { duration: 0.5 },
    },
  };

  const progressVariants = {
    initial: { width: "0%" },
    animate: { width: `${progress}%`, transition: { duration: 0.5 } },
  };

  const renderStatus = (type: Tabs) => {
    if (state === "idle") return null;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="relative"
        >
          {/* Progress bar */}
          {state !== "success" && state !== "error" && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200  rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-500 "
                initial="initial"
                animate="animate"
                variants={progressVariants}
              />
            </div>
          )}

          {/* Status alerts */}
          {state === "preparing" && (
            <Alert className="mb-4 mt-3 border-purple-200 bg-purple-50 shadow-sm">
              <motion.div
                initial="initial"
                animate="pulse"
                variants={iconVariants}
                className="absolute left-4 top-4"
              >
                <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
              </motion.div>
              <AlertDescription className="pl-7 py-1">
                <span className="font-medium">
                  Preparing inscription message
                </span>
                <p className="text-xs text-gray-500  mt-1">
                  Formatting your portfolio value for on-chain storage...
                </p>
              </AlertDescription>
            </Alert>
          )}

          {state === "waitingForSignature" && (
            <Alert className="mb-4 mt-3 border-blue-400 bg-blue-100 shadow-sm">
              <motion.div
                initial="initial"
                animate="pulse"
                variants={iconVariants}
                className="absolute left-4 top-4"
              >
                <FileSignature className="h-5 w-5 text-blue-600 " />
              </motion.div>
              <AlertDescription className="pl-7 py-1">
                <span className="font-medium">Please sign the transaction</span>
                <p className="text-xs text-gray-500  mt-1">
                  Check your wallet for a signature request...
                </p>
              </AlertDescription>
            </Alert>
          )}

          {state === "sending" && (
            <Alert className="mb-4 mt-3 border-indigo-400 bg-indigo-100  shadow-sm">
              <motion.div
                initial="initial"
                animate="pulse"
                variants={iconVariants}
                className="absolute left-4 top-4"
              >
                <Send className="h-5 w-5 text-indigo-600 " />
              </motion.div>
              <AlertDescription className="pl-7 py-1">
                <span className="font-medium">Sending transaction</span>
                <p className="text-xs text-gray-500  mt-1">
                  Broadcasting your inscription to the network...
                </p>
              </AlertDescription>
            </Alert>
          )}

          {state === "waitingForConfirmation" && (
            <Alert className="mb-4 mt-3 border-amber-400 bg-amber-100  shadow-sm">
              <motion.div
                initial="initial"
                animate="pulse"
                variants={iconVariants}
                className="absolute left-4 top-4"
              >
                <Clock className="h-5 w-5 text-amber-600 " />
              </motion.div>
              <AlertDescription className="pl-7 py-1">
                <span className="font-medium">Waiting for confirmation</span>
                <p className="text-xs text-gray-500  mt-1">
                  Your transaction is being processed by the network...
                </p>
              </AlertDescription>
            </Alert>
          )}

          {state === "success" && (
            <Alert className="mb-4 mt-3 border-green-500 bg-green-100 shadow-lg">
              <motion.div
                initial="initial"
                animate="success"
                variants={iconVariants}
                className="absolute left-4 top-4"
              >
                <div className="relative">
                  <CheckCircle2 className="h-5 w-5 text-green-600 " />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: 0 }}
                    className="absolute inset-0 rounded-full bg-green-400 "
                  />
                </div>
              </motion.div>
              <AlertDescription className="pl-7 py-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium flex items-center">
                      Inscription complete!
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <Sparkles className="h-4 w-4 text-yellow-500 ml-1" />
                      </motion.div>
                    </span>
                    <p className="text-xs text-gray-500  mt-1">
                      Your portfolio value is now immortalized on-chain!
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <a
                      href={getExplorerUrl(type, context.txHash || "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-md font-bold flex items-center text-green-600 hover:text-green-800 transition-colors"
                    >
                      View <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </motion.div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {state === "error" && (
            <Alert className="mb-4 mt-3 border-red-400 bg-red-100 shadow-sm">
              <motion.div
                initial="initial"
                animate={{ scale: 1, opacity: 1, rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute left-4 top-4"
              >
                <XCircle className="h-5 w-5 text-red-600 " />
              </motion.div>
              <AlertDescription className="pl-7 py-1">
                <span className="font-medium">Transaction failed</span>
                <p className="text-xs text-red-600  mt-1">{context.error}</p>
                <p className="text-xs text-gray-500  mt-1">
                  Please try again or contact support if the issue persists.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return <>{renderStatus(activeTab)}</>;
};
