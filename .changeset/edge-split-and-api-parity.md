---
"@xyflow/vue": major
---

Edges are stored as your plain `Edge` objects and the edge, connection and viewport APIs are aligned with `@xyflow/react` and `@xyflow/svelte`.

- `GraphEdge` and `isGraphEdge` are removed. `getEdges`/`getEdge`/`v-model:edges` return plain `Edge`s, so `edge.sourceNode`, `edge.targetNode` and `edge.sourceX` are gone. Use `useInternalNode(() => props.source)` and the positions from `EdgeProps`.
- In-place edge mutation is no longer reactive. Use `updateEdge`, `updateEdgeData` or `setEdges`.
- `EdgeProps` drops `sourceNode`/`targetNode`, adds `selectable`/`deletable` and exposes `sourceHandleId`/`targetHandleId`.
- `useEdge().edge` is now a `ComputedRef`.
- `defaultEdgeOptions` are applied when rendering instead of being written onto stored edges.
- `useConnection()` returns a `ComputedRef<ConnectionState>` (`inProgress`, `isValid`, `from*`, `to*`, `pointer`).
- `connectionMode` defaults to `strict`. Set `connection-mode="loose"` for the old behavior.

| Old | New |
|---|---|
| `findNode` / `findEdge` | `getNode` / `getEdge` |
| `screenToFlowCoordinate` / `flowToScreenCoordinate` | `screenToFlowPosition` / `flowToScreenPosition` |
| `project` | `screenToFlowPosition` |
| `updateEdge(oldEdge, connection)` | `reconnectEdge(oldEdge, connection)` |
| `@edge-update-start` / `@edge-update` / `@edge-update-end` | `@reconnect-start` / `@reconnect` / `@reconnect-end` |
| `edgeUpdaterRadius` / `edgesUpdatable` / `edge.updatable` | `reconnectRadius` / `edgesReconnectable` / `edge.reconnectable` |
| `EdgeUpdatable` / `EdgeUpdateEvent` | `EdgeReconnectable` / `EdgeReconnectEvent` |

New: `updateEdge(id, edgeUpdate, { replace? })` for partial edge updates, and `useInternalNode` is exported.
