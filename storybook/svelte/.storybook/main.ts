import type { StorybookConfig } from '@storybook/svelte-vite';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { configureSharedVite } from '../../shared/config/vite.ts';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const configDir = dirname(fileURLToPath(import.meta.url));
const sharedRoot = resolve(configDir, '../../shared');

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
  viteFinal: (config) => configureSharedVite(config, 'svelte', sharedRoot),
};

export default config;
