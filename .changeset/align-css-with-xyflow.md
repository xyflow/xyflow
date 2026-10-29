---
"@xyflow/vue": major
---

Align the CSS with `@xyflow/react`/`@xyflow/svelte`: the theme is now driven by the shared `--xy-*` custom-property system (replacing `--vf-*`), and the stylesheets are split the same way xyflow's are.

**Breaking changes:**

- **CSS variables renamed `--vf-*` → `--xy-*`** and expanded to the full xyflow set. Each rule reads `var(--xy-x, var(--xy-x-default))`, so you override the un-suffixed variable and vue-flow falls back to the shipped `--xy-x-default`. Update custom themes accordingly — e.g. `--vf-node-bg` → `--xy-node-background-color`, `--vf-node-text` → `--xy-node-color`, `--vf-handle` → `--xy-handle-background-color`, `--vf-connection-path`/edge color → `--xy-edge-stroke`, `--vf-edge-text`/`--vf-edge-text-bg` → `--xy-edge-label-color`/`--xy-edge-label-background-color`. The full set is exported as `CSSVars`. There is no longer a single `--vf-node-color` driving border + box-shadow + handle together; node border, box-shadow and handle color are now separate variables.
- **`dist/theme-default.css` was removed.** `dist/style.css` is now the full default theme (necessary structure **and** the built-in look) — import just that. A new `dist/base.css` ships the structure plus only minimal theming, for when you want to bring your own theme.
- **The built-in `input`/`output` node types no longer have colored (blue/pink) accents** — all default node types use the same neutral `#1a192b` border, matching `@xyflow/react`'s current default theme.

Colors that were previously hardcoded (edge stroke, selected-edge stroke, resize controls, background-pattern dots/lines/cross) are now `--xy-*` variables, and many more themeable variables are exposed (selection box, node border-radius, hover/selected box-shadows, controls box-shadow, minimap mask/node strokes, attribution background, …).
