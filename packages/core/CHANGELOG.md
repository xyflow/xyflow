# @reactflow/core

## 11.4.0

## New Features 

New props for the ReactFlow component to customize the controls of the viewport and the selection box better:

1. `selectionOnDrag` prop: Selection box without extra button press (need to set `panOnDrag={false}` or `panOnDrag={[1, 2]}`)
2. `panOnDrag={[0, 1, 2]}` option to configure specific mouse buttons for panning
3. `panActivationKeyCode="Space"` key code for activating dragging (useful when using `selectionOnDrag`)
4. `selectionMode={SelectionMode.Full}`: you can chose if the selection box needs to contain a node fully (`SelectionMode.Full`) or partially (`SelectionMode.Partial`) to select it
5. `onSelectionStart` and `onSelectionEnd` events
6. `elevateNodesOnSelect`: Defines if z-index should be increased when node is selected
7. New store function `getNodes`. You can now do `store.getState().getNodes()` instead of `Array.from(store.getNodes().nodeInternals.values())`.

Thanks to @jackfishwick who helped a lot with the new panning and selection options.

### Minor Changes

- [#2678](https://github.com/wbkd/react-flow/pull/2678) [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493)
  - Add new props to configure viewport controls (`selectionOnDrag`, `panActivationKeyCode`, ..)
- [#2661](https://github.com/wbkd/react-flow/pull/2661) [`7ef29108`](https://github.com/wbkd/react-flow/commit/7ef2910808aaaee029894363d52efc0c378a7654)
  - panOnDrag: Use numbers for prop ([1,2] = drag via middle or right mouse button)
  - selection: do not include hidden nodes
  - minimap: fix onNodeClick for nodes outside the viewport
  - keys: allow multi select when input is focused

### Patch Changes

- [#2695](https://github.com/wbkd/react-flow/pull/2695) [`ab2ff374`](https://github.com/wbkd/react-flow/commit/ab2ff3740618da48bd4350597e816c397f3d78ff) - Add elevateNodesOnSelect prop
- [#2660](https://github.com/wbkd/react-flow/pull/2660) [`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0) - Add `getNodes` function to the store so that you don't need to do `Array.from(store.getState().nodeInternals.values())` anymore.
- [#2659](https://github.com/wbkd/react-flow/pull/2659) [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9) - Use translateExtent correctly
- [#2657](https://github.com/wbkd/react-flow/pull/2657) [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c) - Only trigger drag event when change happened

## 11.4.0-next.1

### Minor Changes

- panOnDrag: Use numbers for prop ([1,2] = drag via middle or right mouse button)
- selection: do not include hidden nodes
- minimap: fix onNodeClick for nodes outside the viewport
- keys: allow multi select when input is focused

## 11.4.0-next.0

### Minor Changes

- [#2678](https://github.com/wbkd/react-flow/pull/2678) [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493) Thanks [@moklick](https://github.com/moklick)! - ## New Features

  New props for the ReactFlow component to customize the controls of the viewport and the selection box better:

  1. `selectionOnDrag` prop: Selection box without extra button press (need to set `panOnDrag={false} or `panOnDrag="RightClick"`)
  2. `panOnDrag="RightClick"` option
  3. `panActivationKeyCode="Space"` key code for activating dragging (useful when using `selectionOnDrag`)
  4. `selectionMode={SelectionMode.Full}`: you can chose if the selection box needs to contain a node fully (`SelectionMode.Full`) or partially (`SelectionMode.Partial`) to select it
  5. `onSelectionStart` and `onSelectionEnd` events

### Patch Changes

- [#2660](https://github.com/wbkd/react-flow/pull/2660) [`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0) Thanks [@moklick](https://github.com/moklick)! - Add `getNodes` function to the store so that you don't need to do `Array.from(store.getState().nodeInternals.values())` anymore.

- [#2659](https://github.com/wbkd/react-flow/pull/2659) [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9) Thanks [@moklick](https://github.com/moklick)! - Use translateExtent correctly

- [#2657](https://github.com/wbkd/react-flow/pull/2657) [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c) Thanks [@moklick](https://github.com/moklick)! - Only trigger drag event when change happened

## 11.3.2

In this update we did some changes so that we could implement the new [`<NodeResizer />`](https://reactflow.dev/docs/api/nodes/node-resizer/) component more smoothly.

### Patch Changes

- [#2646](https://github.com/wbkd/react-flow/pull/2646) [`e6b5d90f`](https://github.com/wbkd/react-flow/commit/e6b5d90f61c8ee60e817bba232a162cae2ab3e2a) - Fix getRectOfNodes
- [#2648](https://github.com/wbkd/react-flow/pull/2648) [`6ee44e07`](https://github.com/wbkd/react-flow/commit/6ee44e076eaa6908d07578a757a5187642b732ae) - Allow middle mouse pan over edges
- [#2647](https://github.com/wbkd/react-flow/pull/2647) [`aa69c207`](https://github.com/wbkd/react-flow/commit/aa69c20765e6978f4f9c8cc63ed7110dbf6d9d9d) Thanks [@neo](https://github.com/neo)! - Invalidate node trying to connect itself with the same handle
- [#2626](https://github.com/wbkd/react-flow/pull/2626) [`d29c401d`](https://github.com/wbkd/react-flow/commit/d29c401d598dbf2dcd5609b7adb8d029906a6f18) - Export the useNodeId hook, refactor how changes are applied and create a helper function
- [#2642](https://github.com/wbkd/react-flow/pull/2642) [`0df02f35`](https://github.com/wbkd/react-flow/commit/0df02f35f8d6c54dae36af18278feadc77acb2d6) - Ignore key events for nodes when input is focused

## 11.3.1

### Patch Changes

- [#2595](https://github.com/wbkd/react-flow/pull/2595) [`c828bfda`](https://github.com/wbkd/react-flow/commit/c828bfda0a8c4774bc43588640c7cca0cfdcb3f4) Thanks [@chrtze](https://github.com/chrtze)! - Fix and improve the behaviour when using nodeOrigin in combination with subflows
- [#2602](https://github.com/wbkd/react-flow/pull/2602) [`b0302ce4`](https://github.com/wbkd/react-flow/commit/b0302ce4261a992bee841bae84af347d03be690f) Thanks [@sdegueldre](https://github.com/sdegueldre)! - Don't use try catch in wrapper for checking if provider is available
- [#2601](https://github.com/wbkd/react-flow/pull/2601) [`b2c72813`](https://github.com/wbkd/react-flow/commit/b2c728137d1b53e38883f044fa447585c377a6af) Thanks [@hoondeveloper](https://github.com/hoondeveloper)! - fix isRectObject function

## 11.3.0

### Minor Changes

- [#2563](https://github.com/wbkd/react-flow/pull/2563) [`98116d43`](https://github.com/wbkd/react-flow/commit/98116d431f9fcdcc9b23a5b606a94ec0740b64cd) Thanks [@chrtze](https://github.com/chrtze)! - Export a new component "NodeToolbar" that renders a fixed element attached to a node

### Patch Changes

- [#2561](https://github.com/wbkd/react-flow/pull/2561) [`92cf497e`](https://github.com/wbkd/react-flow/commit/92cf497eb72f21af592a53f5af9770c9f1e6d940) Thanks [@moklick](https://github.com/moklick)! - Fix multi selection and fitView when nodeOrigin is used
- [#2560](https://github.com/wbkd/react-flow/pull/2560) [`a39224b3`](https://github.com/wbkd/react-flow/commit/a39224b3a80afbdb83fc4490dd5f4f2be23cd4dd) Thanks [@neo](https://github.com/neo)! - Always elevate zIndex when node is selected
- [#2573](https://github.com/wbkd/react-flow/pull/2573) [`5e8b67dd`](https://github.com/wbkd/react-flow/commit/5e8b67dd41f9bb60dcd7f5d14cc34b42c970e967) Thanks [@moklick](https://github.com/moklick)! - Fix disappearing connection line for loose flows
- [#2558](https://github.com/wbkd/react-flow/pull/2558) [`2a1c7db6`](https://github.com/wbkd/react-flow/commit/2a1c7db6b27ac0f4f81dcef2d593f4753c4321c7) Thanks [@moklick](https://github.com/moklick)! - EdgeLabelRenderer: handle multiple instances on a page

## 11.2.0

### Minor Changes

- [#2535](https://github.com/wbkd/react-flow/pull/2535) [`7902a3ce`](https://github.com/wbkd/react-flow/commit/7902a3ce3188426d5cd07cf0943a68f679e67948) Thanks [@moklick](https://github.com/moklick)! - Feat: Add edge label renderer
- [#2536](https://github.com/wbkd/react-flow/pull/2536) [`b25d499e`](https://github.com/wbkd/react-flow/commit/b25d499ec05b5c6f21ac552d03650eb37433552e) Thanks [@pengfu](https://github.com/pengfu)! - Feat: add deleteElements helper function
- [#2539](https://github.com/wbkd/react-flow/pull/2539) [`4fc1253e`](https://github.com/wbkd/react-flow/commit/4fc1253eadf9b7dd392d8dc2348f44fa8d08f931) Thanks [@moklick](https://github.com/moklick)! - Feat: add intersection helpers
- [#2530](https://github.com/wbkd/react-flow/pull/2530) [`8ba4dd5d`](https://github.com/wbkd/react-flow/commit/8ba4dd5d1d4b2e6f107c148de62aec0b688d8b21) Thanks [@moklick](https://github.com/moklick)! - Feat: Add pan and zoom to mini map

### Patch Changes

- [#2538](https://github.com/wbkd/react-flow/pull/2538) [`740659c0`](https://github.com/wbkd/react-flow/commit/740659c0e788c7572d4a1e64e1d33d60712233fc) Thanks [@neo](https://github.com/neo)! - Refactor: put React Flow in isolated stacking context

## 11.1.2

### Patch Changes

- make pro options acc type optional
- cleanup types
- fix rf id handling
- always render nodes when dragging=true
- don't apply animations to helper edge

## 11.1.1

### Patch Changes

- [`c44413d`](https://github.com/wbkd/react-flow/commit/c44413d816604ae2d6ad81ed227c3dfde1a7bd8a) Thanks [@moklick](https://github.com/moklick)! - chore(panel): dont break user selection above panel
- [`48c402c`](https://github.com/wbkd/react-flow/commit/48c402c4d3bd9e16dc91cd4c549324e57b6d5c57) Thanks [@moklick](https://github.com/moklick)! - refactor(aria-descriptions): render when disableKeyboardA11y is true
- [`3a1a365`](https://github.com/wbkd/react-flow/commit/3a1a365a63fc4564d9a8d96309908986fcc86f95) Thanks [@moklick](https://github.com/moklick)! - fix(useOnSelectionChange): repair hook closes #2484
- [`5d35094`](https://github.com/wbkd/react-flow/commit/5d350942d33ded626b3387206f0b0dee368efdfb) Thanks [@neo](https://github.com/neo)! - Add css files as sideEffects

## 11.1.0

### Minor Changes

- [`def11008`](https://github.com/wbkd/react-flow/commit/def11008d88749fec40e6fcba8bc41eea2511bab) Thanks [@moklick](https://github.com/moklick)! - New props: nodesFocusable and edgesFocusable

### Patch Changes

- [`d00faa6b`](https://github.com/wbkd/react-flow/commit/d00faa6b3e77388bfd655d4c02e9a5375bc515e4) Thanks [@moklick](https://github.com/moklick)! - Make nopan class name overwritable with class name option

## 11.0.0

### Major Changes

- **Better [Accessibility](/docs/guides/accessibility)**
  - Nodes and edges are focusable, selectable, moveable and deleteable with the keyboard.
  - `aria-` default attributes for all elements and controllable via `ariaLabel` options
  - Keyboard controls can be disabled with the new `disableKeyboardA11y` prop
- **Better selectable edges** via new edge option: `interactionWidth` - renders invisible edge that makes it easier to interact
- **Better routing for smoothstep and step edges**: https://twitter.com/reactflowdev/status/1567535405284614145
- **Nicer edge updating behaviour**: https://twitter.com/reactflowdev/status/1564966917517021184
- **Node origin**: The new `nodeOrigin` prop lets you control the origin of a node. Useful for layouting.
- **New background pattern**: `BackgroundVariant.Cross` variant
- **[`useOnViewportChange`](/docs/api/hooks/use-on-viewport-change) hook** - handle viewport changes within a component
- **[`useOnSelectionChange`](/docs/api/hooks/use-on-selection-change) hook** - handle selection changes within a component
- **[`useNodesInitialized`](/docs/api/hooks/use-nodes-initialized) hook** - returns true if all nodes are initialized and if there is more than one node
- **Deletable option** for Nodes and edges
- **New Event handlers**: `onPaneMouseEnter`, `onPaneMouseMove` and `onPaneMouseLeave`
- **Edge `pathOptions`** for `smoothstep` and `default` edges
- **Nicer cursor defaults**: Cursor is grabbing, while dragging a node or panning
- **Pane moveable** with middle mouse button
- **Pan over nodes** when they are not draggable (`draggable=false` or `nodesDraggable` false)
- **[`<BaseEdge />`](/docs/api/edges/base-edge) component** that makes it easier to build custom edges
- **[Separately installable packages](/docs/overview/packages/)**
  - @reactflow/core
  - @reactflow/background
  - @reactflow/controls
  - @reactflow/minimap
