import { Button } from "@/components/base/button";
import { WalletIcon } from "lucide-react";
import React, { lazy, Suspense, useCallback, useRef, useState } from "react";
import { ConnectedWalletsCount } from "./connectedWalletsCount";

const WalletDialog = lazy(() => import("./dialog"));

export function WalletConnector() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 WalletConnector render:", renderCount.current);

  return (
    <div className="flex justify-center mb-6 flex-col items-center">
      <WalletConnectButton onClick={openDialog} />

      {isDialogOpen && (
        <Suspense
          fallback={
            <div className="text-sm text-gray-500">
              Loading wallet options...
            </div>
          }
        >
          <WalletDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </Suspense>
      )}
    </div>
  );
}

const WalletConnectButton = React.memo(function WalletConnectButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("🔁 WalletConnectButton render:", renderCount.current);

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 rounded-full px-4 py-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
      onClick={onClick}
    >
      <WalletIcon className="h-4 w-4 text-purple-500" />
      <ConnectedWalletsCount />
    </Button>
  );
});
