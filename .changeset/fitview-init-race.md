---
'@xyflow/react': patch
---

Fix the initial `fitView` landing at the wrong viewport when nodes are initialized synchronously (for example via a provided `measured`). The queued init fit could run before the container had been measured and before the panZoom instance existed, so it fit against stale or zero dimensions. It now waits until the nodes are initialized, the container has real dimensions, and panZoom is ready, and is re-attempted when whichever of those is last becomes available.
