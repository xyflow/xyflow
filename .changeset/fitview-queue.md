---
"@xyflow/vue": patch
---

Defer an imperative `fitView()` until the nodes are measured. A `fitView()` call made before the nodes settle — e.g. right after `addNodes()` — used to frame only the already-measured nodes (`getFitViewNodes` skips unmeasured ones) and ignore the new ones. It now waits for `nodesInitialized` before fitting, so the fit always frames the current nodes. An empty flow resolves immediately (nothing to wait for). The `useNodesInitialized` check is now a shared `areNodesInitialized` helper used by both the composable and the fitView queue.
