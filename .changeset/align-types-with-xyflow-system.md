---
"@xyflow/vue": major
---

Align core types and change-pipeline shapes with `@xyflow/system` (the framework-agnostic engine that powers `xyflow/react` and `xyflow/svelte`). Hooks, slots, and the rest of the vue-flow API keep their shape; this changeset covers the data-shape moves. (The `useVueFlow` signature change and the `<VueFlowProvider>` context model are covered in their own changesets.)

### `Node` / `InternalNode`

`Node` keeps its public surface but adds `parentId?: string` (matching xyflow). The deprecated `parentNode` field is removed — use `parentId`.

`InternalNode` (the enriched, store-internal node) is structurally assignable to `@xyflow/system`'s `InternalNodeBase`, which means the following vue-flow-1.x-only top-level fields are gone:

- `node.computedPosition` → use `node.internals.positionAbsolute` (and `node.internals.z` for the z-index).
- `node.dimensions` → use `node.measured`.
- `node.handleBounds` (top-level) → use `node.internals.handleBounds`.
- `node.isParent` → check the new `parentLookup` map exposed by the store (`useVueFlow().parentLookup.value.get(nodeId)?.size`). The flag was a derived value; treating it as derived removes a class of stale-flag bugs when nodes are added/removed dynamically.

### `NodeProps` / `EdgeProps`

`NodeProps<NodeType>` and `EdgeProps<EdgeType>` now take a `NodeType`/`EdgeType` generic, matching `xyflow/react`'s convention. Previous data-first usage (`NodeProps<MyData>`) should become `NodeProps<Node<MyData, 'myType'>>`.

The renderer now forwards the full `NodeProps` surface (`selectable`, `deletable`, `draggable`, `isConnectable`, `positionAbsoluteX`, `positionAbsoluteY`, `parentId`) so custom-node components see the same props they would in xyflow/react.

### `EdgeType` generic (mirrors `NodeType`)

`Node` and `Edge` now reuse `@xyflow/system`'s `NodeBase` / `EdgeBase` as their foundation (`Node = NodeBase & {…vue}`, `DefaultEdge extends EdgeBase`), the same way `xyflow/react` does — so the shared fields stay in lockstep with the engine instead of being hand-maintained.

The store and its public types now carry an `EdgeType extends Edge = Edge` generic alongside the existing `NodeType` (xyflow/react order: `<NodeType, EdgeType>`), with defaults so existing untyped usage is unchanged. `useVueFlow<NodeType, EdgeType>()` now returns a fully-typed store: `edges`, `getEdge`, `addEdges`, `updateEdge`, `updateEdgeData`, the edge lookup, and the edge-related hooks/events/slots are all parameterized on your `EdgeType` (e.g. `useVueFlow<Node, MyEdge>().getEdge(id)` returns `MyEdge | undefined`). Edges are stored verbatim as your `Edge` — there is no enriched edge type (see the edge-split changeset).

### Change types

The `NodeChange` / `EdgeChange` families mirror `@xyflow/system` exactly (no `replace` variant yet):

- `NodeDimensionChange.updateStyle` → `setAttributes` (`true | 'width' | 'height'`).
- `NodePositionChange.from` → `positionAbsolute`. Consumers tracking the "before" position now derive it themselves.
- `NodeAddChange.item` is the user-provided `Node` (not `GraphNode`); same for `EdgeAddChange.item` and `Edge`. Both add an optional `index`.
- `EdgeRemoveChange` is now `{ id, type: 'remove' }` only — vue-flow's extra `source`/`target`/`sourceHandle`/`targetHandle` fields are gone. Read those from the edge via `getEdge(id)` before the change is applied.
- `NodeDragItem` drops vue-flow's `from`/`dimensions`/`parentNode` extensions and adopts the system shape (`measured`, `internals.positionAbsolute`, `parentId`, `origin`, `dragging`).

### `useVueFlow` API

`useVueFlow()` is now a zero-argument, pure context consumer — it returns the store provided by the nearest `<VueFlow>` / `<VueFlowProvider>` ancestor and throws when called outside one. It no longer takes an id or options object and no longer creates or populates a store; pass options to `<VueFlow>` as props, and wrap sibling/external consumers in `<VueFlowProvider>`. There is no global flow registry anymore. (See the `retire-storage-singleton` / `vue-flow-provider` changesets for the full migration.)

The deprecated `paneReady` event is gone — listen to `init` (or `onInit`) instead. The deprecated mixed-elements API (`<VueFlow v-model="elements">`, `setElements`, `addSelectedElements`, `removeSelectedElements`, `getElements`, `getSelectedElements`) is removed — use the separate `nodes` / `edges` props and `setNodes` / `setEdges` / `addSelectedNodes` / `addSelectedEdges` / `removeSelectedNodes` / `removeSelectedEdges` / `getNodes` / `getEdges` / `getSelectedNodes` / `getSelectedEdges` actions and getters.

Default change handlers (`applyNodeChanges` / `applyEdgeChanges`) are wired automatically when the store is created (gated on `autoApplyChanges`), so `addNodes` / `addEdges` mutate the store — matching xyflow/react.

### Built-in nodes (label rendering)

The built-in `input` / `default` / `output` node components read labels from `data.label`. The deprecated top-level `node.label` is no longer supported — move labels to `data: { label: 'My Node' }`.

### Migration cheat-sheet

| Old | New |
|---|---|
| `node.parentNode` | `node.parentId` |
| `node.computedPosition` | `node.internals.positionAbsolute` (+ `node.internals.z`) |
| `node.dimensions` | `node.measured` |
| `node.handleBounds` | `node.internals.handleBounds` |
| `node.isParent` | `parentLookup.value.get(node.id)?.size > 0` |
| `node.label` (top-level) | `node.data.label` |
| `NodeProps<MyData>` | `NodeProps<Node<MyData, 'myType'>>` |
| `EdgeProps<MyData>` | `EdgeProps<Edge<MyData, 'myType'>>` |
| `NodeDimensionChange.updateStyle` | `NodeDimensionChange.setAttributes` |
| `NodePositionChange.from` | `NodePositionChange.positionAbsolute` |
| `NodeAddChange.item: GraphNode` | `NodeAddChange.item: Node` |
| `EdgeAddChange.item: GraphEdge` | `EdgeAddChange.item: Edge` |
| `EdgeRemoveChange.{source,target,sourceHandle,targetHandle}` | look up the edge via `getEdge(id)` |
| `onPaneReady` / `@pane-ready` | `onInit` / `@init` |
| `<VueFlow v-model="elements">` | `<VueFlow :nodes="nodes" :edges="edges">` (or `v-model:nodes`/`v-model:edges`) |
| `store.setElements(...)` | `store.setNodes(...)` + `store.setEdges(...)` |
| `store.addSelectedElements(...)` | `store.addSelectedNodes(...)` / `store.addSelectedEdges(...)` |
| `store.removeSelectedElements(...)` | `store.removeSelectedNodes(...)` / `store.removeSelectedEdges(...)` |
| `store.getElements` / `store.getSelectedElements` | `store.getNodes` / `store.getEdges` / `store.getSelectedNodes` / `store.getSelectedEdges` |
