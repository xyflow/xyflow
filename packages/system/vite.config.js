import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const external = ['d3-drag', 'd3-interpolate', 'd3-selection', 'd3-transition', 'd3-zoom'];

const externalPackages = /^(?:d3-drag|d3-interpolate|d3-selection|d3-transition|d3-zoom)(?:\/.*)?$/;

export default defineConfig({
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
  },
  build: {
    minify: false,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'XYFlowSystem',
      // the proper extensions will be added
      fileName: 'index',
      formats: ['es'],
    },
    rolldownOptions: {
      external: (id) => externalPackages.test(id) || external.includes(id),
    },
  },
});
