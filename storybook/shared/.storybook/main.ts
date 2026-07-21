import type { StorybookConfig } from '@storybook/react-vite';

import { dirname } from 'path';

import { fileURLToPath } from 'url';

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ['../index.stories.@(ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-docs')],
  framework: getAbsolutePath('@storybook/react-vite'),
  refs: (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return {
        react: {
          title: 'React Flow',
          url: 'http://localhost:6006',
        },
        svelte: {
          title: 'Svelte Flow',
          url: 'http://localhost:6007',
        },
      };
    }

    return {
      react: {
        title: 'React Flow',
        url: '/react',
      },
      svelte: {
        title: 'Svelte Flow',
        url: '/svelte',
      },
    };
  },
};

export default config;
