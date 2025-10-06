import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/svelte-vite';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs', '@storybook/addon-vitest', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  // refs: { react: { title: 'React', url: 'http://localhost:6007' } },
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
