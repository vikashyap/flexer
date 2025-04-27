import { inscriptionMachine } from "@/lib/inscription";
import { useInscriptionFsmStore } from "@/store/inscriptionFsmStore";
import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("useInscriptionFsmStore", () => {
  beforeEach(() => {
    // Reset FSMs before each test
    act(() => {
      useInscriptionFsmStore.getState().reset("evm");
      useInscriptionFsmStore.getState().reset("solana");
    });
  });

  it("should initialize with idle state and initial context", () => {
    const { fsms } = useInscriptionFsmStore.getState();

    expect(fsms.evm.state).toBe(inscriptionMachine.initialState);
    expect(fsms.solana.state).toBe(inscriptionMachine.initialState);
    expect(fsms.evm.context).toEqual(inscriptionMachine.initialContext);
    expect(fsms.solana.context).toEqual(inscriptionMachine.initialContext);
  });

  it("should transition to preparing state on START event", () => {
    act(() => {
      useInscriptionFsmStore.getState().send("evm", {
        type: "START",
        value: 123,
        walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      });
    });

    const { fsms } = useInscriptionFsmStore.getState();
    expect(fsms.evm.state).toBe("preparing");
    expect(fsms.evm.context.value).toBe(123);
    expect(fsms.evm.context.walletAddress).toBe(
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    );
  });

  it("should handle SIGNED event and move to sending state", () => {
    act(() => {
      // First START to move to preparing
      useInscriptionFsmStore.getState().send("evm", {
        type: "START",
        value: 123,
        walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      });
      // Then MESSAGE_PREPARED
      useInscriptionFsmStore
        .getState()
        .send("evm", { type: "MESSAGE_PREPARED" });
      // Then SIGNED
      useInscriptionFsmStore.getState().send("evm", { type: "SIGNED" });
    });

    const { fsms } = useInscriptionFsmStore.getState();
    expect(fsms.evm.state).toBe("sending");
  });

  it("should reset FSM to initial state and context", () => {
    act(() => {
      useInscriptionFsmStore.getState().send("evm", {
        type: "START",
        value: 123,
        walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      });
      useInscriptionFsmStore.getState().reset("evm");
    });

    const { fsms } = useInscriptionFsmStore.getState();
    expect(fsms.evm.state).toBe(inscriptionMachine.initialState);
    expect(fsms.evm.context).toEqual(inscriptionMachine.initialContext);
  });

  it("should warn if invalid event for state", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    act(() => {
      useInscriptionFsmStore
        .getState()
        .send("evm", { type: "CONFIRMED", txHash: "0xtx" });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No transition")
    );
    consoleSpy.mockRestore();
  });
});
