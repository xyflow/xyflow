import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|ts|svelte)"
  ],
  "addons": [
    "@storybook/addon-svelte-csf",
    "@storybook/addon-docs",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/svelte-vite",
    "options": {}
  }
};
export default config;