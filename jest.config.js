module.exports = {
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/tests/**/*.test.{ts,tsx,js,jsx}",
    "<rootDir>/tests/**/*.spec.{ts,tsx,js,jsx}"
  ],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/app/", "/components/", "/stores/"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    $RefreshReg$: () => {},
    $RefreshSig$: () => (type) => type,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(zustand)/)"
  ],
};
