import { Address } from "viem";

export type State =
  | "idle"
  | "preparing"
  | "waitingForSignature"
  | "sending"
  | "waitingForConfirmation"
  | "success"
  | "error";

export type Event =
  | {
      type: "START";
      value: number;
      walletAddress: string | Address | undefined | null;
    }
  | { type: "MESSAGE_PREPARED" }
  | { type: "SIGNED" }
  | { type: "TRANSACTION_SENT" }
  | { type: "CONFIRMED"; txHash: string }
  | { type: "FAILED"; error: string };

export interface Context {
  value: number;
  walletAddress: string | Address | undefined | null;
  txHash?: string;
  error?: string;
}

export interface Transition {
  state: State;
  context: Context;
}

export const inscriptionMachine = {
  initialState: "idle" as State,
  initialContext: {
    value: 0,
    walletAddress: null,
  } as Context,

  transitions: {
    idle: {
      START: (context: Context, event: Event): Transition => ({
        state: "preparing",
        context: {
          ...context,
          value: event.type === "START" ? event.value : context.value,
          walletAddress:
            event.type === "START"
              ? event.walletAddress
              : context.walletAddress,
        },
      }),
    },
    preparing: {
      MESSAGE_PREPARED: (context: Context): Transition => ({
        state: "waitingForSignature",
        context,
      }),
      FAILED: (context: Context, event: Event): Transition => ({
        state: "error",
        context: {
          ...context,
          error: event.type === "FAILED" ? event.error : undefined,
        },
      }),
    },
    waitingForSignature: {
      SIGNED: (context: Context): Transition => ({
        state: "sending",
        context,
      }),
      FAILED: (context: Context, event: Event): Transition => {
        if (event.type === "FAILED") {
          return {
            state: "error",
            context: {
              ...context,
              error: event.type === "FAILED" ? event.error : undefined,
            },
          };
        }
        throw new Error("Invalid event type for FAILED transition");
      },
    },
    sending: {
      TRANSACTION_SENT: (context: Context): Transition => ({
        state: "waitingForConfirmation",
        context,
      }),
      FAILED: (context: Context, event: Event): Transition => ({
        state: "error",
        context: {
          ...context,
          error: event.type === "FAILED" ? event.error : undefined,
        },
      }),
    },
    waitingForConfirmation: {
      CONFIRMED: (context: Context, event: Event): Transition => ({
        state: "success",
        context: {
          ...context,
          txHash: event.type === "CONFIRMED" ? event.txHash : undefined,
        },
      }),
      FAILED: (context: Context, event: Event): Transition => ({
        state: "error",
        context: {
          ...context,
          error: event.type === "FAILED" ? event.error : undefined,
        },
      }),
    },
    success: {},
    error: {},
  },
};

export const createFsm = (machine: typeof inscriptionMachine) => {
  let currentState = machine.initialState;
  let currentContext = machine.initialContext;

  const send = (event: Event) => {
    const stateTransitions = machine.transitions[currentState];
    if (!stateTransitions || !(event.type in stateTransitions)) {
      console.warn(
        `No transition defined for ${currentState} and event ${event.type}`
      );
      return;
    }

    const transitionFn = stateTransitions[
      event.type as keyof typeof stateTransitions
    ] as (context: Context, event: Event) => Transition;
    const { state: newState, context: newContext } = transitionFn(
      currentContext,
      event
    );

    currentState = newState;
    currentContext = newContext;
  };

  const getState = () => currentState;
  const getContext = () => currentContext;
  const reset = () => {
    currentState = machine.initialState;
    currentContext = machine.initialContext;
  };

  return {
    send,
    getState,
    getContext,
    reset,
  };
};
