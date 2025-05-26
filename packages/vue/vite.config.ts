import { resolve } from 'node:path';
import replace from '@rollup/plugin-replace';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import pkg from './package.json';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.vue'],
  },
  build: {
    minify: false,
    emptyOutDir: false,
    lib: {
      formats: ['es', 'cjs'],
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'vue-flow-core',
      name: 'VueFlowCore',
    },
    rolldownOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      // we bundle @vueuse/core on purpose; its prebuilt dist ships `#__PURE__` annotations in
      // positions Rolldown can't read, so drop that third-party-only noise (keep our own warnings)
      onLog(logLevel, rolldownLog, log) {
        if (
          rolldownLog.code === 'INVALID_ANNOTATION'
          && (rolldownLog.id?.includes('node_modules') || rolldownLog.message?.includes('node_modules'))
        ) {
          return;
        }

        log(logLevel, rolldownLog);
      },
      output: {
        format: 'esm',
        dir: './dist',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    svgLoader(),
    replace({
      __ENV__: 'process.env.NODE_ENV',
      __VUE_FLOW_VERSION__: JSON.stringify(pkg.version),
      preventAssignment: true,
    }) as any,
  ],
});
