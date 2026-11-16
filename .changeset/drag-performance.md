---
"@xyflow/vue": patch
---

Improve rendering performance, especially while dragging large selections:

- Node drag updates are batched to one per animation frame.
- Nodes, edges and the `<MiniMap>` re-render less during drags.
- `removeSelectedNodes` / `removeSelectedEdges` only emit changes for elements that are actually selected.
- Built-in edges no longer render their props (`source`, `sourceX`, `animated`, …) as attributes on the `<path>`, and `EdgeText` no longer re-measures its label on every position change.
