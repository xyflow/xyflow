import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  format: 'esm',
  platform: 'neutral',
  target: 'es2020',
  clean: false,
  minify: false,
  sourcemap: true,
  dts: true,
  publint: true,
});
