"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  DollarSign,
  Loader2,
  PiggyBank,
  Wallet,
} from "lucide-react";

export default function LoadingOverlay() {
  const isPorfolioLoading = usePortfolioStore(
    (state) => state.isPortfolioLoading
  );
  if (!isPorfolioLoading) return null;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 absolute inset-0 z-50">
      <AnimatePresence>
        {isPorfolioLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/10 backdrop-blur-sm z-[-50] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border rounded-xl shadow-lg p-8 max-w-md w-full text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Center spinner */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="text-primary"
                  >
                    <Loader2 size={48} className="stroke-primary" />
                  </motion.div>

                  {/* Orbiting icons */}
                  <div className="absolute inset-0">
                    <motion.div
                      className="absolute"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="absolute"
                        style={{ left: "70px", top: "-10px" }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <DollarSign className="h-8 w-8 text-green-500" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="absolute"
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="absolute"
                        style={{ right: "70px", top: "-10px" }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: 0.5,
                        }}
                      >
                        <BarChart3 className="h-8 w-8 text-blue-500" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="absolute"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 12,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="absolute"
                        style={{ left: "30px", bottom: "-20px" }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: 1,
                        }}
                      >
                        <PiggyBank className="h-8 w-8 text-purple-500" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="absolute"
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        duration: 9,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="absolute"
                        style={{ right: "30px", bottom: "-20px" }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2.2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: 1.5,
                        }}
                      >
                        <Wallet className="h-8 w-8 text-amber-500" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">
                Your balances are loading
              </h3>
              <p className="text-muted-foreground mb-4">
                Please hang on while we fetch your latest financial data. This
                may take a moment.
              </p>

              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "easeInOut" }}
                className="h-1.5 bg-primary rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
