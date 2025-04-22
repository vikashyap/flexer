import { Button } from "@/components/base/button";
import { useWalletStore } from "@/store/walletStore";
import { lazy, Suspense, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const DialogInc = lazy(() => import("./dialog"));

export default function InscriptionButton() {
  const [open, setOpen] = useState(false);
  const { evmWalletAccount, solanaWallet } = useWalletStore(
    useShallow((state) => ({
      evmWalletAccount: state.evmWalletAccount,
      solanaWallet: state.solanaWallet,
    }))
  );

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
        disabled={!evmWalletAccount && !solanaWallet}
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
