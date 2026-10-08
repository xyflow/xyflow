---
"@xyflow/vue": patch
---

The `<svg>` inside `<MiniMap>` now carries the `vue-flow__minimap-svg` class, so the stylesheet's `.vue-flow__minimap-svg { display: block }` rule applies and the element can be targeted from custom CSS.
