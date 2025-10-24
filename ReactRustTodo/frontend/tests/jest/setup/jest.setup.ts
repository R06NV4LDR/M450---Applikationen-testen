import '@testing-library/jest-dom';
import { server } from './msw.server';

// MSW: start/stop/reset for each test file
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Optional: silence React-Query / console noise
const error = console.error;
beforeAll(() => { console.error = (...args) => {
  if (/not wrapped in act|Warning.*deprecated/.test(args[0])) return;
  error(...args);
};});
afterAll(() => { console.error = error; });
