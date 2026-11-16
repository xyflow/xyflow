---
"@xyflow/vue": major
---

Align core types with `@xyflow/system`. `Node` and `Edge` are now built on the system's `NodeBase`/`EdgeBase`, and the store and its types take an `EdgeType` generic next to `NodeType` (`useVueFlow<NodeType, EdgeType>()`).

| Old | New |
|---|---|
| `node.parentNode` | `node.parentId` |
| `node.computedPosition` | `node.internals.positionAbsolute` (+ `node.internals.z`) |
| `node.dimensions` | `node.measured` |
| `node.handleBounds` | `node.internals.handleBounds` |
| `node.isParent` | `useVueFlowStore().parentLookup.get(node.id)?.size > 0` |
| `node.label` | `node.data.label` |
| `NodeProps<MyData>` | `NodeProps<Node<MyData, 'myType'>>` |
| `EdgeProps<MyData>` | `EdgeProps<Edge<MyData, 'myType'>>` |
| `NodeDimensionChange.updateStyle` | `NodeDimensionChange.setAttributes` |
| `NodePositionChange.from` | `NodePositionChange.positionAbsolute` |
| `NodeAddChange.item: GraphNode` / `EdgeAddChange.item: GraphEdge` | `Node` / `Edge` |
| `EdgeRemoveChange.{source,target,sourceHandle,targetHandle}` | read the edge via `getEdge(id)` |
| `@pane-ready` / `onPaneReady` | `@init` / `onInit` |
| `<VueFlow v-model="elements">` | `<VueFlow v-model:nodes="nodes" v-model:edges="edges">` |
| `setElements`, `getElements`, `getSelectedElements` | `setNodes`/`setEdges`, `getNodes`/`getEdges`, `getSelectedNodes`/`getSelectedEdges` |
| `addSelectedElements`, `removeSelectedElements` | `addSelectedNodes`/`addSelectedEdges`, `removeSelectedNodes`/`removeSelectedEdges` |

Custom node components now also receive `selectable`, `deletable`, `draggable`, `isConnectable`, `positionAbsoluteX`, `positionAbsoluteY` and `parentId` as props. `NodeDragItem` uses the system shape.
