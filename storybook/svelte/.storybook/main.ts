import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs', '@storybook/addon-vitest', '@storybook/addon-a11y'],
  framework: '@storybook/svelte-vite',
  viteFinal: async (config) => {
    config.server = {
      ...config.server,
      cors: {
        origin: 'http://localhost:6007',
        credentials: false,
      },
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:6007',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
    };
    return config;
  },
};

export default config;
