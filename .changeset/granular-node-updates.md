---
'@xyflow/react': minor
'@xyflow/system': patch
---

Make single-node updates scale to large graphs. Node components subscribe to their own
node instead of the global store, so changing one node out of thousands no longer re-runs
every node's selector. Edges re-path through a per-edge channel when an endpoint node
moves, so a single-node move re-renders only the edges that touch it. `setNodes` also
reconciles structurally unchanged arrays (flat or nested) in place, recomputing only the
moved nodes and their cascaded children (no `nodeLookup` clone/clear/rebuild).

Behaviour is unchanged for existing apps: same props, same `onNodesChange` flow.
