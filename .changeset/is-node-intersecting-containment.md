---
"@xyflow/vue": patch
---

Fix `isNodeIntersecting` with `partially: false` when the area is fully contained in the node. Previously only a node fully inside the area counted, now containment in either direction does, matching `getIntersectingNodes`.
