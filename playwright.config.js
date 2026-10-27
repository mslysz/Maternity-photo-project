import { defineConfig } from './tests/test-tools.js';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  globalSetup: './tests/server-setup.js',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
  },
});
