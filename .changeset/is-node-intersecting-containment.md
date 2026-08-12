---
"@xyflow/vue": patch
---

Fix `isNodeIntersecting` when the area is fully contained in the node. With `partially: false` it only counted a node as intersecting when the node was fully inside the area — so a large node *containing* a smaller query area reported no intersection. Full containment now counts either way (node-in-area or area-in-node), matching `getIntersectingNodes` and xyflow/react #5482.
