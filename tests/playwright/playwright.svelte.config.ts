import { defineConfig, devices } from '@playwright/test';
import { sharedConfigWithPort } from './playwright.shared.config';

const port = 5173;

export default defineConfig({
  ...sharedConfigWithPort(port),
  webServer: {
    command: 'cd ../../examples/svelte && pnpm run dev',
    port: port,
    reuseExistingServer: !process.env.CI,
  },
});
