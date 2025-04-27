import "@testing-library/jest-dom";

// mock Worker globally
globalThis.Worker = class {
  constructor() {
    console.warn("Mock Worker constructor called");
  }
  postMessage() {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
  onmessage = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
