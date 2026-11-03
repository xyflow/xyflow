---
"@xyflow/vue": major
---

Remove a second batch of deprecated APIs (2.0). Each has a drop-in replacement; internal usage was migrated first.

- **`useHandleConnections` removed** — use `useNodeConnections` (params: `type` → `handleType` (now optional), `id` → `handleId`).
- **`HandleConnection` type removed** — use `NodeConnection` (identical shape, `Connection & { edgeId: string }`). The `getHandleConnections` store action is unchanged but now returns `NodeConnection[]`.
- **`connectionLineType` / `connectionLineStyle` props (and store state) removed** — use `connectionLineOptions.type` / `connectionLineOptions.style`.
- **`PanelPosition` enum removed** — use the `PanelPositionType` string-literal union (e.g. `'top-left'`).
