---
'@xyflow/react': patch
---

Reduce per-handle work on every store update by returning a shared connection state from the `Handle` selector while no connection is in progress, instead of allocating a new object and shallow-comparing it for each handle
