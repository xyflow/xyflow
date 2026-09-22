import type { StorybookConfig } from '@storybook/vue3-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { mergeConfig } from 'vite';
import { configureSharedVite } from '../../shared/config/vite';
import AutoImport from 'unplugin-auto-import/vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.ts',
    '../../shared/components/**/*.stories.ts',
    '../../shared/examples/**/*.stories.ts',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest'],
  framework: '@storybook/vue3-vite',
  async viteFinal(config) {
    config.resolve ??= {};
    config.resolve.dedupe = [...(config.resolve.dedupe ?? []), 'vue'];
    config.optimizeDeps ??= {};
    config.optimizeDeps.exclude = [...(config.optimizeDeps.exclude ?? []), '@xyflow/vue'];
    config.server ??= {};
    config.server.fs ??= {};
    config.server.fs.allow = [resolve(root, '../..')];
    return mergeConfig(configureSharedVite(config, 'vue', resolve(root, '../shared')), {
      plugins: [
        vue(),
        AutoImport({
          imports: ['vue', '@vueuse/core'],
          dts: resolve(root, 'stories/auto-imports.d.ts'),
        }),
      ],
    });
  },
};

export default config;
