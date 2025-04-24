export interface LifiChain {
  key: string;
  chainType: "EVM" | "SVM";
  name: string;
  coin: string;
  id: number;
  mainnet: boolean;
  logoURI: string;
  tokenlistUrl?: string;
  multicallAddress?: string;
  relayerSupported: boolean;
  diamondAddress?: string;
  permit2?: string;
  permit2Proxy?: string;
  metamask?: {
    chainId: string;
    blockExplorerUrls: string[];
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
  };
  nativeToken: {
    address: string;
    chainId: number;
    symbol: string;
    decimals: number;
    name: string;
    coinKey: string;
    logoURI: string;
    priceUSD: string;
  };
}
export interface SolanaChain {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
}

export interface Token {
  name: string;
  address?: string;
  logoURI: string;
  chainId: number;
  symbol: string;
  decimals: number;
  priceUSD?: number;
  isMyBalance?: boolean;
  balanceRaw?: bigint;
  balanceFormatted?: string;
  balanceUSD?: number;
  chainName?: string;
  chainLogo?: string;
  isNative?: boolean;
  coinKey?: string;
  type?: "native" | "erc20" | "spl";
}

export interface PortfolioResult {
  tokenMap: Record<string, Token>;
  totalUSD: number;
}
