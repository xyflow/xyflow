---
"@xyflow/vue": major
---

`<MiniMap>` now colors itself through `--xy-minimap-*-props` custom properties instead of inline attributes.

`nodeColor`, `nodeStrokeColor`, `maskColor` and `maskStrokeColor` previously defaulted to literal `var(--xy-minimap-…)` strings that were rendered as inline `fill`/`stroke`. That produced the right colors, but an inline attribute always beats the stylesheet, so `.vue-flow__minimap-mask` and `.vue-flow__minimap-node` were dead rules and `--xy-minimap-*-props` overrides were silently ignored. These props now default to `undefined` and are set as custom properties on the minimap panel, leaving the stylesheet in charge of the themed defaults.

Visual output is unchanged for the defaults. If you override minimap colors by targeting `.vue-flow__minimap-mask` or `.vue-flow__minimap-node` in your own CSS, those rules now take effect where they previously lost to the inline attribute.
