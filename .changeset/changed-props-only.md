---
"@xyflow/vue": patch
---

Hand a node or edge component only the props that changed since the last render, so Vue's props fast path replaces a full re-resolve of every declared prop on each update.
