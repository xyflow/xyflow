---
"@xyflow/system": patch
---

Fix `getNodesBounds` stretching the returned bounds to include the origin `(0, 0)` when one of the passed ids/nodes can't be resolved. 
