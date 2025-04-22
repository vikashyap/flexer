export const inscriptionAbi = [
  {
    type: "function",
    name: "storeMessage",
    stateMutability: "nonpayable",
    inputs: [{ name: "value", type: "uint256" }],
    outputs: [],
  },
  {
    type: "event",
    name: "Inscribed",
    inputs: [
      { name: "user", type: "address", typeIndexed: true },
      { name: "value", type: "uint256", typeIndexed: false },
    ],
    anonymous: false,
  },
] as const;
