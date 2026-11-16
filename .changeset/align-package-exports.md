---
"@xyflow/vue": major
---

Align the package exports with `@xyflow/react` and `@xyflow/svelte`:

- ESM types resolve from `index.d.mts` and CJS types from `index.d.ts`, fixing type resolution under `node16`/`nodenext`.
- Stylesheets can be imported as `@xyflow/vue/style.css`, `@xyflow/vue/base.css` and `@xyflow/vue/xy-theme.css`.
- The IIFE / browser-global build (`vue-flow-core.iife.js`) and the `unpkg`/`jsdelivr` fields are removed. CDN users should load the ESM build (e.g. via esm.sh).
