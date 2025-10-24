import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/jest/setup/jest.setup.ts'],
  testMatch: ['**/tests/jest/**/*.(test|spec).(ts|tsx)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.tsx'],
  coverageDirectory: 'coverage',
};
export default config;
