// lib/solana.ts

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export const SOLANA_NETWORK = WalletAdapterNetwork.Devnet;
export const SOLANA_RPC = clusterApiUrl(SOLANA_NETWORK);
export const solanaConnection = new Connection(SOLANA_RPC);
export const solflare = new SolflareWalletAdapter();

export const connectSolanaWallet = async (): Promise<{
  publicKey: PublicKey | null;
}> => {
  if (!solflare.connected) await solflare.connect();
  return { publicKey: solflare.publicKey };
};

export const disconnectSolanaWallet = async () => {
  await solflare.disconnect();
};

export const getSolanaWalletInfo = () => {
  return {
    connected: solflare.connected,
    address: solflare.publicKey,
  };
};
