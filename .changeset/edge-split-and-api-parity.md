---
"@xyflow/vue": major
---

Bring edges to the same model as the 2.0 node split and align the accessor / connection / reconnect API with `@xyflow/system` (the engine behind `xyflow/react` and `xyflow/svelte`).

### Edges are stored verbatim (no more `GraphEdge`)

Edges are now stored as your plain `Edge` objects — the same model nodes already use. There is no enriched edge representation anymore.

- `GraphEdge` and `isGraphEdge` are **removed**. Use `Edge`.
- `getEdges`/`getEdge`/`getSelectedEdges`/`v-model:edges` return your `Edge` objects (typed `DeepReadonly`); reading `edge.sourceNode`/`edge.targetNode`/`edge.sourceX` no longer works — resolve nodes with `useInternalNode(() => props.source)` and read positions from `EdgeProps`.
- In-place edge mutation is no longer reactive. Update edges with `updateEdge`/`updateEdgeData`/`setEdges`/`applyEdgeChanges`, or reassign the `v-model` array immutably.
- `EdgeProps` no longer carries `sourceNode`/`targetNode`; it gains `selectable`/`deletable` and exposes handles as `sourceHandleId`/`targetHandleId`. `type`/`data` are optional.
- `useEdge().edge` is now a `ComputedRef`.
- `defaultEdgeOptions` are applied at connection-creation and at render, never stamped onto stored edges (a runtime change to `defaultEdgeOptions` is now reflected immediately).

### Accessor renames

- `findNode` → `getNode`, `findEdge` → `getEdge`.

### Viewport coordinate helpers

- `screenToFlowCoordinate` → `screenToFlowPosition`, `flowToScreenCoordinate` → `flowToScreenPosition`.
- `project` is **removed** — use `screenToFlowPosition` (it handles the container offset for you).

### Edge reconnect vocabulary

The "edge update" vocabulary becomes "reconnect":

- `updateEdge(oldEdge, connection)` → `reconnectEdge(oldEdge, connection)`.
- events `edgeUpdateStart`/`edgeUpdate`/`edgeUpdateEnd` → `reconnectStart`/`reconnect`/`reconnectEnd` (`@edge-update*` → `@reconnect*`).
- `edgeUpdaterRadius` → `reconnectRadius`, `edgesUpdatable` → `edgesReconnectable`, `edge.updatable` → `edge.reconnectable`.
- `EdgeUpdatable` → `EdgeReconnectable`, `EdgeUpdateEvent` → `EdgeReconnectEvent`.

### `useConnection` shape

`useConnection()` now returns a `ComputedRef<ConnectionState>` — `{ inProgress, isValid, from, fromHandle, fromPosition, fromNode, to, toHandle, toPosition, toNode, pointer }` — instead of `{ startHandle, endHandle, status, position }`.

### `connectionMode` defaults to `strict`

In `strict` mode a source handle only connects to a target handle. Set `connection-mode="loose"` to restore the previous default (every handle treated as a source).

### New

- `updateEdge(id, edgeUpdate, { replace? })` — partial edge update (the edge analogue of `updateNode`); accepts an object or an updater function.
- `useInternalNode` is now exported.
