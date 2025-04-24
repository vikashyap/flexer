import { Button } from "@/components/base/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { lazy, Suspense, useState } from "react";
import { useAccount } from "wagmi";

const DialogInc = lazy(() => import("./dialog"));

export default function InscriptionButton() {
  const [open, setOpen] = useState(false);
  const { isConnected } = useAccount();
  const { connect } = useWallet();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
        disabled={!isConnected && !connect}
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
