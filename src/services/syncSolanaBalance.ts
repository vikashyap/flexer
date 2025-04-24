import type { Token } from "@/types";
import { Connection, PublicKey } from "@solana/web3.js";

interface SolanaTokenWithMetadata extends Token {
  isMyBalance: true;
  balanceRaw: bigint;
  balanceFormatted: string;
  balanceUSD: number;
}

interface SyncOptions {
  address: string;
  solanaTokenMap: Record<string, Token>;
  setSolanaTopTokenMap: (map: Record<string, Token>) => void;
  setSolanaTotalUSD: (value: number) => void;
  connection: Connection;
}

export const syncSolanaBalance = async ({
  address,
  solanaTokenMap,
  setSolanaTopTokenMap,
  setSolanaTotalUSD,
  connection,
}: SyncOptions): Promise<Record<string, SolanaTokenWithMetadata>> => {
  const result: Record<string, SolanaTokenWithMetadata> = {};
  const pubkey = new PublicKey(address);

  // Index tokens by lowercase address for faster lookup
  const tokenMapByAddress = new Map<string, [string, Token]>();
  for (const [key, token] of Object.entries(solanaTokenMap)) {
    if (token.address) {
      tokenMapByAddress.set(token.address.toLowerCase(), [key, token]);
    }
  }

  try {
    //  Native SOL
    const lamports = await connection.getBalance(pubkey);
    const formatted = lamports / 1e9;
    const balanceUSD = 150 * formatted;
    if (formatted > 0) {
      result["solana:native"] = {
        symbol: "SOL",
        name: "Solana",
        address: "native",
        chainId: 101,
        isNative: true,
        type: "native",
        isMyBalance: true,
        balanceRaw: BigInt(lamports),
        balanceFormatted: formatted.toString(),
        balanceUSD,
        chainName: "Solana",
        chainLogo:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png", // or Jupiter logo if available
        logoURI:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        decimals: 9,
      };
    }

    //  SPL Tokens
    const parsed = await connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    for (const { account } of parsed.value) {
      const info = account.data.parsed.info;
      const mint = info.mint.toLowerCase();
      const amount = info.tokenAmount;

      if (!amount || parseFloat(amount.uiAmountString) === 0) continue;
      const entry = tokenMapByAddress.get(mint);
      if (!entry) continue;

      const [key, token] = entry;
      const priceUSD = parseFloat(String(token.priceUSD)) || 150;
      const balanceUSD = parseFloat(amount.uiAmountString) * priceUSD;

      result[key] = {
        ...token,
        isMyBalance: true,
        balanceRaw: BigInt(amount.amount),
        balanceFormatted: amount.uiAmountString,
        balanceUSD,
        chainLogo: token.chainLogo ?? token.logoURI,
      };
    }
    const finalTotalUSD = Object.values(result).reduce(
      (sum, token) => sum + (token.balanceUSD ?? 0),
      0
    );
    setSolanaTopTokenMap(result);
    setSolanaTotalUSD(finalTotalUSD);
  } catch (e) {
    console.warn("🔁 Failed to fetch Solana balances:", e);
  }
  console.log(result);
  return result;
};
