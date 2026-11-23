---
"@xyflow/vue": patch
---

Fix node dragging on touch devices. Re-rendering a node re-bound its drag behaviour, which dropped the in-flight touch gesture.
