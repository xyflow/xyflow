# @xyflow/svelte

## 0.0.39

## ⚠️ Breaking changes

- `on:nodedragstart`, `on:nodedrag` and `on:nodedragstop` are also getting fired if a selection bix is being dragged. We renamed the `node` param to `targetNode` and set it to `null` if a selection is being dragged.

## Patch changes

- export `EdgeLabel` component
- add "connectionindicator" class for `Handle` component
- address a11y warnings

## 0.0.38

## ⚠️ Breaking changes

- `NodeProps` generic is a node and not only node data. `type $$Props = NodeProps<AppNode>`  

## Patch changes

- unify `Edge` and `Node` type handling
- fix safari: prevent selection of viewport

## 0.0.37

## ⚠️ Breaking changes

- `useNodesData` not only returns data objects but also the type and the id of the node
- status class names for Handle components are slightly different. It's now "connectingfrom" and "connectingto" instead of "connecting"

## Patch changes

- better cursor defaults for the pane, nodes and edges
- add `initialWidth` and `initialHeight` node attributes for specifying initial dimensions for ssr
- always re-measure nodes when new nodes get passed
- fix `NodeResizer` when used in combination with `nodeOrigin`

## 0.0.36

## Patch changes

- a better NodeResizer (child nodes do not move when parent node gets resized)
- fix `on:panecontextmenu`
- add `role="button"` to `<EdgeLabel />` to prevent a11y warnings
- don't delete node when input is focused and user presses Backspace + Ctrl (or any other mod key)
- `useHandleConnections`: use context node id when no node id is passed  
- don't trigger drag start / end when node is not draggable

## 0.0.35

## Minor changes

- add `getNode`, `getNodes`, `getEdge` and `getEdges` to `useSvelteFlow`
- add `useInitialized` / `useNNodesInitialized` hooks and `oninit` handler

## Patch changes

- selection box is not interrupted by selectionKey being let go
- Edge label has a default background and is clickable
- do not use fallback handle if a specific id is being used
- use correct id for `<Handle />` data-id attribute
- fix `getNodesBounds` and add second param for passing options

## 0.0.34

## Minor changes

- add second option param to `screenToFlowPosition` for configuring if `snapToGrid` should be used
- add slot to `Controls`

## Patch changes

- cleanup `ControlButton` types
- infer types for `getIncomers`, `getOutgoers`, `updateEdge`, `addEdge` and `getConnectedEdges` thanks @joeyballentine
- refactor handles: prefix with flow id for handling nested flows
- add comments for types like `SvelteFlowProps` or `Node` for a better developer experience

## 0.0.33

### Bugfix

- fix `deleteElements`
- fix dragging when `draggable=false`
- add `ariaLabel` prop for `<Controls />`

### ⚠️ Breaking

- `deleteElements` function now takes one object as an argument `{ nodes: [], edges: [] }` instead of two `(nodes, edges)`  

## 0.0.32

### Features

- add `NodeResizer` and `NodeResizeControl` components for resizing nodes

## 0.0.31

### Bugfix

- fix edge rendering

## 0.0.30

### Features

- add `onbeforedelete` handler to prevent/ manage deletions
- TSDocs for hooks and some types 

### Patch changes

- new nodeDragThreshold default is 1
- refactor/simplify edge rendering

## 0.0.29

Another huge update for Svelte Flow 🙏 Handling data flows will be way easier with the new hooks and functions. You can now subscribe to connected nodes, receive data and update nodes more easily. We fix a big issue about the `<Handle />` component. No more `on:connect` that only worked for target `<Handle />` components but `onconnect` and `ondisconnect` that works for every `<Handle />`.

### Features

- add `useHandleConnections` hook for receiving connected node and handle ids for a specific handle
- add `useNodesData(ids: string | string[])` hook for receiving data from other nodes
- export `updateNode` and `updateNodeData` from `useSvelteFlow` to update a node or the data object
- add `onedgecreate` function for passing a certain id or other attributes to a newly created edge

### ⚠️ Breaking

- replace `on:connect`, `on:connectstart` and `on:connectend` with `onconnect`, `onconnectstart` and `onconnectend`, no need to forward `on:connect..` anymore

### Fixes and minor changes

- `onconnect` and `ondisconnect` callback work for `<Handle />` component
- don't delete a node when user presses Backspace inside an input/textarea/.nokey element
- `bgColor` prop for Background didn't work
- prefix css vars with "xy-"
- don't update nodes and edges on pane click if not necessary
- cleaner types for exported edges
- fix `getIntersectingNodes` bug when passing `Rect`

## 0.0.28

This is a huge update! We added a new `<NodeToolbar />` component and a new `colorMode` ('light' | 'dark' | 'system') prop for toggling dark/light mode.

There are also some breaking changes again (sorry!) but we are very close to the final API for Svelte Flow 1.0.0. The biggest change is that we group node attriubutes (`width`, `height`, `positionAbsolute`) that are added by the library under `node.computed`. This makes it easier to understand, that this stuff comes from the library itself. `node.width` and `node.height` is still an optional node option and can be used to set certain dimensions for SSR or on the client.

- add `<NodeToolbar />` component
- add `on:selectionclick` and `on:selectioncontextmenu` event handlers
- add `ondelete({ nodes, edges })` handler
- add `zoomActivationKey` prop
- add `width` and `height` prop to custom `NodeProps` type
- add `colorMode` prop ('light' | 'dark' | 'system')
- ⚠️ replace `xPos` and `yPos` with `positionAbsolute` prop to custom `NodeProps` type
- ⚠️ `node.width/height` and `node.positionAbsolute` can now be found under `node.computed.width/height/positionAbsolute`
- ⚠️ `node.width/height` is still optional an can be used for forcing certain dimensions and SSR
- refactor keys: you can now disable keys by setting them to `null` (e.g. `selectionKey={null}`)
- performance optimization with internal node lookup

## 0.0.27

- add `selectionOnDrag` prop - can be used to create figma-like controls in combination with `panOnDrag={false}` / `panOnDrag={[1, 2]}` + `panOnScroll={true}`
- ⚠️ rename `screenToFlowCoordinate` to `screenToFlowPosition`
- ⚠️ rename `flowToScreenCoordinate` to `flowToScreenPosition`
- ⚠️ rename `getTransformForBounds` to `getViewportForBounds` (return `{ x: number, y: number, zoom: number }` instead of `[number, number, number]`)
- ⚠️ rename `getRectOfNodes` to `getNodesBounds`
- simplify handle default styles, so that it's easier to override them
- added e2e tests

## 0.0.26

- fixes broken version on npm

## 0.0.25

- add `toObject` to `useSvelteFlow` hook
- export `BezierEdge`, `StepEdge` and `SmoothStepEdge` components
- handle window resize (Minimap updates its viewport)
- fix wrongly selected nodes
- fix connection line z-index
- fix broken edges (`interactionWidth` was missing)

## 0.0.24

- update node automatically when `type`, `sourcePosition` or `targetPosition` option changes
- prevent dev tool warnings when using built-in node types
- updates `useSvelteFlow` hook:
- add node type "group"
- add `class` prop for BaseEdge
- add `id` prop for Background
- add `selected` prop for MiniMap Node
- rename Controls prop `showInteractive` to `showLock`

## 0.0.23

- updates `useSvelteFlow` hook:
  - add `screenToFlowCoordinate` and `flowToScreenCoordinate`
  - add `getConnectedEdges`, `getIncomers` and `getOutgoers`
  - add `deleteElements`
  - add `fitBounds`
  - add `getIntersectingNodes` and `isNodeIntersecting`
- add `useConnection` hook
- add `useNodes` hook
- add `useEdges` hook
- add `viewport` prop (writable viewport)
- fix selection style
- fix Background component with lines variant

## 0.0.22

- add `connectionLine` slot for rendering a custom connection line
- add `connectionLineStyle` and `connectionLineContainerStyle` props
- add `useConnection` hook
- add `nodeDragThreshold` prop
- add `fitViewOptions` prop
- add `defaultEdgeOptions` prop
- add `on:edgecontextmenu` event handler prop
- add `connectionMode` prop
- add `attributionPosition` prop

## 0.0.21

- add `on:nodedragstart`, `on:nodedrag` and `on:nodedragstop`
- add `on:nodecontextmenu`

## 0.0.20

- [breaking change] use same convention for all custom events: Always pass the original event if possible and additional data
  - before: `on:nodeclick: CustomEvent<Node>`
  - after: `on:nodeclick: CustomEvent<{event: MouseEvent, node: Node}>`
- fix `on:connectstart` and `on:connectend` handlers
- fix default styles for `<Controls />` component
- fix `dragHandle` node option
- expose `style` prop for minimap

## 0.0.19

- make it possible to change edge type dynamically
- fix `hidden` option for nodes and edges
- add `useUpdateNodeInternals` hook

## 0.0.18

- add `nodesDraggable` prop
- minimap: add default background

## 0.0.17

- export `useStore` to access internals

## 0.0.16

- center edge label by default

## 0.0.15

- fix wrongly displayed connectionline

## 0.0.14

- export css correctly

## 0.0.13

- [breaking change] from now on it's necessary to import the styles like `@xyflow/svelte/styles/style.css` or `@xyflow/svelte/styles/base.css`. This makes it easier to work with tailwind or overwrite styles with regular CSS.

## 0.0.7 ... 0.0.12

- fix event handlers and rename from `on:node:click` to `on:nodeclick`
- add `panActivationKey` prop
- elevate nodes by default when selected
- use css vars internally and let users overwrite them

## 0.0.6

- use svelte 4

## 0.0.5

this release fixes the path bug introduced in 0.0.4

## 0.0.4

this version is broken because of a wrong path in the package.json

## 0.0.3

- add `snapGrid` prop
- add `onlyRenderVisibleElements` prop
- cleanup some exports and types

## 0.0.2

- add `connectionRadius`

## 0.0.1

Svelte Flow alpha is here 🔥 You can expect some changes until we reach 1.0.0 but we try to stick as close as possible to the React Flow API. There are no docs yet, but we are working on it! For now the easiest way is to use the autocomplete of your IDE, lookup the props in the SvelteFlow component or check out the React Flow docs.

This very first release comes with lots of features already:

- pass `nodes` and `edges` as writables
- draggable, selectable and deletable nodes
- support for custom `nodeTypes` and `edgeTypes`
- basic viewport settings like `fitView`, `minZoom` and `maxZoom`
- additional components: `<MiniMap />`, `<Controls />` & `<Background />` 
