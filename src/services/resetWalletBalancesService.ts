import { Token } from "@/types";

export const resetWalletBalances = ({
  tokenMap,
  topTokenMap,
  setEvmTokenMap,
  setEvmTopTokenMap,
  setEvmTotalUSD,
}: {
  tokenMap: Record<string, Token>;
  topTokenMap: Record<string, Token>;
  setEvmTokenMap: (map: Record<string, Token>) => void;
  setEvmTopTokenMap: (map: Record<string, Token>) => void;
  setEvmTotalUSD: (value: number) => void;
}) => {
  const cleanedMap: Record<string, Token> = { ...tokenMap };

  Object.entries(topTokenMap).forEach(([key, token]) => {
    cleanedMap[key] = {
      ...token,
      isMyBalance: false,
      balanceRaw: 0n,
      balanceUSD: 0,
      balanceFormatted: "0",
    };
  });

  setEvmTokenMap(cleanedMap);
  setEvmTopTokenMap({});
  setEvmTotalUSD(0);
};
