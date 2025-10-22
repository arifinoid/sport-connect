// --- Web Crypto shim for Node (used by some Expo libs) ---
if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
  try {
    const { webcrypto } = require("crypto");
    (globalThis as any).crypto =
      webcrypto ?? { getRandomValues: (arr: Uint8Array) => require("crypto").randomFillSync(arr) };
  } catch {
    (globalThis as any).crypto = { getRandomValues: (arr: Uint8Array) => require("crypto").randomFillSync(arr) };
  }
}

// --- Additional polyfills for Expo ---
if (typeof globalThis.TextDecoder === 'undefined') {
  const { TextDecoder, TextEncoder } = require('util');
  globalThis.TextDecoder = TextDecoder;
  globalThis.TextEncoder = TextEncoder;
}

// Mock Expo's winter runtime completely
jest.mock('expo/src/winter/runtime.native', () => ({}));
jest.mock('expo/src/winter/installGlobal', () => ({}));

// Mock the entire expo module to prevent winter runtime issues
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
  // Override any problematic exports
}));
