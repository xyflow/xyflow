---
"@xyflow/vue": patch
---

Apply the changed-props fast path to the built-in edge types' `BaseEdge` child as well, so that boundary stops re-resolving every prop on each update.
