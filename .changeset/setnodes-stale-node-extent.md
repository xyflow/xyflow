---
"@xyflow/react": patch
---

Fix `setNodes` re-clamping node positions with the initial `nodeExtent` instead of the current one, so nodes could escape a `nodeExtent` that was changed at runtime.
