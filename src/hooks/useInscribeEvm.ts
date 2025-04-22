import { inscriptionAbi } from "@/abi/inscriptionAbi";
import { inscriptionFsmStore } from "@/store/inscriptionFsmStore";
import { useEffect } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const Sepolia_Contract = "0xf02e80b7399d3ad11189a109bd64c32eca2b5e36";
const Sepolia_ChainId = 11155111;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useInscribeEvm = () => {
  const { address } = useAccount();
  const send = inscriptionFsmStore((s) => s.send);
  const reset = inscriptionFsmStore((s) => s.reset);

  const {
    writeContract,
    data: hash,
    isPending,
    isError,
    error,
  } = useWriteContract();

  useWaitForTransactionReceipt({
    hash,
    chainId: Sepolia_ChainId,
    query: { enabled: !!hash },
  });

  const startEvmInscription = async (value: number) => {
    reset("evm");

    send("evm", {
      type: "START",
      value,
      walletAddress: address ?? null,
    });

    await wait(1000);

    send("evm", { type: "MESSAGE_PREPARED" });

    await wait(1000);

    writeContract({
      address: Sepolia_Contract,
      abi: inscriptionAbi,
      functionName: "storeMessage",
      args: [BigInt(Math.floor(value))],
    });
  };
  console.log("🟡 isConfirmed", { isPending, hash, error });

  useEffect(() => {
    if (isPending) {
      send("evm", { type: "SIGNED" });

      setTimeout(() => {
        send("evm", { type: "TRANSACTION_SENT" });
      }, 1000); // Optional: delay sending "TRANSACTION_SENT" for effect
    }
  }, [isPending, send]);

  useEffect(() => {
    if (hash) {
      send("evm", { type: "CONFIRMED", txHash: hash });
    }
  }, [hash, send]);

  useEffect(() => {
    if (isError && error) {
      send("evm", { type: "FAILED", error: error.message });
    }
  }, [isError, error, send]);

  return {
    startEvmInscription,
  };
};
