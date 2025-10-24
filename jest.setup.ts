// --- Fast Refresh globals (required by Zustand) ---
(globalThis as any).$RefreshReg$ = () => { };
(globalThis as any).$RefreshSig$ = () => (type: any) => type;

// --- Web Crypto shim for Node ---
if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
  try {
    const { webcrypto } = require("crypto");
    (globalThis as any).crypto =
      webcrypto ?? { getRandomValues: (arr: Uint8Array) => require("crypto").randomFillSync(arr) };
  } catch {
    (globalThis as any).crypto = { getRandomValues: (arr: Uint8Array) => require("crypto").randomFillSync(arr) };
  }
}

// --- Additional polyfills ---
if (typeof globalThis.TextDecoder === 'undefined') {
  const { TextDecoder, TextEncoder } = require('util');
  globalThis.TextDecoder = TextDecoder;
  globalThis.TextEncoder = TextEncoder;
}

jest.mock('@react-native-async-storage/async-storage');