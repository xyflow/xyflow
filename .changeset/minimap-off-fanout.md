---
'@xyflow/react': patch
---

Take the `MiniMap` off the global store fan-out, the same way the main renderer now is.
`MiniMap` reads its node id list from the node-list channel and each minimap node subscribes to its
own node through the per-node channel, so dragging one node no longer re-runs every minimap node's
selector on every store emit.

Behaviour is unchanged: same minimap rendering.
