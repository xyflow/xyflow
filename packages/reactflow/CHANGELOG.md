# reactflow

## 11.1.2

Housekeeping release with some fixes and some cleanups for the types.

### Patch Changes

- make pro options acc type optional
- cleanup types
- fix rf id handling
- always render nodes when dragging=true
- don't apply animations to helper edge
- Updated dependencies:
  - @reactflow/core@11.1.2
  - @reactflow/background@11.0.3
  - @reactflow/controls@11.0.3
  - @reactflow/minimap@11.0.3

## 11.1.1

### Patch Changes

- [`c44413d`](https://github.com/wbkd/react-flow/commit/c44413d816604ae2d6ad81ed227c3dfde1a7bd8a) Thanks [@moklick](https://github.com/moklick)! - chore(panel): dont break user selection above panel
- [`48c402c`](https://github.com/wbkd/react-flow/commit/48c402c4d3bd9e16dc91cd4c549324e57b6d5c57) Thanks [@moklick](https://github.com/moklick)! - refactor(aria-descriptions): render when disableKeyboardA11y is true
- [`3a1a365`](https://github.com/wbkd/react-flow/commit/3a1a365a63fc4564d9a8d96309908986fcc86f95) Thanks [@moklick](https://github.com/moklick)! - fix(useOnSelectionChange): repair hook closes #2484
- [`5d35094`](https://github.com/wbkd/react-flow/commit/5d350942d33ded626b3387206f0b0dee368efdfb) Thanks [@neo](https://github.com/neo)! - Add css files as sideEffects

- Updated dependencies:
  - @reactflow/background@11.0.2
  - @reactflow/core@11.1.1
  - @reactflow/controls@11.0.2
  - @reactflow/minimap@11.0.2

## 11.1.0

### Minor Changes

- [`def11008`](https://github.com/wbkd/react-flow/commit/def11008d88749fec40e6fcba8bc41eea2511bab) Thanks [@moklick](https://github.com/moklick)! - New props: nodesFocusable and edgesFocusable

### Patch Changes

- [`d00faa6b`](https://github.com/wbkd/react-flow/commit/d00faa6b3e77388bfd655d4c02e9a5375bc515e4) Thanks [@moklick](https://github.com/moklick)! - Make nopan class name overwritable with class name option

- Updated dependencies [[`def11008`](https://github.com/wbkd/react-flow/commit/def11008d88749fec40e6fcba8bc41eea2511bab), [`def11008`](https://github.com/wbkd/react-flow/commit/def11008d88749fec40e6fcba8bc41eea2511bab), [`d00faa6b`](https://github.com/wbkd/react-flow/commit/d00faa6b3e77388bfd655d4c02e9a5375bc515e4)]:
  - @reactflow/background@11.0.1
  - @reactflow/core@11.1.0
  - @reactflow/controls@11.0.1
  - @reactflow/minimap@11.0.1

## 11.0.0

Finally it's here! A new version that comes with lots of improvements and the new package name `reactflow`.
From now on you can install it via `npm install reactflow`.

## Major Changes

- Importing CSS via `reactflow/dist/style.css` is mandatory
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

### Patch Changes

- Updated dependencies:
  - @reactflow/background@11.0.0
  - @reactflow/controls@11.0.0
  - @reactflow/core@11.0.0
  - @reactflow/minimap@11.0.0
