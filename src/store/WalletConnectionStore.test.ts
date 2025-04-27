import { useWalletConnectionStore } from "@/store/walletConnectionStore";
import { PublicKey } from "@solana/web3.js";
import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("useWalletConnectionStore", () => {
  beforeEach(() => {
    act(() => {
      useWalletConnectionStore.setState({
        isSolanaConnected: false,
        solanaPublicKey: null,
        isEvmConnected: false,
        evmAddress: null,
        isWalletConnected: false,
        connectedWalletCount: 0,
      });
    });
  });

  it("should set Solana connection correctly", () => {
    const pubKey = new PublicKey(
      "9xQeWvG816bUbjTz3seFJMC3HRtHBGi28z5mu5MPm4T8"
    );

    act(() => {
      useWalletConnectionStore.getState().setSolanaConnection(true, pubKey);
    });

    const store = useWalletConnectionStore.getState();
    expect(store.isSolanaConnected).toBe(true);
    expect(store.solanaPublicKey?.toString()).toBe(pubKey.toString());
    expect(store.isWalletConnected).toBe(true);
    expect(store.connectedWalletCount).toBe(1);
  });

  it("should set EVM connection correctly", () => {
    const evmAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

    act(() => {
      useWalletConnectionStore.getState().setEvmConnection(true, evmAddress);
    });

    const store = useWalletConnectionStore.getState();
    expect(store.isEvmConnected).toBe(true);
    expect(store.evmAddress).toBe(evmAddress);
    expect(store.isWalletConnected).toBe(true);
    expect(store.connectedWalletCount).toBe(1);
  });

  it("should update isWalletConnected and connectedWalletCount correctly when both wallets connect", () => {
    const pubKey = new PublicKey(
      "9xQeWvG816bUbjTz3seFJMC3HRtHBGi28z5mu5MPm4T8"
    );
    const evmAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

    act(() => {
      useWalletConnectionStore.getState().setSolanaConnection(true, pubKey);
      useWalletConnectionStore.getState().setEvmConnection(true, evmAddress);
    });

    const store = useWalletConnectionStore.getState();
    expect(store.isSolanaConnected).toBe(true);
    expect(store.isEvmConnected).toBe(true);
    expect(store.isWalletConnected).toBe(true);
    expect(store.connectedWalletCount).toBe(2);
  });

  it("should update connectedWalletCount correctly when one wallet disconnects", () => {
    const pubKey = new PublicKey(
      "9xQeWvG816bUbjTz3seFJMC3HRtHBGi28z5mu5MPm4T8"
    );
    const evmAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

    act(() => {
      useWalletConnectionStore.getState().setSolanaConnection(true, pubKey);
      useWalletConnectionStore.getState().setEvmConnection(true, evmAddress);
    });

    act(() => {
      useWalletConnectionStore.getState().setSolanaConnection(false, null);
    });

    const store = useWalletConnectionStore.getState();
    expect(store.isSolanaConnected).toBe(false);
    expect(store.isEvmConnected).toBe(true);
    expect(store.isWalletConnected).toBe(true);
    expect(store.connectedWalletCount).toBe(1);
  });

  it("should update connectedWalletCount correctly when all wallets disconnect", () => {
    const pubKey = new PublicKey(
      "9xQeWvG816bUbjTz3seFJMC3HRtHBGi28z5mu5MPm4T8"
    );
    const evmAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

    act(() => {
      useWalletConnectionStore.getState().setSolanaConnection(true, pubKey);
      useWalletConnectionStore.getState().setEvmConnection(true, evmAddress);
    });

    act(() => {
      useWalletConnectionStore.getState().setSolanaConnection(false, null);
      useWalletConnectionStore.getState().setEvmConnection(false, null);
    });

    const store = useWalletConnectionStore.getState();
    expect(store.isSolanaConnected).toBe(false);
    expect(store.isEvmConnected).toBe(false);
    expect(store.isWalletConnected).toBe(false);
    expect(store.connectedWalletCount).toBe(0);
  });
});
