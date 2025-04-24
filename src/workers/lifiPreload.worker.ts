import type { LifiChain, Token } from "@/types";

const CHAIN_API = "https://li.quest/v1/chains?chainTypes=EVM";
const TOKEN_API_BASE = "https://li.quest/v1/tokens";
const SOLANA_TOKEN_API = "https://token.jup.ag/all";

// Fetch supported EVM chains from LI.FI
const fetchChains = async (): Promise<Record<number, LifiChain>> => {
  const res = await fetch(CHAIN_API);
  const json = await res.json();
  const chains: LifiChain[] = json.chains;
  const chainMap: Record<number, LifiChain> = {};
  for (const chain of chains) {
    chainMap[chain.id] = chain;
  }
  return chainMap;
};

// Fetch EVM tokens from LI.FI + Solana tokens from Jupiter
const fetchTokens = async (
  chainMap: Record<number, LifiChain>
): Promise<{
  evmTokenMap: Record<string, Token>;
  solanaTokenMap: Record<string, Token>;
}> => {
  const chainIds = Object.keys(chainMap).join(",");
  const TOKEN_API = `${TOKEN_API_BASE}?chainTypes=EVM&chains=${chainIds}&minPriceUSD=0.01`;

  const [evmRes, solanaRes] = await Promise.all([
    fetch(TOKEN_API),
    fetch(SOLANA_TOKEN_API),
  ]);

  const evmJson = await evmRes.json();
  const solanaJson = await solanaRes.json();

  const evmTokenMap: Record<string, Token> = {};
  const solanaTokenMap: Record<string, Token> = {};

  // Map EVM tokens
  for (const [chainIdStr, tokenList] of Object.entries(evmJson.tokens)) {
    const chainId = Number(chainIdStr);
    const chain = chainMap[chainId];
    for (const token of tokenList as Token[]) {
      const key = `${chainId}:${token.address?.toLowerCase() ?? "native"}`;

      evmTokenMap[key] = {
        ...token,
        chainId,
        symbol: token.symbol,
        decimals: token.decimals,
        priceUSD: token.priceUSD ? parseFloat(token.priceUSD.toString()) : 0,
        isMyBalance: false,
        balanceUSD: 0,
        balanceRaw: 0n,
        balanceFormatted: "0",
        chainName: chain?.name,
        chainLogo: chain?.logoURI,
        isNative: !token.address,
        type: !token.address ? "native" : "erc20",
      };
    }
  }

  for (const token of solanaJson) {
    const address = token.address?.toLowerCase?.();
    const key = `101:${address}`;

    solanaTokenMap[key] = {
      chainId: 101,
      address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.logoURI,
      chainName: "Solana",
      coinKey: token.symbol,
      priceUSD: token.extensions?.coingeckoId ? 0 : 0,
      isMyBalance: false,
      balanceUSD: 0,
      balanceRaw: 0n,
      balanceFormatted: "0",
      isNative: token.symbol === "SOL",
      type: "spl",
    };
  }

  return { evmTokenMap, solanaTokenMap };
};

// Web worker entrypoint
self.onmessage = async () => {
  try {
    const chainMap = await fetchChains();
    const { evmTokenMap, solanaTokenMap } = await fetchTokens(chainMap);
    const chains = Object.values(chainMap);

    self.postMessage({
      type: "success",
      payload: { evmTokenMap, solanaTokenMap, chains },
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      payload: err instanceof Error ? err.message : err,
    });
  }
};
