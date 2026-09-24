import pluginBabel from '@rolldown/plugin-babel';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  format: 'esm',
  platform: 'neutral',
  target: 'es2020',
  clean: false,
  minify: true,
  sourcemap: true,
  plugins: [
    pluginBabel({
      // Keep React 18 support by using react-compiler-runtime instead of React 19's built-in runtime.
      presets: [
        reactCompilerPreset({
          target: '18',
        }),
      ],
    }),
  ],
  dts: true,
  publint: true,
  attw: {
    profile: 'esm-only',
    level: 'error',
    ignoreRules: ['no-resolution'],
  },
});
