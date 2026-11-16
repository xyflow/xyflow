import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: ['vue'],
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dts: resolve('src/auto-imports.d.ts'),
    }),
  ],
  server: {
    watch: {
      ignored: ['!**/node_modules/@xyflow/**/*'],
    },
  },
  optimizeDeps: {
    exclude: ['@xyflow/vue'],
  },
});
