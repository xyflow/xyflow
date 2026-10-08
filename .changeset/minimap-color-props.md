---
"@xyflow/vue": major
---

`<MiniMap>` now colors itself through `--xy-minimap-*-props` custom properties instead of inline attributes.

`nodeColor`, `nodeStrokeColor`, `maskColor` and `maskStrokeColor` previously defaulted to literal `var(--xy-minimap-…)` strings that were rendered as inline `fill`/`stroke`. 
These props now default to `undefined` and are set as custom properties on the minimap panel, leaving the stylesheet in charge of the themed defaults.
