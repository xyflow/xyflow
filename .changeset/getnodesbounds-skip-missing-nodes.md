---
"@xyflow/system": patch
---

Fix `getNodesBounds` stretching the returned bounds to include the origin `(0, 0)` when one of the passed ids/nodes can't be resolved (e.g. a stale or already-removed id). Unresolvable entries are now skipped, matching `getInternalNodesBounds`.
