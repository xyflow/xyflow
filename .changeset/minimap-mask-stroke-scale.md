---
"@xyflow/vue": patch
---

`<MiniMap>`'s `maskStrokeWidth` is now scaled by the minimap's view scale, so the mask border keeps a constant on-screen thickness instead of thinning as the flow's bounds grow.
