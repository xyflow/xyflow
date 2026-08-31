---
'@xyflow/react': patch
---

Take `Handle` off the global store connection fan-out. Handles read connection state through a `useStore` selector that ran for every handle on every store emit, so a node-position write still evaluated it once per handle even though the shared idle-state reference bailed the re-render. Connection state now comes from a dedicated channel that only fires during connect gestures, so a node-position write no longer evaluates anything per handle. No behavior change; the gain scales with handle count.
