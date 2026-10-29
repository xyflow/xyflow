---
"@xyflow/vue": major
---

Split the node representation into the user-facing `Node` and the enriched `InternalNode`, matching `@xyflow/react` / `@xyflow/svelte`.

The user nodes array (`v-model:nodes`, `store.nodes`, `getNodes()`, `getNode(id)`, `getSelectedNodes`) now holds and returns your **raw `Node`s** — the exact objects you pass in, without the store-computed `internals`. The enriched node (with `internals.{positionAbsolute, z, handleBounds, userNode}` and authoritative `measured`) lives only in `nodeLookup` and is reached via the new accessors:

- `store.getInternalNode(id)` — returns the `InternalNode` for an id
- `useInternalNode(id)` — composable, a `computed` that re-resolves on re-adopt
- `type InternalNode` — alias for the enriched node (in 1.x this was `GraphNode`)

Internally, vue-flow now hands your nodes straight to `@xyflow/system`'s `adoptUserNodes` (adopting into the persistent `nodeLookup` with `checkEquality`), exactly like react/svelte — there is no second `parseNode` pass (the `parseNode` util is removed; `parseEdge` stays, as the system has no edge adopter).

**Breaking changes:**

- **Direct in-place node mutation is no longer reactive.** `node.position = …`, `node.data.x = …`, `node.selected = …` on a node you got from `getNode`/`getNodes`/`v-model` will not re-render. Use the store helpers (`updateNode`, `updateNodeData`, `applyNodeChanges`, `setNodes`) or reassign the bound `v-model` array. This is what lets the store skip deep-reactifying every node — a deliberate performance trade.
- **`getNode`/`getNodes`/`v-model:nodes` no longer carry `internals`/`computedPosition`.** Read absolute position, z-index, handle bounds and measured dimensions via `getInternalNode(id)` / `useInternalNode(id)` / `nodeLookup`. Custom node components are unaffected — they still receive position/dimensions through their props.
- **Node defaults are no longer force-stamped** (parity with xyflow): a node you pass without `data` keeps `data: undefined` (previously `{}`), and `selected`/`dragging` stay `undefined` until set. Guard optional reads (`data?.label`).

Drag/selection/context-menu event payloads (`onNodeDrag`, `onSelectionContextMenu`, `onNodesInitialized`, …) still emit the enriched `InternalNode`s — read absolute position/z via `node.internals.positionAbsolute` / `node.internals.z`.
