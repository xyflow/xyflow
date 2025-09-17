import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import viteConfig from './vite.config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  viteConfig, // has svelte() plugin
  defineConfig({
    plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
    server: {
      fs: { allow: [dirname] }, // allow serving files from this dir
    },
    test: {
      name: 'storybook',
      root: dirname, // make relative paths resolvable by Vite in browser mode
      browser: {
        enabled: true,
        provider: 'playwright',
        headless: true,
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: ['.storybook/vitest.setup.ts'], // keep relative (no absolute path)
    },
  })
);
