import { createRequire } from 'node:module';

// Normally use the local dependency; optionally reuse an installed offline copy.
const require = createRequire(import.meta.url);
const playwright = require(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test',
);
export const { test, expect, defineConfig } = playwright;
