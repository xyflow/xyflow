import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  refs: {
    svelte: { title: 'Svelte', url: 'http://localhost:6008' },
  },
  viteFinal: async (config) => {
    if (config.server) {
      config.server.cors = true;
    } else {
      config.server = {
        cors: true,
      };
    }
    return config;
  },
};
export default config;
