import type { StorybookConfig } from '@storybook/vue3-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/vue3-vite',
  async viteFinal(config) {
    config.plugins ??= [];
    config.plugins.push(
      vue(),
      AutoImport({
        imports: ['vue', '@vueuse/core'],
        dts: resolve(root, 'stories/auto-imports.d.ts'),
      })
    );
    config.resolve ??= {};
    config.resolve.dedupe = [...(config.resolve.dedupe ?? []), 'vue'];
    config.optimizeDeps ??= {};
    config.optimizeDeps.exclude = [...(config.optimizeDeps.exclude ?? []), '@xyflow/vue'];
    config.server ??= {};
    config.server.fs ??= {};
    config.server.fs.allow = [resolve(root, '../..')];
    return config;
  },
};

export default config;
