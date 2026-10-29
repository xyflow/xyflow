---
"@xyflow/vue": patch
---

Rebuild `useHandle` on top of `@xyflow/system`'s `XYHandle`. Drag-to-connect now goes through `XYHandle.onPointerDown` — the same connection engine that powers `xyflow/react` and `xyflow/svelte` — instead of the previous vue-flow specific drag loop. Click-to-connect stays vue-flow specific so the richer `isValidConnection({ source, target, sourceHandle, targetHandle }, { nodes, edges, sourceNode, targetNode })` callback signature is preserved.

No public-API changes. `useHandle`'s props (`handleId`, `nodeId`, `type`, `isValidConnection`, `edgeUpdaterType`, `onEdgeUpdate`, `onEdgeUpdateEnd`) and return shape (`handlePointerDown`, `handleClick`) are unchanged. The `onConnectStart` / `onConnect` / `onConnectEnd` event hooks fire with the same payloads they did before.

Internal effects of the migration:

- Auto-pan on connect, the connection radius / closest-handle resolution, and the drag threshold are now driven by the system implementation. Behaviour is in lockstep with xyflow/react and xyflow/svelte.
- A bridge inside `useHandle` decomposes the system's unified `ConnectionState` into vue-flow's split-field store (`connectionStartHandle`, `connectionEndHandle`, `connectionPosition`, `connectionStatus`), so `useConnection`, `Pane.vue`, `ZoomPane.vue`, and `<Handle />` continue to read the same reactive fields they always have.
- The user-facing `ValidConnectionFunc` is wrapped at the boundary to fit system's bare `(edge) => boolean` signature — source/target nodes are resolved from `nodeLookup` before the user's callback runs.
