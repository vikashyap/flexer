import { LifiChain, Token } from "@/types";

const CHAIN_API = "https://li.quest/v1/chains?chainTypes=EVM";
const TOKEN_API_BASE = "https://li.quest/v1/tokens";

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

const fetchTokens = async (
  chainMap: Record<number, LifiChain>
): Promise<{
  tokenMap: Record<string, Token>;
  topTokenMap: Record<string, Token>;
}> => {
  const chainIds = Object.keys(chainMap).join(",");
  const TOKEN_API = `${TOKEN_API_BASE}?chainTypes=EVM&chains=${chainIds}&minPriceUSD=0.01`;

  const res = await fetch(TOKEN_API);
  const json = await res.json();
  const entries = Object.entries(json.tokens);

  const tokenMap: Record<string, Token> = {};
  const topTokenMap: Record<string, Token> = {}; // to be populated later

  for (const [chainIdStr, tokenList] of entries) {
    const chainId = Number(chainIdStr);
    const chain = chainMap[chainId];
    for (const token of tokenList as Token[]) {
      const key = `${chainId}:${token.address?.toLowerCase() ?? "native"}`;

      const tokenObj: Token = {
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

      tokenMap[key] = tokenObj;
    }
  }

  return { tokenMap, topTokenMap };
};

self.onmessage = async () => {
  try {
    const chainMap = await fetchChains();
    const { tokenMap, topTokenMap } = await fetchTokens(chainMap);
    const chains = Object.values(chainMap);

    self.postMessage({
      type: "success",
      payload: { tokenMap, topTokenMap, chains },
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      payload: err instanceof Error ? err.message : err,
    });
  }
};
