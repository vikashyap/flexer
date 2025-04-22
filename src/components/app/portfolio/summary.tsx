"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/card";
import { useRef } from "react";
import InscriptionButton from "../inscription/button";
import { PortfolioBalance } from "./balance";

export default function PortfolioSummary() {
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 PortfolioSummary Render Count:", renderCount.current);

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
        <InscriptionButton />
      </CardFooter>
    </Card>
  );
}
