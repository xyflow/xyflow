---
"@xyflow/system": patch
---

Fix handle bounds when the flow is inside a CSS-transformed ancestor. `updateNodeInternals` now divides handle offsets by viewport zoom times the ancestor scale (`getBoundingClientRect().width / offsetWidth`), so edges still meet their handles under CSS `transform: scale()` or `zoom`. (#6023)
