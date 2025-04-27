// store/inscriptionFsmStore.ts
import {
  Context,
  Event,
  inscriptionMachine,
  State,
  Transition,
} from "@/lib/inscription";
import { create } from "zustand";

type WalletType = "evm" | "solana";

interface FsmData {
  state: State;
  context: Context;
}

interface InscriptionFsmStore {
  fsms: Record<WalletType, FsmData>;
  send: (wallet: WalletType, event: Event) => void;
  reset: (wallet: WalletType) => void;
}

export const useInscriptionFsmStore = create<InscriptionFsmStore>(
  (set, get) => ({
    fsms: {
      evm: {
        state: inscriptionMachine.initialState,
        context: inscriptionMachine.initialContext,
      },
      solana: {
        state: inscriptionMachine.initialState,
        context: inscriptionMachine.initialContext,
      },
    },

    send: (wallet, event) => {
      const current = get().fsms[wallet];
      const transitionFn = (
        inscriptionMachine.transitions[current.state] as Record<
          Event["type"],
          (context: Context, event: Event) => Transition
        >
      )?.[event.type];

      if (!transitionFn) {
        console.warn(`No transition for ${wallet} on event "${event.type}"`);
        return;
      }

      const { state, context } = transitionFn(current.context, event);
      set((prev) => ({
        fsms: {
          ...prev.fsms,
          [wallet]: { state, context },
        },
      }));
    },

    reset: (wallet) =>
      set((prev) => ({
        fsms: {
          ...prev.fsms,
          [wallet]: {
            state: inscriptionMachine.initialState,
            context: inscriptionMachine.initialContext,
          },
        },
      })),
  })
);
