---
"@xyflow/vue": major
---

Use the same CSS variables and stylesheets as `@xyflow/react` and `@xyflow/svelte`.

- `--vf-*` variables are replaced by `--xy-*` variables, e.g. `--vf-node-bg` → `--xy-node-background-color`, `--vf-node-text` → `--xy-node-color`, `--vf-handle` → `--xy-handle-background-color`, `--vf-edge-text` → `--xy-edge-label-color`. Node border, box-shadow and handle color are now separate variables instead of one `--vf-node-color`.
- `theme-default.css` is removed. Import `style.css` for the default theme, or `base.css` for the structural styles only.
- The built-in `input`/`output` nodes no longer have blue/pink accents.
