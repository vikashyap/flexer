"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/base/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/base/table";
import { usePreloadLifiData } from "@/hooks/usePreloadLifiData";
import { useWalletPortfolioSync } from "@/hooks/useWalletPortfolioSync";
import { formatCurrency } from "@/lib/utils";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Token } from "@/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Network } from "lucide-react";
import { memo, useMemo, useRef } from "react";
import { formatEther } from "viem";
import { useShallow } from "zustand/react/shallow";

export const Tokens = () => {
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 Your Token Balances Render Count:", renderCount.current);
  return <TokenList />;
};

const TokenRow = memo(
  ({ token, height }: { token: Token; height: number }) => {
    return (
      <TableRow style={{ height }} className="border-violet-300">
        <TableCell className="font-medium py-3">
          <div className="flex items-center gap-2 min-w-0">
            {token.logoURI ? (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-6 h-6 rounded-full flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                {token.symbol.substring(0, 1)}
              </div>
            )}
            <div className="truncate">{token.symbol}</div>
          </div>
        </TableCell>
        <TableCell className="py-3 hidden sm:block">
          <div className="flex items-center gap-2 min-w-0">
            {token.chainLogo ? (
              <img
                src={token.chainLogo}
                alt={token.chainName}
                className="w-4 h-4 rounded-full flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ) : (
              <Network className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="truncate">{token.chainName}</span>
          </div>
        </TableCell>
        <TableCell className="text-right py-3">
          {formatEther(token.balanceRaw ?? 0n)}
        </TableCell>
        <TableCell className="text-right py-3">
          {formatCurrency(token.balanceUSD ?? 0)}
        </TableCell>
      </TableRow>
    );
  },
  (prev, next) => {
    return (
      prev.token.balanceUSD === next.token.balanceUSD &&
      prev.token.balanceRaw === next.token.balanceRaw &&
      prev.height === next.height
    );
  }
);

export function TokenList() {
  usePreloadLifiData();
  useWalletPortfolioSync();

  const { topTokenMap } = usePortfolioStore(
    useShallow((state) => ({
      topTokenMap: state.evm.topTokenMap,
    }))
  );

  const sortedTokens = useMemo(() => {
    const sortedTop = Object.entries(topTokenMap).sort(
      ([, a], [, b]) => (b.balanceUSD ?? 0) - (a.balanceUSD ?? 0)
    );
    return [...sortedTop];
  }, [topTokenMap]);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: sortedTokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();

  return (
    <Card className="w-full shadow-lg border border-purple-200 bg-white">
      <CardHeader>
        <CardTitle>Your Token Balances</CardTitle>
        <CardDescription>
          View all your tokens across connected wallets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md">
          <div ref={parentRef} className="overflow-auto max-h-[500px]">
            <Table className="w-full table-auto text-sm sm:text-base">
              <TableHeader>
                <TableRow className="border-violet-300">
                  <TableHead>Token</TableHead>
                  <TableHead className="hidden sm:block">Chain</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Value (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <tr style={{ height: `${virtualRows[0]?.start ?? 0}px` }} />
                {virtualRows.map((virtualRow) => {
                  const [key, token] = sortedTokens[virtualRow.index] ?? [];
                  if (!token) return null;

                  return (
                    <TokenRow
                      key={key}
                      token={token}
                      height={virtualRow.size}
                    />
                  );
                })}
                <tr
                  style={{
                    height: `${totalHeight - (virtualRows.at(-1)?.end ?? 0)}px`,
                  }}
                />
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
