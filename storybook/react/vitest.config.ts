import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineConfig({
  plugins: [react(), storybookTest({ configDir: '.storybook' })],
  test: {
    name: 'storybook',
    browser: { enabled: true, provider: 'playwright', instances: [{ browser: 'chromium' }] },
    setupFiles: ['.storybook/vitest.setup.ts'],
  },
});
