---
"@xyflow/vue": minor
---

Removed the `$reset` and `$destroy` methods from the Vue Flow instance.

`$destroy` was a no-op. The store is owned by its provider component and torn down automatically when that component unmounts. To replace `$reset`, call `setNodes([])` and `setEdges([])` (plus `setViewport(...)` if you also want to reset the viewport).
