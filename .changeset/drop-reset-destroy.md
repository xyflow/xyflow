---
"@xyflow/vue": minor
---

Removed the `$destroy` method from the Vue Flow instance. It was a no-op — the store is owned by its provider component and torn down automatically when that component unmounts.
