"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/base/card";
import { motion, useAnimation } from "framer-motion";
import { Coins, Search } from "lucide-react";
import { useEffect } from "react";

export default function EmptyToken() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  return (
    <div className="w-full max-w-full  ">
      <Card className="w-full   border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 bg-white shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Your Token Balances
          </CardTitle>
          <CardDescription className="text-gray-500">
            View all your tokens across connected wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-100 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="relative bg-white p-6 rounded-full border border-purple-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                animate={controls}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 5,
                    ease: "easeInOut",
                  }}
                >
                  <Coins className="h-12 w-12 text-purple-500" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4 max-w-md text-center"
            >
              <h3 className="text-xl font-bold text-gray-800">
                No Tokens Found
              </h3>
              <p className="text-gray-500 text-sm">
                Your token list is currently empty. Tokens will appear here once
                they're available in your portfolio.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center gap-2 text-xs text-gray-400"
            >
              <Search className="h-3 w-3" />
              <span>Tokens will automatically appear when detected</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
