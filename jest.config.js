module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/tests/**/*.test.{ts,tsx,js,jsx}",
    "<rootDir>/tests/**/*.spec.{ts,tsx,js,jsx}"
  ],
  setupFiles: [
    "<rootDir>/jest.setup.ts",
    "react-native-gesture-handler/jestSetup"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup-after-env.ts"],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|expo-router|escape-string-regexp)',
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/app/", "/components/"],
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
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules/expo/src/winter/"
  ],
};
