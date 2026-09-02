import type { StorybookConfig } from '@storybook/svelte-vite';

import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { sharedStorybookViteConfig } from '../../shared/storybookVite.ts';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const configDir = path.dirname(fileURLToPath(import.meta.url));
const sharedRoot = path.resolve(configDir, '../../shared');
const sharedVite = sharedStorybookViteConfig('svelte', sharedRoot);

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|ts)',
    '../../shared/components/**/*.stories.ts',
    '../../shared/examples/**/*.stories.ts',
  ],
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
    config.server.fs.allow = ['../..', sharedRoot];
    config.resolve ??= {};
    config.resolve.conditions = ['svelte', 'browser', 'development', 'import', 'module', 'default'];

    config.define = { ...config.define, ...sharedVite.define };
    config.resolve.alias = { ...config.resolve.alias, ...sharedVite.resolve.alias };

    return config;
  },
};
export default config;
