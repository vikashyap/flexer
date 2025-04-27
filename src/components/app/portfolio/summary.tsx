"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/card";
import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import React, { useRef } from "react";
import InscriptionButton from "../inscription/button";
import { PortfolioBalance } from "./balance";
import { ChainBadge } from "./chainBadge";

const PortfolioSummary = React.memo(function PortfolioSummary() {
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 PortfolioSummary Render Count:", renderCount.current);

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Your Portfolio Value</span>
          <ChainBadge />
        </CardTitle>
        <CardDescription>
          <WalletConnectionMessage />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PortfolioBalance />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <InscriptionButton />
      </CardFooter>
    </Card>
  );
});

export default PortfolioSummary;

const WalletConnectionMessage = React.memo(function WalletConnectionMessage() {
  const isWalletConnected = useWalletConnectionStore(
    (state) => state.isWalletConnected
  );
  console.log("🔁 isWalletConnected:", isWalletConnected);
  return (
    <>
      {!isWalletConnected ? (
        <span>Connect your EVM or Solana Wallet to see the balance</span>
      ) : (
        <span>Total value of all your tokens across connected wallets</span>
      )}
    </>
  );
});
