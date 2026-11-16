# @xyflow/vue

## 2.0.1
### Patch Changes



- [#6142](https://github.com/xyflow/xyflow/pull/6142) [`270f947`](https://github.com/xyflow/xyflow/commit/270f94798db59a2e175906f8805e8ecc4fa1c6ed) - Show a nicer readme on npm :)

## 2.0.0
### Major Changes



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - `ConnectionLineType` and `PanelPosition` are now re-exported from `@xyflow/system`, matching `@xyflow/react` and `@xyflow/svelte`.
  
  - The value of `ConnectionLineType.SimpleBezier` changed from `"simple-bezier"` to `"simplebezier"`. Using the enum is unaffected; update raw `"simple-bezier"` strings.
  - The `PanelPosition` enum and the `PanelPositionType` union are replaced by the `PanelPosition` string union (e.g. `"top-left"`). It also accepts `"center-left"` and `"center-right"`.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Rename container classes to match `@xyflow/react` and `@xyflow/svelte`. Update custom CSS or DOM queries that use them:
  
  - `.vue-flow__transformationpane` → `.vue-flow__viewport`
  - `.vue-flow__viewport` → `.vue-flow__renderer`
  - `.vue-flow__edge-labels` → `.vue-flow__edgelabel-renderer`


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Use the same CSS variables and stylesheets as `@xyflow/react` and `@xyflow/svelte`.
  
  - `--vf-*` variables are replaced by `--xy-*` variables, e.g. `--vf-node-bg` → `--xy-node-background-color`, `--vf-node-text` → `--xy-node-color`, `--vf-handle` → `--xy-handle-background-color`, `--vf-edge-text` → `--xy-edge-label-color`. Node border, box-shadow and handle color are now separate variables instead of one `--vf-node-color`.
  - `theme-default.css` is removed. Import `style.css` for the default theme, or `base.css` for the structural styles only.
  - The built-in `input`/`output` nodes no longer have blue/pink accents.


- [#5896](https://github.com/xyflow/xyflow/pull/5896) [`02607f9`](https://github.com/xyflow/xyflow/commit/02607f9562945ec62e432351c39bf88105a7d56a) - `edgesReconnectable` and `elevateEdgesOnSelect` now default to `true`.
  
  Edges are reconnectable by default (this only takes effect once you handle `@reconnect`), and selected edges are raised above their siblings. To keep the previous behavior, set `:edges-reconnectable="false"` and/or `:elevate-edges-on-select="false"` on `<VueFlow>`.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Align connection and reconnect event payloads with `@xyflow/react` and add a `selectionChange` event.
  
  - `connectEnd` / `clickConnectEnd` emit `{ event, connectionState }` instead of the bare event.
  - `reconnectStart` emits `{ event, edge, handleType }` and `reconnectEnd` emits `{ event, edge, handleType, connectionState }`.
  - New `selectionChange` event (`@selection-change` / `onSelectionChange`) emits `{ nodes, edges }` when the selection changes.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Rename `fitViewOnInit` to `fitView` and add a `fitViewOptions` prop for the initial fit. The `nodeOrigin` prop, which was previously ignored, is now applied.



- [#6114](https://github.com/xyflow/xyflow/pull/6114) [`dff4dad`](https://github.com/xyflow/xyflow/commit/dff4dad7e654ac42e49771b3523e703196f72b15) - Align the connection APIs across all frameworks on `NodeConnection`.
  
  - Remove `getHandleConnections`. Use `getNodeConnections({ nodeId, type, handleId })` instead: `id` is renamed to `handleId` and `type` is optional.
  - Add `getNodeConnections` to `useSvelteFlow`.
  - `HandleConnection` type removed: use `NodeConnection` instead.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Align the package exports with `@xyflow/react` and `@xyflow/svelte`:
  
  - ESM types resolve from `index.d.mts` and CJS types from `index.d.ts`, fixing type resolution under `node16`/`nodenext`.
  - Stylesheets can be imported as `@xyflow/vue/style.css`, `@xyflow/vue/base.css` and `@xyflow/vue/xy-theme.css`.
  - The IIFE / browser-global build (`vue-flow-core.iife.js`) and the `unpkg`/`jsdelivr` fields are removed. CDN users should load the ESM build (e.g. via esm.sh).


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Align core types with `@xyflow/system`. `Node` and `Edge` are now built on the system `NodeBase`/`EdgeBase`, and the store and its types take an `EdgeType` generic next to `NodeType` (`useVueFlow<NodeType, EdgeType>()`).
  
  | Old | New |
  |---|---|
  | `node.parentNode` | `node.parentId` |
  | `node.computedPosition` | `node.internals.positionAbsolute` (+ `node.internals.z`) |
  | `node.dimensions` | `node.measured` |
  | `node.handleBounds` | `node.internals.handleBounds` |
  | `node.isParent` | `useVueFlowStore().parentLookup.get(node.id)?.size > 0` |
  | `node.label` | `node.data.label` |
  | `NodeProps<MyData>` | `NodeProps<Node<MyData, "myType">>` |
  | `EdgeProps<MyData>` | `EdgeProps<Edge<MyData, "myType">>` |
  | `NodeDimensionChange.updateStyle` | `NodeDimensionChange.setAttributes` |
  | `NodePositionChange.from` | `NodePositionChange.positionAbsolute` |
  | `NodeAddChange.item: GraphNode` / `EdgeAddChange.item: GraphEdge` | `Node` / `Edge` |
  | `EdgeRemoveChange.{source,target,sourceHandle,targetHandle}` | read the edge via `getEdge(id)` |
  | `@pane-ready` / `onPaneReady` | `@init` / `onInit` |
  | `<VueFlow v-model="elements">` | `<VueFlow v-model:nodes="nodes" v-model:edges="edges">` |
  | `setElements`, `getElements`, `getSelectedElements` | `setNodes`/`setEdges`, `getNodes`/`getEdges`, `getSelectedNodes`/`getSelectedEdges` |
  | `addSelectedElements`, `removeSelectedElements` | `addSelectedNodes`/`addSelectedEdges`, `removeSelectedNodes`/`removeSelectedEdges` |
  
  Custom node components now also receive `selectable`, `deletable`, `draggable`, `isConnectable`, `positionAbsoluteX`, `positionAbsoluteY` and `parentId` as props. `NodeDragItem` uses the system shape.


- [#6046](https://github.com/xyflow/xyflow/pull/6046) [`e0be409`](https://github.com/xyflow/xyflow/commit/e0be409d4bfeb3cfb487a05d7db9b4decaef10b4) - The `<Background>` pattern is now colored by the stylesheet rather than by an inline `fill`/`stroke`.
  Previously the color was resolved in JS from a hardcoded `{ lines: "#eee", dots: "#91919a" }`.
  
  If you relied on those hardcoded light colors, pass them explicitly: `<Background color="#91919a" />` for dots, `<Background variant="lines" color="#eee" />` for lines.


- [#5890](https://github.com/xyflow/xyflow/pull/5890) [`72dbb75`](https://github.com/xyflow/xyflow/commit/72dbb750449c23b14b768b63b0a49839461194a6) - The `nodes`/`edges` binding now determines how changes are handled, and the `applyDefault` prop is removed.
  
  - `v-model:nodes` / `v-model:edges` (or no binding at all, when driving the flow through `useVueFlow()`/`setupVueFlow()`) is **managed**: Vue Flow applies changes to its store and mirrors them back to your ref.
  - A bare one-way `:nodes` / `:edges` is **controlled**: changes are delivered via `@nodes-change` / `@edges-change` and nothing is applied until you handle them (apply them and reassign your array).


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Type the `class` property as `ClassValue` (`string | Record<string, boolean> | ClassValue[]`, mirroring the Vue class-binding type) on `Node`, `Edge` and the `connectionLineClass` prop, replacing the looser `string | string[] | Record<string, any>`.
  
  The **function form** for `class` and `style` (`(el) => value`) is removed. It was never part of the public type — only a dead runtime branch in the node/edge wrappers — and passing a function produced a broken native render anyway. Pass a resolved `ClassValue` / style object instead (compute it in your own component if it needs to be dynamic).


- [#6117](https://github.com/xyflow/xyflow/pull/6117) [`dae45aa`](https://github.com/xyflow/xyflow/commit/dae45aa8273e6a55ab7e0bed21b5653cf4682e05) - `onConnectEnd` and `onReconnectEnd` now receive `to` in flow coordinates instead of screen coordinates



- [#6049](https://github.com/xyflow/xyflow/pull/6049) [`15da095`](https://github.com/xyflow/xyflow/commit/15da09533d29c53da93e41a2f53554f3bc524644) - The `connectionLineOptions` object of `<VueFlow>` is replaced by individual props.
  
  | before                              | after                       |
  |-------------------------------------|-----------------------------|
  | `connectionLineOptions.type`        | `connectionLineType`        |
  | `connectionLineOptions.style`       | `connectionLineStyle`       |
  | `connectionLineOptions.class`       | `connectionLineClass`       |
  | `connectionLineOptions.markerStart` | `connectionLineMarkerStart` |
  | `connectionLineOptions.markerEnd`   | `connectionLineMarkerEnd`   |
  
  The `ConnectionLineOptions` type is removed.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Custom connection lines (`#connection-line` slot) receive `from*`/`to*` props instead of `source*`/`target*` (`sourceX` → `fromX`, `targetHandle` → `toHandle`, …), matching `@xyflow/react`. `markerStart`/`markerEnd` are optional.
  
  The `ElementData` type is removed. `Edge` data now defaults to `Record<string, unknown>`.


- [#6049](https://github.com/xyflow/xyflow/pull/6049) [`15da095`](https://github.com/xyflow/xyflow/commit/15da09533d29c53da93e41a2f53554f3bc524644) - The connection status is now applied to the group of the connection line rather than its path.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Expose the raw pointer position during a connection:
  
  - Custom connection-line components (`#connection-line`) now receive a `pointer` prop — the unsnapped pointer position in flow coordinates, distinct from `toX`/`toY` (which snap to the hovered handle).
  - `useConnection().pointer` is now the raw pointer position. Previously it tracked the snapped end (it was aliased to `connection.to`); the snapped end is still available via `to` / `toHandle`.


- [#5898](https://github.com/xyflow/xyflow/pull/5898) [`903cd43`](https://github.com/xyflow/xyflow/commit/903cd432689fd2ab26179efda55b045ff30e7683) - The store now exposes the ongoing connection as a single `connection` object (`ConnectionState`), replacing the separate `connectionStartHandle`, `connectionEndHandle`, `connectionPosition`, and `connectionStatus` fields. Read `connection.fromHandle`, `connection.toHandle`, `connection.pointer`, and `connection.isValid` instead — this matches `useConnection()` and React/Svelte Flow.



- [#6050](https://github.com/xyflow/xyflow/pull/6050) [`bf75d26`](https://github.com/xyflow/xyflow/commit/bf75d266e4cbb12a9261b2001f05ca98b10f6f55) - Rename the `fitViewParams` prop of `<Controls>` to `fitViewOptions`.



- [#5903](https://github.com/xyflow/xyflow/pull/5903) [`b507faa`](https://github.com/xyflow/xyflow/commit/b507faa347f306a57a1df7d7245b5f5d3f852239) - `isValidConnection` now receives only the attempted connection, matching `IsValidConnection` in React and Svelte Flow. The extra second argument (`{ nodes, edges, sourceNode, targetNode }`) is removed, read those from `useVueFlow()` inside your handler if you need them.



- [#5893](https://github.com/xyflow/xyflow/pull/5893) [`825e6c2`](https://github.com/xyflow/xyflow/commit/825e6c2346422dddddb24021982a99e568b36e4b) - Removed the `autoConnect` prop and the `Connector` type. Handle new connections with `@connect` (or `onConnect`) and `addEdge`/`addEdges` instead:
  
  ```vue
  <VueFlow @connect="(connection) => (edges = addEdge(connection, edges))" />
  ```


- [#5906](https://github.com/xyflow/xyflow/pull/5906) [`b2ceddc`](https://github.com/xyflow/xyflow/commit/b2ceddce41de79b7a65f00f93724fcd05da24d94) - Removed the per-edge `template` option (`edge.template`). Use edge slots or map an edge `type` to a component via the `edgeTypes` prop instead.



- [#5901](https://github.com/xyflow/xyflow/pull/5901) [`4675bdd`](https://github.com/xyflow/xyflow/commit/4675bddbc41d0b574fee5c083ae36c1487871ac3) - Removed the internal `initialized` store flag. It only guarded a redundant empty commit during store construction and was always `true` by the time your code ran. Use `nodesInitialized` or `viewportInitialized` to check readiness.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Remove the redundant `viewportHelper` `ComputedRef` from the `useVueFlow()` instance. The viewport functions (`setCenter`, `fitView`, `zoomIn`, `zoomOut`, `zoomTo`, `setViewport`, `getViewport`, `fitBounds`, `screenToFlowPosition`, `flowToScreenPosition`) are already exposed **flat** on the instance so the nested `viewportHelper` was duplicate surface.
  
  - `useVueFlow().viewportHelper.value.setCenter(…)` → `useVueFlow().setCenter(…)` (and likewise for the other viewport functions).
  - The init flag moves to a flat `viewportInitialized` (`ComputedRef<boolean>`): `useVueFlow().viewportHelper.value.viewportInitialized` → `useVueFlow().viewportInitialized.value`.


- [#5895](https://github.com/xyflow/xyflow/pull/5895) [`0ddd0b3`](https://github.com/xyflow/xyflow/commit/0ddd0b3c91a926750fb59646ea8cf15a492613c1) - Removed the `$destroy` method from the Vue Flow instance. It was a no-op — the store is owned by its provider component and torn down automatically when that component unmounts.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add the `selectable` class to edges. The edge `<g>` now carries a `selectable` class whenever the edge is selectable (its own `selectable` flag, or `elementsSelectable` when unset), and the CSS keys `cursor: pointer` and the focus edge-path stroke off `.selectable`. Previously `cursor: pointer` was applied to every edge unconditionally, so **non-selectable edges no longer show the pointer cursor**.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Edges are stored as your plain `Edge` objects and the edge, connection and viewport APIs are aligned with `@xyflow/react` and `@xyflow/svelte`.
  
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


- [#5914](https://github.com/xyflow/xyflow/pull/5914) [`5a8ed98`](https://github.com/xyflow/xyflow/commit/5a8ed98e5e743a6461f3bfc0df59cc5c92945331) - Fix the `useKeyPress` `preventDefault` option, which was inverted. It now calls `preventDefault()` by default and only skips it when set to `false` — previously `preventDefault: true` was what disabled it. The default behavior is unchanged; if you explicitly set this option, flip the value.



- [#5927](https://github.com/xyflow/xyflow/pull/5927) [`69dc311`](https://github.com/xyflow/xyflow/commit/69dc31137917e7f09b09d8f769300ec32b709251) - Use 5% as new default padding for `fitView`, and `fitBounds`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - `nodeLookup`, `parentLookup` and `edgeLookup` are now reactive `Map`s instead of `ComputedRef`s. Read them from `useVueFlowStore()` without `.value`:
  
  ```diff
  - useVueFlow().nodeLookup.value.get(id)
  + useVueFlowStore().nodeLookup.get(id)
  ```


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Remove the deprecated `useHandleConnections` composable. Use `useNodeConnections` instead: `type` → `handleType`, `id` → `handleId` and `nodeId` → `id`.
  
  ```ts
  // before
  useHandleConnections({ type: "target", id: "a", nodeId: "1" })
  // after
  useNodeConnections({ handleType: "target", handleId: "a", id: "1" })
  ```


- [#6048](https://github.com/xyflow/xyflow/pull/6048) [`022cbc3`](https://github.com/xyflow/xyflow/commit/022cbc313b94221e2ee233176c00478fbeb2f8bb) - `<MiniMap>` now colors itself through `--xy-minimap-*-props` custom properties instead of inline attributes.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Remove the deprecated `updateEdge` util (use `reconnectEdge`) and `useZoomPanHelper` (use the viewport functions on `useVueFlow()`). `addEdge` now takes an edges array instead of mixed elements: `addEdge(connection, edges)`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Node events (click, mouse, context menu, drag, selection drag, minimap node events and `nodesInitialized`) now emit the user `Node` instead of the `InternalNode`. Use `getInternalNode(node.id)` to read `internals` or `measured`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Align node `extent` typing with `@xyflow/system`:
  
  - Collapse the local `CoordinateExtent` type onto the one from `@xyflow/system` (they were identical) — it is now re-exported from `@xyflow/system`.
  - Remove `CoordinateExtentRange` and the per-node "clamp to parent **with padding**" extent form (`extent: { range, padding }`). `node.extent` and the `nodeExtent` prop now accept exactly what the system understands: `"parent" | CoordinateExtent | null`. Use `extent: "parent"` to clamp a child to its parent. This drops a vue-flow-only workaround that could not be cleanly typed against `@xyflow/system`; if padded clamping returns it will be a system-level feature. To inset from the parent in the meantime, apply the offset yourself.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Split nodes into the user-facing `Node` and the `InternalNode` (formerly `GraphNode`), matching `@xyflow/react` and `@xyflow/svelte`. `v-model:nodes`, `getNodes`, `getNode` and `getSelectedNodes` return the plain nodes you passed in. Read `internals` (absolute position, z-index, handle bounds) and `measured` via `getInternalNode(id)`, `useInternalNode(id)` or `nodeLookup`.
  
  - In-place node mutation (`node.position = …`, `node.data.x = …`) is no longer reactive. Use `updateNode`, `updateNodeData` or `setNodes`.
  - Nodes are no longer filled with defaults: a node without `data` keeps `data: undefined` (previously `{}`), and `selected`/`dragging` stay `undefined` until set.


- [#6115](https://github.com/xyflow/xyflow/pull/6115) [`b1ad016`](https://github.com/xyflow/xyflow/commit/b1ad01664671544df26b3acc7815626369c33a93) - Replace `paneClickDistance` with `paneDragThreshold` (default `1`). Like `nodeDragThreshold`, the pane only starts panning or selecting once the pointer has moved further than the threshold; otherwise it counts as a click. Works with every mouse button.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - `toObject()` no longer returns the deprecated `position` and `zoom` fields. Use `viewport` (`{ x, y, zoom }`) instead.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Remove `useVueFlow().fromObject()` and the `FlowImportObject` type.
  
  `toObject()` is unchanged. To restore a saved flow, set the elements and viewport yourself from `onInit` (or any time after mount):
  
  ```ts
  const { setNodes, setEdges, setViewport, onInit } = useVueFlow()
  
  onInit(() => {
    const flow = JSON.parse(localStorage.getItem("flow") ?? "null")
    if (!flow) {
      return
    }
  
    setNodes(flow.nodes)
    setEdges(flow.edges)
  
    if (flow.viewport) {
      setViewport(flow.viewport)
    }
  })
  ```


- [#5556](https://github.com/xyflow/xyflow/pull/5556) [`9fcddb8`](https://github.com/xyflow/xyflow/commit/9fcddb8684d094aaa160bd8f3371261cf36bc754) - Remove `nodeClickDistance`. Whether a click on a node fires is now determined solely by whether a drag actually moved the node: clicks are suppressed only after a drag changed node positions. Use `nodeDragThreshold` (and `snapGrid`) to control this.



- [#6085](https://github.com/xyflow/xyflow/pull/6085) [`fc128ca`](https://github.com/xyflow/xyflow/commit/fc128ca4590bd0f367138439110cdbbf4e1dd9b6) - Removed `getNodeTypes` and `getEdgeTypes` from `useVueFlow()`. Node and edge components now resolve from the registered types directly; read `nodeTypes`/`edgeTypes` off `useVueFlowStore()` if you need the registered map.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Remove the `vueFlowVersion` field from the flow instance (`useVueFlow().vueFlowVersion`) and the build-time `__VUE_FLOW_VERSION__` injection. It was exposed but never used internally and has no equivalent in xyflow/react; read your installed version from your package manager or `@xyflow/vue/package.json` instead.



- [#5987](https://github.com/xyflow/xyflow/pull/5987) [`615c5f6`](https://github.com/xyflow/xyflow/commit/615c5f6a41340b6474e5a9a8b415ca62233e1ee8) - Rename the measured handle geometry type from `Handle` to `HandleBounds` so it no longer collides with the `<Handle />` component.



- [#5911](https://github.com/xyflow/xyflow/pull/5911) [`0d330e0`](https://github.com/xyflow/xyflow/commit/0d330e034f0581bb426e5a6fb0debb9d1dc08766) - Renamed the `$reset` instance action to `reset`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Remove the global flow registry. `useVueFlow()` no longer accepts an id or options. It returns the store of the nearest `<VueFlow>` or `<VueFlowProvider>` and throws outside of one.
  
  - `useVueFlow({ nodes, edges, … })` → pass these as props to `<VueFlow>`.
  - `useVueFlow("my-id")` to access a flow from outside → wrap both in `<VueFlowProvider>` and call `useVueFlow()` inside it.
  
  The `id` prop is now only used as a label (aria/debug), not to look up a flow.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add an explicit `selectionOnDrag` prop and drop the `selectionKeyCode={true}` overload.
  
  Drawing a selection box on a plain pane drag (no key held) used to be expressed by setting `selectionKeyCode` to `true`, which overloaded the key-code prop. It is now its own boolean prop:
  
  ```vue
  <!-- before -->
  <VueFlow :selection-key-code="true" :pan-on-drag="false" />
  <!-- after -->
  <VueFlow :selection-on-drag="true" :pan-on-drag="false" />
  ```
  
  `selectionKeyCode` is once again just the key you hold to select (default `"Shift"`). `paneClick` also fires while selecting on drag (it was previously swallowed by the d3-zoom click handling).


- [#5927](https://github.com/xyflow/xyflow/pull/5927) [`7b52b50`](https://github.com/xyflow/xyflow/commit/7b52b50fe929d41318f0598537bb7a289d577ef2) - Numbers passed to `fitViewOptions.padding` are interpreted as pixel values instead of legacy units. Use percentage values instead (0.1 ≈ 4.5%, 0.5 ≈ 16.7%, 1 ≈ 25%, 2 ≈ 33%)



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Use the parent expansion of `@xyflow/system` for `expandParent` nodes when dragging, measuring and resizing, matching `@xyflow/react`:
  
  - A child dragged past the top/left edge of its parent now grows the parent up/left, and its siblings are offset so they stay in place.
  - `node.origin` is respected when a resize expands the parent.
  - Keyboard moves of nodes with an `extent` no longer stop a full node width/height short of the boundary.


- [#5887](https://github.com/xyflow/xyflow/pull/5887) [`1d34f03`](https://github.com/xyflow/xyflow/commit/1d34f031fd84c16d707782ca14b5a7503cd398ec) - `HandleElement` is removed in favor of `HandleBounds`, and `EdgePositions` in favor of `EdgePosition`. The `<Handle>` props `connectableStart`/`connectableEnd` are renamed to `isConnectableStart`/`isConnectableEnd`, `OnConnectStartParams` fields are now nullable, and the deprecated `Project` type is no longer re-exported.



- [#6136](https://github.com/xyflow/xyflow/pull/6136) [`1262688`](https://github.com/xyflow/xyflow/commit/12626882010930807876b621e88d70e58bd79be7) - `updateNodeInternals(id)` requires a node id or an array of ids; the no-argument form (which re-measured every node) is removed.



- [#5900](https://github.com/xyflow/xyflow/pull/5900) [`ec0405e`](https://github.com/xyflow/xyflow/commit/ec0405e9a78f654da6fcdeb898f89554d5be40c2) - `useNode` now returns the user-facing `Node` instead of the enriched `InternalNode` — use `useInternalNode` for `internals`/`measured`. Its `id` argument also accepts a ref or getter, matching `useInternalNode`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - `useHandle` now uses `XYHandle` from `@xyflow/system`, so drag-to-connect (auto-pan, connection radius, closest-handle resolution, drag threshold) behaves like `@xyflow/react` and `@xyflow/svelte`. Its reconnect options are renamed: `edgeUpdaterType` → `reconnectHandleType`, `onEdgeUpdate` → `onReconnect`, `onEdgeUpdateEnd` → `onReconnectEnd`, and `onReconnectStart` is added.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - - Rename the `nodeId` param to `id` (`useNodeConnections({ nodeId })` → `useNodeConnections({ id })`). Like before, it is optional and falls back to the node id from the `useNodeId` context injection.
  - `handleId` now requires `handleType` to be set. Passing `handleId` on its own is a type error — `handleId` is meaningless at runtime without a `handleType`, and the type now points you at the fix. Runtime behavior is unchanged.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Split the store API. `useVueFlow()` now returns the flow **instance** (actions, computed getters and event hooks like `onNodeClick` or `onConnect`) and no longer exposes the raw reactive state. The state moved to `useVueFlowStore()`, with `storeToRefs()` to destructure it (Pinia-style).
  
  ```ts
  // before
  const { nodes, transform, nodeLookup, setViewport, onConnect } = useVueFlow()
  
  // after
  const { setViewport, onConnect } = useVueFlow()
  const store = useVueFlowStore()                  // reactive state (store.nodes, store.transform — no .value)
  const { nodes, transform } = storeToRefs(store)  // refs for destructuring
  const { nodeLookup } = useVueFlowStore()         // lookup Maps can be destructured directly
  ```
  
  - **`useVueFlowStore()`** returns the reactive state object, including the `nodeLookup`/`parentLookup`/`edgeLookup`/`connectionLookup` Maps. Reading it inside a `computed`, `watch` or template is tracked.
  - **`storeToRefs(store)`** turns the state fields into refs so destructuring stays reactive.
  - Computed getters (`getNodes`, `getEdges`, `getSelectedNodes`, `getSelectedEdges`, `viewport`) and all event hooks stay on `useVueFlow()`.
  
  A `<VueFlow>` template ref now exposes the instance (`VueFlowInstance`). The `VueFlowStore` type is kept as an alias of `VueFlowInstance`.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add `ease` and `interpolate` options to every viewport function. `fitView`, `setViewport`, `setCenter`, `fitBounds`, `zoomTo`, `zoomIn` and `zoomOut` now accept `ease?: (t: number) => number` and `interpolate?: "smooth" | "linear"` alongside `duration` to control the transition curve.
  
  The viewport option types now come from `@xyflow/system`:
  
  - `FitViewParams` → `FitViewOptions` (`FitViewOptionsBase` from `@xyflow/system`). Its `nodes` option takes node objects instead of ids — `nodes?: string[]` → `nodes?: (Node | { id: string })[]` — and the vestigial `offset` option is removed (superseded by `padding`).
  - `TransitionOptions` → `ViewportHelperFunctionOptions`.


- [#6052](https://github.com/xyflow/xyflow/pull/6052) [`1afef23`](https://github.com/xyflow/xyflow/commit/1afef233175cc9d2ff1f6a3de376f2c7734f05ae) - Require Vue `^3.5.27` (peer dependency of `vue` and `@vue/reactivity`). The default flow `id` is now generated with `useId()`, and earlier 3.5 releases cannot resolve `@xyflow/system` types in `defineProps` (vuejs/core#14236).



- [#6077](https://github.com/xyflow/xyflow/pull/6077) [`f062cfb`](https://github.com/xyflow/xyflow/commit/f062cfbeb7c447f41ada067e775244ca3cd2dc4e) - Remove the array-based `applyChanges`, `applyNodeChanges` and `applyEdgeChanges` exports, and `applyNodeChanges`/`applyEdgeChanges` on the `useVueFlow()` instance. Use `applyTo(elements)` of the changeset instead.


### Minor Changes



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - `fitView` and `fitBounds` now accept `Padding` from `@xyflow/system`: per-side values and `px` / `%` units in addition to a number. `Padding`, `PaddingWithUnit` and `PaddingUnit` are re-exported.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add an `ariaLabelConfig` prop to customize the accessibility text. Pass a `Partial<AriaLabelConfig>` (merged over the defaults) to override any of the node/edge a11y descriptions, the aria-live "moved node" message, and the Controls / MiniMap / Handle aria labels. As part of this, the Controls buttons and Handle — which previously had no `aria-label` — now get accessible labels, the Controls panel gets a `Control Panel` label, and the MiniMap label default moves into the config. `AriaLabelConfig` is re-exported from the package root.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Allow theming arrowhead markers with the `--xy-edge-stroke` CSS variable. `defaultMarkerColor` now accepts `null` — pass it (or leave the `color` of a marker unset) and the arrowhead inherits `--xy-edge-stroke` instead of the hard-coded `#b1b1b7`, so markers can match themed edge colors. The marker polylines carry `.arrow` / `.arrowclosed` classes and only set an inline color when one is provided; the open arrow strokes only, the closed arrow strokes and fills. The default (`#b1b1b7`) is unchanged.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add `autoPanOnNodeFocus` (default `true`), mirroring xyflow/react. When a node receives keyboard focus (Tab) and is not within the viewport, the viewport pans to center it — so keyboard navigation never lands on an off-screen node. Only reacts to keyboard focus (`:focus-visible`), not pointer/programmatic focus. Set `auto-pan-on-node-focus="false"` (or pass `false`) to disable.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add an `autoPanOnSelection` prop. When `true` (the default), the viewport pans automatically as the cursor reaches the edge of the viewport while dragging a selection box, so you can select nodes beyond the visible area in one gesture. Set `:auto-pan-on-selection="false"` to keep the viewport fixed during selection.



- [#6046](https://github.com/xyflow/xyflow/pull/6046) [`e0be409`](https://github.com/xyflow/xyflow/commit/e0be409d4bfeb3cfb487a05d7db9b4decaef10b4) - Add `bgColor` and `patternClassName` props to `<Background>`. `color` and `bgColor` are applied as the `--xy-background-pattern-color-props` and `--xy-background-color-props` custom properties.



- [#6046](https://github.com/xyflow/xyflow/pull/6046) [`e0be409`](https://github.com/xyflow/xyflow/commit/e0be409d4bfeb3cfb487a05d7db9b4decaef10b4) - Add the `cross` background variant.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add a dark theme. The flow follows the system color scheme by default. Use the `forceColorMode` prop (`"light" | "dark"`) to pin it.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add a `connectionDragThreshold` prop. It is the distance in pixels the pointer must move from a handle before a connection line starts to drag — useful to prevent accidental connections when you just click a handle. Defaults to `1`; set it higher (e.g. `connectionDragThreshold="25"`) to require a more deliberate drag, or `0` to start the connection immediately on pointer-down. Below the threshold, neither `connectStart` nor `connectEnd` fires.



- [#6049](https://github.com/xyflow/xyflow/pull/6049) [`15da095`](https://github.com/xyflow/xyflow/commit/15da09533d29c53da93e41a2f53554f3bc524644) - Add `connectionLineContainerStyle` prop, applied to the `<svg>` the connection line is drawn in.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add a controlled `viewport` prop with `v-model:viewport` support, matching the controlled viewport of `@xyflow/react` and `bind:viewport` of `@xyflow/svelte`.
  
  ```vue
  <VueFlow v-model:viewport="viewport" />
  ```
  
  The bound value two-way binds to the viewport of the flow: setting it pans/zooms the flow (applied via `syncViewport`, so no extra pan/zoom events fire), and it updates as the user interacts (via `update:viewport`). `defaultViewport` remains the uncontrolled initial-viewport prop; use `viewport` when you want to own the viewport state.


- [#6048](https://github.com/xyflow/xyflow/pull/6048) [`022cbc3`](https://github.com/xyflow/xyflow/commit/022cbc313b94221e2ee233176c00478fbeb2f8bb) - Add an `orientation` prop to `<Controls>` (`"vertical" | "horizontal"`, default `"vertical"`).



- [#5910](https://github.com/xyflow/xyflow/pull/5910) [`87108d3`](https://github.com/xyflow/xyflow/commit/87108d372175c55945aad0a81ed4a5d1f5627432) - Added a `debug` prop. When `true`, Vue Flow logs its events to the console as they fire (high-frequency events like move/drag/hover are skipped) — useful for seeing which events run.



- [#5939](https://github.com/xyflow/xyflow/pull/5939) [`621f5d9`](https://github.com/xyflow/xyflow/commit/621f5d9d3d95c7514edfe699465ece508e89780a) - Add `changeParent` to `useReactFlow`, `useSvelteFlow` and `useVueFlow`, to easily change the parent of a node without calculating a new position.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Discriminate the `#node-<type>` / `#edge-<type>` slot props by node/edge type. When `nodes`/`edges` are typed as a discriminated union (e.g. `(MyNodeA | MyNodeB)[]`), each `#node-<type>` / `#edge-<type>` slot now narrows its props to the `NodeProps` / `EdgeProps` of the matching variant, so a custom node/edge component can safely type its `data` without a cast. Generic `Node[]` / `Edge[]` flows are unchanged (props stay broad), and arbitrary slot names remain allowed (a broad `node-${string}` / `edge-${string}` fallback). Type-only.



- [#5905](https://github.com/xyflow/xyflow/pull/5905) [`a5753cd`](https://github.com/xyflow/xyflow/commit/a5753cdfdef3f2ee964c98645a28cd3a998114f2) - Tightened the edge `label` type. Dropped the catch-all `object` from `EdgeProps` and `EdgeTextProps` so it matches the actual label type of edges (`string | VNode | Component`).



- [#6050](https://github.com/xyflow/xyflow/pull/6050) [`bf75d26`](https://github.com/xyflow/xyflow/commit/bf75d266e4cbb12a9261b2001f05ca98b10f6f55) - Export `ControlButtonProps` and `ControlButtonEmits` types.



- [#6050](https://github.com/xyflow/xyflow/pull/6050) [`d61a36a`](https://github.com/xyflow/xyflow/commit/d61a36aa7ad44eb5cf81aa6740b0eb85ea9795bb) - Export `getEdgeCenter`, along with the `GetBezierPathParams`, `GetSmoothStepPathParams` and `GetStraightPathParams` parameter types.



- [#5844](https://github.com/xyflow/xyflow/pull/5844) [`861a6be`](https://github.com/xyflow/xyflow/commit/861a6be8fff691b071d808ebb62bc9135d2eb70b) - Exported styles now live in `@layer xyflow`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Move `Background`, `Controls`, `MiniMap`, `NodeResizer`, `NodeResizeControl`, and `NodeToolbar` components into core pkg.



- [#6048](https://github.com/xyflow/xyflow/pull/6048) [`022cbc3`](https://github.com/xyflow/xyflow/commit/022cbc313b94221e2ee233176c00478fbeb2f8bb) - Add a `bgColor` prop to `<MiniMap>`, applied as the `--xy-minimap-background-color-props` custom property.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add an `autoScale` prop to `NodeResizer` / `NodeResizeControl`. Handle controls already scale up by `Math.max(1 / zoom, 1)` so they do not shrink below their base size when zooming out; `autoScale` (default `true`) now lets you opt out, previously the prop existed but had no effect. The handle is also centered via the `translate` CSS property instead of `transform`, so the centering composes with the zoom `scale` and the handle stays pinned to the node corner at any zoom.



- [#6050](https://github.com/xyflow/xyflow/pull/6050) [`f94dad9`](https://github.com/xyflow/xyflow/commit/f94dad9c9627d4acd2b663293290c56798fd35db) - Add a `resizeDirection` prop to `<NodeResizeControl>` (`"horizontal" | "vertical"`).
  When set, the control only resizes the node along that axis; left unset it resizes in any direction, as before.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add the `onBeforeDelete` prop and the `deleteElements` action. `deleteElements({ nodes, edges })` also removes child nodes and connected edges, and resolves to `{ deletedNodes, deletedEdges }`. `onBeforeDelete` runs before the Delete key and `deleteElements` remove anything: return `false` to cancel, `true` to continue or `{ nodes, edges }` to delete a subset.



- [#5993](https://github.com/xyflow/xyflow/pull/5993) [`901b0e4`](https://github.com/xyflow/xyflow/commit/901b0e4ccbcfdd4921c5875dd9e43bdec2d06935) - Add `xy-theme.css` stylesheet (`@xyflow/<lib>/xy-theme.css`) that ships the xyflow default theme on top of `base.css`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Add a `stepPosition` option to smooth-step / step edges. Set `pathOptions.stepPosition` (0 = bend at source, 1 = at target, 0.5 = midpoint, the default) to control where the edge bends along its path. The path math comes from `getSmoothStepPath` from `@xyflow/system`; the `SmoothStepEdge` component now forwards the option to it.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - `ConnectionLineProps`, `RemoveNodes`, `RemoveEdges` and `IsNodeIntersecting` now take the `NodeType`/`EdgeType` of the flow, so custom connection lines and updater functions get typed nodes and edges.



- [#5904](https://github.com/xyflow/xyflow/pull/5904) [`1e7fa6b`](https://github.com/xyflow/xyflow/commit/1e7fa6b631f4e6fec4db8d3918465fa544f4299f) - Tightened `BaseEdgeProps.label` from `any` to `string | VNode | Component<EdgeTextProps>`, matching the actual label type of edges.



- [#5882](https://github.com/xyflow/xyflow/pull/5882) [`3334af0`](https://github.com/xyflow/xyflow/commit/3334af0a1cd5300abee75051f29e3373fd270b83) - Add `nodesDelete`, `edgesDelete`, and `delete` events, matching `@xyflow/react` (`onNodesDelete`/`onEdgesDelete`/`onDelete`) and `@xyflow/svelte` (`ondelete`). They fire from `deleteElements` (the choke point for both the delete key and programmatic deletion) after `onBeforeDelete` has resolved the removed set — `edgesDelete` with the removed edges, `nodesDelete` with the removed nodes (each only when non-empty), and `delete` with `{ nodes, edges }` whenever anything was removed. Also exports the `OnDelete` handler type alongside `OnBeforeDelete`.



- [#5914](https://github.com/xyflow/xyflow/pull/5914) [`96bfd42`](https://github.com/xyflow/xyflow/commit/96bfd42842790b15929d49b509f6549ec5c37603) - `<VueFlowProvider>` now accepts the same options as `setupVueFlow()` to seed its store — pass `nodes`, `edges`, or any other `VueFlowProps` and they become the initial values of the store. The seed is read once when the store is created.


### Patch Changes



- [#6046](https://github.com/xyflow/xyflow/pull/6046) [`e0be409`](https://github.com/xyflow/xyflow/commit/e0be409d4bfeb3cfb487a05d7db9b4decaef10b4) - Correct the pattern offset of `<Background>`, which was calculated as `offset * zoom || 1 + gap / 2`.
  That parses as `offset * zoom || (1 + gap / 2)`, so with the default `offset` of `0` the pattern sat one pixel off.


- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Clear the visual nodes-selection box when no selected nodes remain. `nodesSelectionActive` only ever turns on via a user drag-select, but it could get stuck `true` after the selected nodes were removed (e.g. deleted) — so a later programmatic select would wrongly render the `NodesSelection` rect around an unrelated node. Re-adopting nodes now turns it back off whenever the selection is empty.



- [#6085](https://github.com/xyflow/xyflow/pull/6085) [`fc128ca`](https://github.com/xyflow/xyflow/commit/fc128ca4590bd0f367138439110cdbbf4e1dd9b6) - Improve rendering performance, especially while dragging large selections:
  
  - Node drag updates are batched to one per animation frame.
  - Nodes, edges and the `<MiniMap>` re-render less during drags.
  - `removeSelectedNodes` / `removeSelectedEdges` only emit changes for elements that are actually selected.
  - Built-in edges no longer render their props (`source`, `sourceX`, `animated`, …) as attributes on the `<path>`, and `EdgeText` no longer re-measures its label on every position change.


- [#5945](https://github.com/xyflow/xyflow/pull/5945) [`7e4c422`](https://github.com/xyflow/xyflow/commit/7e4c4222efb05ba906234a5505f04fbee5db173c) - `EdgeWrapper` now computes edge positions with `getEdgePosition` from `@xyflow/system` (as `@xyflow/react` and `@xyflow/svelte` do) instead of a hand-rolled copy. It returns `null` when a node is not initialized or a handle cannot be resolved, so an edge between nodes that render no `<Handle>` draws nothing instead of a phantom line to the bounding box of the node. This also aligns handle resolution across connection modes with the other packages.



- [#5914](https://github.com/xyflow/xyflow/pull/5914) [`a86e6e5`](https://github.com/xyflow/xyflow/commit/a86e6e5a721594219dc2002b34c9a06ef3388bf2) - Dev warnings now link to the matching entry in the error reference, e.g. `Help: https://vueflow.dev/error#NODE_TYPE_MISSING`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Fix the `includeHiddenNodes` option of `fitView` being ignored.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Defer an imperative `fitView()` until the nodes are measured. A `fitView()` call made before the nodes settle — e.g. right after `addNodes()` — used to frame only the already-measured nodes (`getFitViewNodes` skips unmeasured ones) and ignore the new ones. It now waits for `nodesInitialized` before fitting, so the fit always frames the current nodes. An empty flow resolves immediately (nothing to wait for).



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Fix `isNodeIntersecting` with `partially: false` when the area is fully contained in the node. Previously only a node fully inside the area counted, now containment in either direction does, matching `getIntersectingNodes`.



- [#5881](https://github.com/xyflow/xyflow/pull/5881) [`9d13542`](https://github.com/xyflow/xyflow/commit/9d135421cb2fe3a357a64a71c3dcede87d6995bd) - `setEdges`/`addEdges` no longer drop edges whose source or target node is not in the store. Previously `validateEdges` discarded any edge with a missing endpoint at commit time, which silently deleted edges and made the order of `setNodes`/`setEdges` matter — adding edges before their nodes lost them. Edges are now kept and `EdgeWrapper` skips drawing them (emitting the existing `EDGE_SOURCE_MISSING`/`EDGE_TARGET_MISSING` dev warning) until both nodes exist. The `isValidConnection` gate still runs whenever both endpoint nodes are resolvable.



- [#5887](https://github.com/xyflow/xyflow/pull/5887) [`81d4b63`](https://github.com/xyflow/xyflow/commit/81d4b63d4a8e1b2d96a2570e0d5c91ea72f84361) - Multi-key `useKeyPress` combinations now match regardless of the order keys are pressed. The unused type-guard overload on `useNodesData`/`useEdgesData` is removed.



- [#6048](https://github.com/xyflow/xyflow/pull/6048) [`022cbc3`](https://github.com/xyflow/xyflow/commit/022cbc313b94221e2ee233176c00478fbeb2f8bb) - The `maskStrokeWidth` of `<MiniMap>` is now scaled by the view scale of the minimap.



- [#6048](https://github.com/xyflow/xyflow/pull/6048) [`022cbc3`](https://github.com/xyflow/xyflow/commit/022cbc313b94221e2ee233176c00478fbeb2f8bb) - `MiniMapNodeFunc` may now return `undefined` — its signature is `(node) => string | undefined` — so a per-node callback can fall back to the themed default for that node. An `undefined` `nodeColor`, `nodeStrokeColor` or `nodeClassName` no longer throws.



- [#6048](https://github.com/xyflow/xyflow/pull/6048) [`022cbc3`](https://github.com/xyflow/xyflow/commit/022cbc313b94221e2ee233176c00478fbeb2f8bb) - The `<svg>` inside `<MiniMap>` now carries the `vue-flow__minimap-svg` class.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Fix the intermittent `TS2589: Type instantiation is excessively deep` error on updates like `nodes.value = nodes.value.map(...)`. Nodes and edges are now excluded from the Vue `UnwrapRef`.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Honor `width`/`height` and `initialWidth`/`initialHeight` in the node visibility gate and inline size. The node wrapper previously gated visibility on `measured` alone, so a node sized via `width`/`initialWidth` stayed `visibility: hidden` until the `ResizeObserver` measured it, and in SSR (no `ResizeObserver`) it never became visible. Visibility now uses `nodeHasDimensions` from `@xyflow/system` (`measured ?? width ?? initialWidth`), and the inline size of the wrapper falls back through `initialWidth`/`initialHeight` before the node is measured (`initialWidth`/`initialHeight` are the SSR dimensions, since DOM cannot be measured server-side).



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Keep the current selection on a pane click when `elementsSelectable` is `false`. Previously a pane click always cleared the selection; now a selection set before selection was disabled, or set programmatically, survives the click. The interactive reset is centralized in a new gated `resetSelectedElements` action (a no-op while `elementsSelectable` is `false`), distinct from `removeSelectedNodes`/`removeSelectedEdges`, which still clear unconditionally.



- [#6115](https://github.com/xyflow/xyflow/pull/6115) [`b1ad016`](https://github.com/xyflow/xyflow/commit/b1ad01664671544df26b3acc7815626369c33a93) - Fire the pane context menu event when right-click panning is enabled (`panOnDrag` includes `2`).



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Export `ResizeControlVariant` as a value, not type-only. It is a runtime enum, but the bundled type declarations re-exported it through the NodeResizer barrel as `export type`, so `ResizeControlVariant.Line` / `.Handle` could not be used as a value in TypeScript consumers. It is now re-exported directly from the package root as a value.



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - A plain click on the pane no longer opens a selection box or fires `selectionStart`/`selectionEnd`. The selection (clearing the current selection + `selectionStart`) now begins only once the pointer moves past the click threshold (`paneDragThreshold`, or immediately while the selection key is held), and `nodesSelectionActive` / `selectionEnd` only update when a real selection drag happened — instead of resetting on every pointer-down and activating on every pointer-up.



- [#6064](https://github.com/xyflow/xyflow/pull/6064) [`de1e4c5`](https://github.com/xyflow/xyflow/commit/de1e4c5eff3c0961f510df9406919df2a1378da3) - Resolve the promises of animated viewport functions like `fitView` and `setCenter` with `false` when a user interaction or another viewport change interrupts the animation, instead of leaving them pending



- [#5891](https://github.com/xyflow/xyflow/pull/5891) [`ca9c2fb`](https://github.com/xyflow/xyflow/commit/ca9c2fbd470b809c631273a16dd8a1195e87d305) - Improve the return type of `useNodesData`. It now uses `DistributivePick` from `@xyflow/system` instead of a merged object type, so when you pass a union node type the result is a discriminated union — checking `.type` narrows `.data`:
  
  ```ts
  const node = useNodesData<MyNode>(id) // MyNode = TextNode | NumberNode
  if (node.value?.type === "text") {
    node.value.data.text // narrowed to TextNode data
  }
  ```
  
  For a single (non-union) node type the result is unchanged.


- [#6101](https://github.com/xyflow/xyflow/pull/6101) [`49a335e`](https://github.com/xyflow/xyflow/commit/49a335edf055cbb3614aecba0d322d66cf8406e3) - Build the `<Background>` pattern element id as `pattern-<flowId><id>`



- [#6101](https://github.com/xyflow/xyflow/pull/6101) [`63d077b`](https://github.com/xyflow/xyflow/commit/63d077b8bfb3fd2b2b5b43c1b70414af5f6bb687) - Holding the selection key now starts a selection box even when the drag begins over a node or edge.
  The element underneath no longer starts a drag of its own. A child marked with `nokey` still opts out, and a secondary pointer no longer opens a box.


- [#6101](https://github.com/xyflow/xyflow/pull/6101) [`c62aee5`](https://github.com/xyflow/xyflow/commit/c62aee54c7ca779e297c5f1e4fc568fa92bf17c9) - Do not start a selection box on touch when panning is enabled. A `panOnDrag` button array only restricts mouse input, so a touch drag now pans, unless the selection key is held.

- Updated dependencies [[`dff4dad`](https://github.com/xyflow/xyflow/commit/dff4dad7e654ac42e49771b3523e703196f72b15), [`dae45aa`](https://github.com/xyflow/xyflow/commit/dae45aa8273e6a55ab7e0bed21b5653cf4682e05), [`13bf20a`](https://github.com/xyflow/xyflow/commit/13bf20a596a51580f60457a3069c9c65e779df38), [`5d448e9`](https://github.com/xyflow/xyflow/commit/5d448e9a5b5eb14b1ff2083d642bd38fc4eb250f), [`fbe2ba5`](https://github.com/xyflow/xyflow/commit/fbe2ba54064e443360925eaa4481992435b70fec), [`96b196f`](https://github.com/xyflow/xyflow/commit/96b196f39a0fd7c94a2f9178c1bd4589375e6b32), [`69dc311`](https://github.com/xyflow/xyflow/commit/69dc31137917e7f09b09d8f769300ec32b709251), [`b872a5b`](https://github.com/xyflow/xyflow/commit/b872a5b38575bfcb754ae7975f648aa62a0835f8), [`1d9b9cd`](https://github.com/xyflow/xyflow/commit/1d9b9cd8b1464e159089355d3864e2d437396ff5), [`b1ad016`](https://github.com/xyflow/xyflow/commit/b1ad01664671544df26b3acc7815626369c33a93), [`de1e4c5`](https://github.com/xyflow/xyflow/commit/de1e4c5eff3c0961f510df9406919df2a1378da3), [`bf27626`](https://github.com/xyflow/xyflow/commit/bf2762661eb8f39168be89727951819ee72a8317), [`9fcddb8`](https://github.com/xyflow/xyflow/commit/9fcddb8684d094aaa160bd8f3371261cf36bc754), [`5161767`](https://github.com/xyflow/xyflow/commit/5161767ec4593ad24b52cd4502fb1946e2859e7d), [`615c5f6`](https://github.com/xyflow/xyflow/commit/615c5f6a41340b6474e5a9a8b415ca62233e1ee8), [`de1e4c5`](https://github.com/xyflow/xyflow/commit/de1e4c5eff3c0961f510df9406919df2a1378da3), [`8849014`](https://github.com/xyflow/xyflow/commit/8849014eafa7349d178cd9632d7cba33b7927184), [`7b52b50`](https://github.com/xyflow/xyflow/commit/7b52b50fe929d41318f0598537bb7a289d577ef2), [`885ac9e`](https://github.com/xyflow/xyflow/commit/885ac9e9875075428d71bcf92c3ce3abea85a112)]:
  - @xyflow/system@1.0.0
