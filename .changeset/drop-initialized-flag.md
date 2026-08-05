---
"@xyflow/vue": minor
---

Removed the internal `initialized` store flag. It only guarded a redundant empty commit during store construction and was always `true` by the time your code ran. Use `nodesInitialized` or `viewportInitialized` to check readiness.
