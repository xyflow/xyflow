---
'@xyflow/react': patch
---

Take `EdgeWrapper` off the global store. Each edge now reads its data through a per-edge channel
and gets its static config (`defaultEdgeOptions`, `connectionMode`, `elevateEdgesOnSelect`,
`zIndexMode`) from a single provider subscription, so a node drag no longer re-runs a per-edge
selector for every edge, and changing one edge re-renders only that edge. `setEdges` wakes the
channel for the edges whose object actually changed.

Behaviour is unchanged: same props, same edge rendering.
