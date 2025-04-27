import { LifiChain, Token } from "@/types";

export const MOCK_CHAINS: LifiChain[] = [
  {
    id: 1,
    name: "Ethereum",
    key: "ethereum",
    chainType: "EVM",
    coin: "ETH",
    mainnet: true,
    relayerSupported: false,
    nativeToken: {
      address: "0x0000000000000000000000000000000000000000",
      chainId: 1,
      symbol: "ETH",
      name: "Ether",
      coinKey: "ETH",
      decimals: 18,
      priceUSD: "3000",
      logoURI: "https://dummy-logo.eth.png",
    },
    logoURI: "https://dummy-chain-logo.png",
    metamask: {
      chainId: "0x1",
      rpcUrls: ["https://mock-rpc-url"],
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      chainName: "Ethereum Mainnet",
      blockExplorerUrls: ["https://etherscan.io"],
    },
    multicallAddress: "0x1234567890abcdef1234567890abcdef12345678",
  },
];

export const MOCK_TOKEN_MAP: Record<string, Token> = {
  "1:native": {
    chainId: 1,
    symbol: "ETH",
    name: "Ether",
    priceUSD: 3000,
    decimals: 18,
    logoURI: "", // 👈 added
  },
  "1:0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": {
    chainId: 1,
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    symbol: "MOCK",
    name: "Mock Token",
    priceUSD: 1,
    decimals: 18,
    logoURI: "",
  },
};

export const MOCK_SOLANA_TOKEN_MAP: Record<string, Token> = {
  "solana:native": {
    chainId: 101,
    address: "native",
    symbol: "SOL",
    name: "Solana",
    priceUSD: 150,
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  "solana:mintTop": {
    chainId: 101,
    address: "mintTop",
    symbol: "TOPSOL",
    name: "TopSolanaToken",
    priceUSD: 8,
    decimals: 9,
    logoURI: "https://dummy-topsol-logo.png",
  },
};

export const MOCK_SOLANA_TOP_TOKEN: Record<string, Token> = {
  "solana:native": {
    chainId: 101,
    symbol: "SOL",
    name: "Solana",
    priceUSD: 150,
    decimals: 9,
    logoURI: "https://dummy-sol-logo.png",
  },
  "solana:mocktokenmintaddress": {
    chainId: 101,
    address: "MockTokenMintAddress",
    symbol: "MOCK",
    name: "Mock Token",
    priceUSD: 2,
    decimals: 6,
    logoURI: "https://dummy-token-logo.png",
  },
};
