import { Button } from "@/components/base/button";
import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { lazy, Suspense, useState } from "react";

const DialogInc = lazy(() => import("./dialog"));

export default function InscriptionButton() {
  const [open, setOpen] = useState(false);
  const isEvmConnected = useWalletConnectionStore(
    (state) => state.isEvmConnected
  );
  const isSolanaConnected = useWalletConnectionStore(
    (state) => state.isSolanaConnected
  );

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
        disabled={!isEvmConnected && !isSolanaConnected}
      >
        Flex On-Chain
      </Button>

      {open && (
        <Suspense
          fallback={<div className="text-sm text-gray-500 ">Loading ...</div>}
        >
          <DialogInc open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  );
}
