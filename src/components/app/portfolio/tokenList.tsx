import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/base/card";
import EmptyToken from "@/components/base/emptyBlock";
import { formatCurrency } from "@/lib/utils";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Coins, Network } from "lucide-react";
import { useMemo, useRef } from "react";
import { formatEther } from "viem";
import { useShallow } from "zustand/react/shallow";

export const Tokens = () => {
  const renderCount = useRef(0);
  renderCount.current++;
  const isEvmConnected = useWalletConnectionStore(
    (state) => state.isEvmConnected
  );
  const isSolanaConnected = useWalletConnectionStore(
    (state) => state.isSolanaConnected
  );

  console.log("🔁 Token List Render:", renderCount.current);
  return isSolanaConnected || isEvmConnected ? <TokenList /> : <EmptyToken />;
};

export function TokenList() {
  const { topTokenMap, solanaTopTokenMap } = usePortfolioStore(
    useShallow((state) => ({
      topTokenMap: state.evm.topTokenMap,
      solanaTopTokenMap: state.solana.topTokenMap,
    }))
  );

  const sortedTokens = useMemo(() => {
    return Object.entries({ ...topTokenMap, ...solanaTopTokenMap }).sort(
      ([, a], [, b]) => (b.balanceUSD ?? 0) - (a.balanceUSD ?? 0)
    );
  }, [topTokenMap, solanaTopTokenMap]);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: sortedTokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();

  const gridCols =
    "grid-cols-[minmax(200px,1fr)_minmax(140px,1fr)_minmax(100px,1fr)_minmax(120px,1fr)]";

  return (
    <Card className="w-full shadow-lg border border-purple-200 bg-white">
      <CardHeader>
        <CardTitle>Your Token Balances</CardTitle>
        <CardDescription>
          View all your tokens across connected wallets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md overflow-hidden">
          <div
            className={`grid ${gridCols} text-md font-medium sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2`}
          >
            <div className="text-left pl-2">Token</div>
            <div className=" text-left hidden sm:block pl-2">Chain</div>
            <div className="text-right hidden sm:block">Balance</div>
            <div className="text-right">Value (USD)</div>
          </div>

          <div ref={parentRef} className="overflow-auto max-h-[500px] relative">
            <div style={{ height: totalHeight, position: "relative" }}>
              {virtualRows.map((virtualRow) => {
                const index = virtualRow.index;
                const [key, token] = sortedTokens[index] ?? [];
                if (!token) return null;

                return (
                  <div
                    key={key}
                    className={`grid ${gridCols} items-center px-4 py-3 text-sm border-b border-gray-100`}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: virtualRow.size,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {token.logoURI ? (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <Coins className="w-6 h-6 text-yellow-400" />
                      )}
                      <div className="flex flex-col min-w-0 items-start">
                        <div className="truncate">{token.symbol}</div>
                        <div className="truncate text-xs text-gray-400">
                          {token.name}
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      {token.chainLogo ? (
                        <img
                          src={token.chainLogo}
                          alt={token.chainName}
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <Network className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="truncate">{token.chainName}</span>
                    </div>

                    <div className="text-right hidden sm:block">
                      {formatEther(token.balanceRaw ?? 0n)}
                    </div>

                    <div className="text-right">
                      {formatCurrency(token.balanceUSD ?? 0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
