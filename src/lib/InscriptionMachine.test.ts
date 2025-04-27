import { createFsm, inscriptionMachine } from "./inscription";

describe("inscriptionMachine FSM", () => {
  let fsm: ReturnType<typeof createFsm>;

  beforeEach(() => {
    fsm = createFsm(inscriptionMachine);
  });

  it("should initialize with idle state and default context", () => {
    expect(fsm.getState()).toBe("idle");
    expect(fsm.getContext()).toEqual({
      value: 0,
      walletAddress: null,
    });
  });

  it("should transition from idle -> preparing on START", () => {
    fsm.send({ type: "START", value: 100, walletAddress: "0x1234" });
    expect(fsm.getState()).toBe("preparing");
    expect(fsm.getContext()).toMatchObject({
      value: 100,
      walletAddress: "0x1234",
    });
  });

  it("should transition from preparing -> waitingForSignature on MESSAGE_PREPARED", () => {
    fsm.send({ type: "START", value: 100, walletAddress: "0x1234" });
    fsm.send({ type: "MESSAGE_PREPARED" });
    expect(fsm.getState()).toBe("waitingForSignature");
  });

  it("should transition from waitingForSignature -> sending on SIGNED", () => {
    fsm.send({ type: "START", value: 100, walletAddress: "0x1234" });
    fsm.send({ type: "MESSAGE_PREPARED" });
    fsm.send({ type: "SIGNED" });
    expect(fsm.getState()).toBe("sending");
  });

  it("should transition from sending -> waitingForConfirmation on TRANSACTION_SENT", () => {
    fsm.send({ type: "START", value: 100, walletAddress: "0x1234" });
    fsm.send({ type: "MESSAGE_PREPARED" });
    fsm.send({ type: "SIGNED" });
    fsm.send({ type: "TRANSACTION_SENT" });
    expect(fsm.getState()).toBe("waitingForConfirmation");
  });

  it("should transition from waitingForConfirmation -> success on CONFIRMED", () => {
    fsm.send({ type: "START", value: 100, walletAddress: "0x1234" });
    fsm.send({ type: "MESSAGE_PREPARED" });
    fsm.send({ type: "SIGNED" });
    fsm.send({ type: "TRANSACTION_SENT" });
    fsm.send({ type: "CONFIRMED", txHash: "0xTxHash" });
    expect(fsm.getState()).toBe("success");
    expect(fsm.getContext()).toMatchObject({
      txHash: "0xTxHash",
    });
  });

  it("should transition to error on FAILED event at any critical state", () => {
    fsm.send({ type: "START", value: 100, walletAddress: "0x1234" });
    fsm.send({ type: "FAILED", error: "Something went wrong" });
    expect(fsm.getState()).toBe("error");
    expect(fsm.getContext().error).toBe("Something went wrong");
  });

  it("should reset back to initial state and context", () => {
    fsm.send({ type: "START", value: 100, walletAddress: "0x1234" });
    fsm.send({ type: "MESSAGE_PREPARED" });
    fsm.send({ type: "FAILED", error: "failed" });
    fsm.reset();
    expect(fsm.getState()).toBe("idle");
    expect(fsm.getContext()).toEqual({
      value: 0,
      walletAddress: null,
    });
  });
});
