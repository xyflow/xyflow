---
"@xyflow/vue": patch
---

Pass the path helpers only the fields they take instead of spreading the whole props object, which walked every declared prop through Vue's reactive proxy on each render.
