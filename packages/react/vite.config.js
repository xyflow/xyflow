import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const external = [
  '@xyflow/system',
  'classcat',
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  'zustand',
  'zustand/shallow',
  'zustand/traditional',
];

const externalPackages = /^(?:@xyflow\/system|classcat|react|react-dom|zustand)(?:\/.*)?$/;

export default defineConfig({
  build: {
    minify: false,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ReactFlow',
      // the proper extensions will be added
      fileName: 'index',
      formats: ['es'],
    },
    rolldownOptions: {
      external: (id) => externalPackages.test(id) || external.includes(id),
    },
  },
});
