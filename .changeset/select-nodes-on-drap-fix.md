---
'@xyflow/system': patch
---

Fix `selectNodesOnDrag={false}` deselecting all other nodes when dragging a node that isn't already selected. Existing selection is now preserved, and only the dragged node (not the previously-selected nodes) moves.
