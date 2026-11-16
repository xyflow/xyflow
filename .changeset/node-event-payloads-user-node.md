---
"@xyflow/vue": major
---

Node events (click, mouse, context menu, drag, selection drag, minimap node events and `nodesInitialized`) now emit the user `Node` instead of the `InternalNode`. Use `getInternalNode(node.id)` to read `internals` or `measured`.
