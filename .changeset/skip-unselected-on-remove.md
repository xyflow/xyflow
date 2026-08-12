---
"@xyflow/vue": patch
---

`removeSelectedNodes` / `removeSelectedEdges` now only emit changes for nodes/edges that are actually selected, instead of one deselect change per element. This avoids re-committing and re-rendering every node/edge on an unselect — most noticeably on drag start with `selectNodesOnDrag: false`.
