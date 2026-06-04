---
'@xyflow/system': patch
---

Reduce allocations in `getNodesInside` by testing nodes against the viewport without building a `Rect` per node
