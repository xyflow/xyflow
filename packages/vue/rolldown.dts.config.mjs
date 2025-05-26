import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

// Flatten the `vue-tsc`-emitted declaration tree (dist/index.d.ts + subdirs, with extensionless
// relative re-exports) into a single self-contained declaration. A flat file has no internal relative
// imports, so it can be emitted as `.d.ts` / `.d.mts` / `.d.cts` interchangeably — which lets the package
// expose per-condition (import/require) types without the "masquerades as CJS" hazard.
//
// `dtsInput: true` means the entry is already a `.d.ts` (emitted by `vue-tsc`, which handles `.vue` SFCs),
// so the plugin only bundles — it doesn't re-generate. This keeps the dts toolchain on rolldown (vite 8's
// bundler), with no classic-rollup dependency. Bare specifiers (vue, @xyflow/system, …) stay external.
export default defineConfig({
  input: './dist/index.d.ts',
  output: { dir: './dts-tmp', format: 'es' },
  external: id => !/^[./]/.test(id),
  plugins: [dts({ dtsInput: true, emitDtsOnly: true })],
});
