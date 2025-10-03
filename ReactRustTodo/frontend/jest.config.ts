import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/mocks/test-polyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/mocks/test-setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }]
  },
  moduleNameMapper: {
    "\\.(css|scss|sass|less)$": "identity-obj-proxy"
  },
  testMatch: [
    "<rootDir>/src/**/*.test.ts",
    "<rootDir>/src/**/*.test.tsx"
  ],
  testPathIgnorePatterns: ["<rootDir>/tests/", "<rootDir>/tests-examples/"]
};

export default config;
