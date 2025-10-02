import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  refs: {
    svelte: { title: 'Svelte', url: 'http://localhost:6008' },
  },
  viteFinal: async (config) => {
    if (config.server) {
      config.server.cors = {
        origin: 'http://localhost:6008',
        credentials: true,
      };
    } else {
      config.server = {
        cors: {
          origin: 'http://localhost:6008',
          credentials: true,
        },
      };
    }
    return config;
  },
};
export default config;
