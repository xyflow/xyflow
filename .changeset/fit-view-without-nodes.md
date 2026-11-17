---
"@xyflow/system": patch
---

Keep the current viewport when `fitView` is called with nodes that can not be fitted (an empty `nodes` array, unknown ids or hidden nodes), instead of zooming to `maxZoom` around the origin
