/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  injectGlobals: true,
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': [
      require.resolve('babel-jest'),
      { configFile: require.resolve('./babel.config.cjs') },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(msw|@mswjs|headers-polyfill|until-async)/)'
  ],
  moduleNameMapper: {
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.mjs',
    '^jest-setup$': '<rootDir>/tests/jest/setup/jest.setup.cjs',
    '\\.(css|less|scss)$': '<rootDir>/tests/jest/setup/styleMock.cjs',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'node'],
  testMatch: ['**/tests/jest/**/*.(test|spec).(ts|tsx)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.tsx'],
  coverageDirectory: 'coverage',
};

module.exports = config;
