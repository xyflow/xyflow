import type { StorybookConfig } from '@storybook/svelte-vite';

import { dirname } from 'path';

import { fileURLToPath } from 'url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|ts)'],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: getAbsolutePath('@storybook/svelte-vite'),
  async viteFinal(config) {
    config.server ??= {};
    config.server.fs ??= {};
    config.server.fs.allow = ['../..'];
    config.resolve ??= {};
    config.resolve.conditions = ['svelte', 'browser', 'development', 'import', 'module', 'default'];
    return config;
  },
};
export default config;