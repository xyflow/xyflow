---
"@xyflow/vue": major
---

Align the package's export map with xyflow and fix type-declaration resolution:

- **Dual type declarations.** `exports["."]` now resolves ESM types from `index.d.mts` (the `import` condition) and CJS types from `index.d.cts` (the `require` condition), bundled into a single flat declaration per format. This removes the "types masquerade as CJS" issue under `node16`/`nodenext` ESM resolution (`arethetypeswrong` is now green across node10 / node16-CJS / node16-ESM / bundler). Bundler resolution (Vite/webpack — i.e. virtually every Vue app) was already correct and is unaffected.
- **Dropped the IIFE / browser-global build.** `vue-flow-core.iife.js` and the `unpkg`/`jsdelivr` fields are removed (matching `@xyflow/svelte`, which is ESM-only). The ESM (`.mjs`) and CJS (`.js`) builds are unchanged, so bundler and `require()` consumers are unaffected; CDN `<script>` users should load the ESM build (e.g. via esm.sh) or use a bundler.
- Minor: `repository.url` now ends in `.git`, `files` trimmed to `["dist"]`, and a `default` export condition was added.
