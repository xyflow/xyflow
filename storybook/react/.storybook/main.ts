import type { StorybookConfig } from '@storybook/react-vite';

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
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../shared/components/**/*.stories.ts',
    '../../shared/examples/**/*.stories.ts',
  ],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  viteFinal: (config) => configureSharedVite(config, 'react', sharedRoot),
};

export default config;
