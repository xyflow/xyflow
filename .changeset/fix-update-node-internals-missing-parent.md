---
"@xyflow/system": patch
---

Fix a crash in `updateNodeInternals` when a node's `parentId` is absent from `nodeLookup` (for example the parent was removed while the child's ResizeObserver callback still fires). The position clamping is now skipped instead of throwing `TypeError: Cannot read properties of undefined (reading 'measured')`. (#5835)
