---
'@xyflow/react': patch
---

Take the node/edge renderers and selection off the global store fan-out. The renderers read their
visible id list from a node/edge list version channel that bumps only when the id set or order
changes, so a node drag no longer recomputes and shallow-compares the whole id list on every frame.
`SelectionListener` reads selection from a dedicated channel that bumps only when the selected set
changes, instead of scanning every node and edge on every store emit.

Behaviour is unchanged: same rendered output, same `onSelectionChange` timing.
