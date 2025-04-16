import type { LifiChain, Token } from "@/types";
import {
  createPublicClient,
  defineChain,
  erc20Abi,
  formatUnits,
  http,
} from "viem";

interface SyncOptions {
  address: `0x${string}`;
  chains: LifiChain[];
  tokenMap: Record<string, Token>;
  setEvmTokenMap: (map: Record<string, Token>) => void;
  setEvmTopTokenMap: (map: Record<string, Token>) => void;
  setEvmTotalUSD: (value: number) => void;
}

const BATCH_SIZE = 200;

export const syncWalletBalances = async ({
  address,
  chains,
  tokenMap,
  setEvmTokenMap,
  setEvmTopTokenMap,
  setEvmTotalUSD,
}: SyncOptions) => {
  const replaceData: Record<string, Token> = {};
  const topTokens: Record<string, Token> = {};

  const validChains = chains.filter(
    (chain) => chain.metamask?.rpcUrls?.length && chain.multicallAddress
  );

  const chainTasks = validChains.map(async (chain) => {
    let client = null;

    for (const url of chain.metamask!.rpcUrls) {
      try {
        const customChain = defineChain({
          id: chain.id,
          name: chain.name,
          nativeCurrency: chain.metamask!.nativeCurrency,
          rpcUrls: {
            default: { http: [url] },
            public: { http: [url] },
          },
          blockExplorers: {
            default: {
              name: chain.metamask!.chainName,
              url: chain.metamask!.blockExplorerUrls[0],
            },
          },
          contracts: {
            multicall3: {
              address: chain.multicallAddress as `0x${string}`,
              blockCreated: 0,
            },
          },
        });

        client = createPublicClient({
          chain: customChain,
          transport: http(url, { timeout: 7000 }),
        });

        const nativeBalance = await client.getBalance({ address });
        const formatted = formatUnits(
          nativeBalance,
          chain.nativeToken.decimals
        );
        const priceUSD = parseFloat(chain.nativeToken.priceUSD) || 0;
        const balanceUSD = parseFloat(formatted) * priceUSD;
        const key = `${chain.id}:native`;

        const updatedToken = {
          ...tokenMap[key],
          symbol:
            chain.nativeToken.symbol ?? tokenMap[key]?.symbol ?? "UNKNOWN",
          name:
            chain.nativeToken.name ?? tokenMap[key]?.name ?? "Unknown Token",
          chainName: chain.name ?? tokenMap[key]?.chainName ?? "Unknown Chain",
          isMyBalance: true,
          balanceRaw: nativeBalance,
          balanceFormatted: formatted,
          balanceUSD,
        };

        replaceData[key] = updatedToken;
        topTokens[key] = updatedToken;

        break;
      } catch (err) {
        console.warn(`RPC failed on ${url}, trying next...`, err);
      }
    }

    if (!client) {
      console.warn(`All RPCs failed for ${chain.name}, skipping...`);
      return;
    }

    const tokensOnChain = Object.values(tokenMap).filter(
      (t) => t.chainId === chain.id && !!t.address
    );

    for (let i = 0; i < tokensOnChain.length; i += BATCH_SIZE) {
      const batch = tokensOnChain.slice(i, i + BATCH_SIZE);

      const calls = batch.map((token) => ({
        abi: erc20Abi,
        address: token.address as `0x${string}`,
        functionName: "balanceOf",
        args: [address],
      }));

      try {
        const results = await client.multicall({ contracts: calls });

        results.forEach((res, j) => {
          const result = res?.result as bigint;
          if (res.status === "success" && result > 0n) {
            const token = batch[j];
            const formatted = formatUnits(result, token.decimals);
            const priceUSD = parseFloat(String(token.priceUSD)) || 0;
            const balanceUSD = parseFloat(formatted) * priceUSD;
            const key = `${token.chainId}:${token.address?.toLowerCase()}`;

            const updatedToken = {
              ...tokenMap[key],
              symbol: token.symbol ?? tokenMap[key]?.symbol ?? "UNKNOWN",
              name: token.name ?? tokenMap[key]?.name ?? "Unknown Token",
              chainName:
                chain.name ?? tokenMap[key]?.chainName ?? "Unknown Chain",
              isMyBalance: true,
              balanceRaw: result,
              balanceFormatted: formatted,
              balanceUSD,
            };

            replaceData[key] = updatedToken;
            topTokens[key] = updatedToken;
          }
        });
      } catch (err) {
        console.warn(`Multicall batch failed for chain ${chain.name}`, err);
      }
    }
  });

  await Promise.allSettled(chainTasks);

  console.time("Merging token balances");
  const mergedMap: Record<string, Token> = {};
  for (const key in tokenMap) {
    if (!replaceData[key]) {
      mergedMap[key] = tokenMap[key];
    }
  }
  for (const key in replaceData) {
    mergedMap[key] = replaceData[key];
  }
  console.timeEnd("Merging token balances");

  const sortedTopTokens = Object.entries(topTokens)
    .sort(([, a], [, b]) => (b.balanceUSD ?? 0) - (a.balanceUSD ?? 0))
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {} as Record<string, Token>);

  console.log(
    `✅ Updated ${Object.keys(replaceData).length} token balances out of ${
      Object.keys(tokenMap).length
    } total tokens.`
  );

  const finalTotalUSD = Object.values(topTokens).reduce(
    (sum, token) => sum + (token.balanceUSD ?? 0),
    0
  );
  setEvmTotalUSD(finalTotalUSD);

  setEvmTokenMap(mergedMap);

  setEvmTopTokenMap(sortedTopTokens);
};
