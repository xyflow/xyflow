import { defineConfig } from 'tsdown';
import Vue from 'unplugin-vue/rolldown';

export default defineConfig({
  entry: ['src/index.ts'],
  // dual ESM + CJS (unlike xyflow's esm-only) so CommonJS consumers (jest/SSR) keep working
  format: ['es', 'cjs'],
  // universal lib: runs in the browser and under SSR, no node/browser-specific assumptions
  platform: 'neutral',
  target: 'es2020',
  sourcemap: true,
  // don't wipe `dist` — the `build` script runs `pnpm theme` (postcss) first, and tsdown composes the
  // JS/dts on top so the baked-in publint sees the CSS exports too (same pattern xyflow uses)
  clean: false,
  // deps (@vueuse/core, d3-interpolate, @xyflow/system) + the `vue` peer are auto-externalized.
  // `dts.vue` runs vue-tsc internally so SFC declarations are emitted + bundled (flat .d.mts/.d.cts).
  dts: { vue: true },
  // self-validate the published package on every build; `no-resolution` is attw's false-positive on the
  // CSS subpath exports (it doesn't model `.css` entry points — xyflow ignores it too).
  publint: true,
  attw: { level: 'error', ignoreRules: ['no-resolution'] },
  define: {
    __ENV__: 'process.env.NODE_ENV',
  },
  plugins: [Vue()],
});
