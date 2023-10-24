import { defineConfig } from '@playwright/test';
import { sharedConfigWithPort } from './playwright.shared.config';

const port = 3000;

export default defineConfig({
  ...sharedConfigWithPort(port),
  webServer: {
    command: 'cd ../../examples/react && pnpm run dev',
    port,
    reuseExistingServer: !process.env.CI,
  },
});
