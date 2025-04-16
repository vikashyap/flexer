"use client";

import { Button } from "@/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/card";
import { useRef } from "react";
import { PortfolioBalance } from "./balance";

export default function PortfolioSummary() {
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 PortfolioSummary Render Count:", renderCount.current);

  const isLoading = false;
  const activeChain = "evm"; // Replace with your logic to get the active chain
  const setActiveChain = (chain: string) => {
    // Replace with your logic to set the active chain
    console.log("Active chain set to:", chain);
  };
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Your Portfolio Value</span>
        </CardTitle>
        <CardDescription>
          Total value of all your tokens across connected wallets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PortfolioBalance />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex gap-2 w-full">
          <Button
            variant={activeChain === "evm" ? "default" : "outline"}
            className={
              activeChain === "evm"
                ? "flex-1 bg-purple-600 hover:bg-purple-700"
                : "flex-1"
            }
            onClick={() => setActiveChain("evm")}
            disabled={false}
          >
            EVM
          </Button>
          <Button
            variant={isLoading ? "default" : "outline"}
            className={
              isLoading ? "flex-1 bg-purple-600 hover:bg-purple-700" : "flex-1"
            }
            onClick={() => setActiveChain("solana")}
            disabled={false}
          >
            Solana
          </Button>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={true}
          onClick={() => {}}
        >
          <>Inscribe Value On-Chain</>
        </Button>
      </CardFooter>
    </Card>
  );
}
