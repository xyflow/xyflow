---
"@xyflow/react": patch
---

Fix `useNodesData` returning an empty array instead of `null` when it is called without a node id, e.g. `useNodesData(connections[0]?.source)` for a node that has no connection yet. This restores the behavior from v12.
