import { inscriptionFsmStore } from "@/store/inscriptionFsmStore";
import { createMemoInstruction } from "@solana/spl-memo";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction } from "@solana/web3.js";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useInscribeSolana = () => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const send = inscriptionFsmStore((s) => s.send);
  const reset = inscriptionFsmStore((s) => s.reset);

  const startSolanaInscription = async (value: number) => {
    if (!connected || !publicKey || !sendTransaction) {
      console.error("❌ No connected Solana wallet or sendTransaction method");
      return;
    }

    try {
      reset("solana");

      send("solana", {
        type: "START",
        value,
        walletAddress: publicKey.toBase58(),
      });

      await wait(1000);
      send("solana", { type: "MESSAGE_PREPARED" });

      const memoMessage = `USD Value: $${value.toFixed(2)}`;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: 0,
        }),
        createMemoInstruction(memoMessage, [publicKey])
      );

      send("solana", { type: "SIGNED" });

      const signature = await sendTransaction(transaction, connection);

      send("solana", { type: "TRANSACTION_SENT" });

      await connection.confirmTransaction(signature, "confirmed");

      send("solana", {
        type: "CONFIRMED",
        txHash: signature,
      });
    } catch (error) {
      send("solana", {
        type: "FAILED",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return {
    startSolanaInscription,
  };
};
