import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';

const root = path.resolve(__dirname, '../../'); // monorepo root

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(root, 'node_modules/react'),
      'react/jsx-runtime': path.resolve(root, 'node_modules/react/jsx-runtime'),
      'react-dom': path.resolve(root, 'node_modules/react-dom'),
      'react-dom/client': path.resolve(root, 'node_modules/react-dom/client'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: { enabled: true, provider: 'playwright', instances: [{ browser: 'chromium' }] },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
      {
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**'],
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
