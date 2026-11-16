---
"@xyflow/vue": major
---

`useHandle` now uses `XYHandle` from `@xyflow/system`, so drag-to-connect (auto-pan, connection radius, closest-handle resolution, drag threshold) behaves like `@xyflow/react` and `@xyflow/svelte`. Its reconnect options are renamed: `edgeUpdaterType` → `reconnectHandleType`, `onEdgeUpdate` → `onReconnect`, `onEdgeUpdateEnd` → `onReconnectEnd`, and `onReconnectStart` is added.
