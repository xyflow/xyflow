# @reactflow/background

## 11.0.3

### Patch Changes

- cleanup types
- cleanup rf id handling
- Updated dependencies:
  - @reactflow/core@11.1.2

## 11.0.2

### Patch Changes

- Updated dependencies:
  - @reactflow/core@11.1.1

## 11.0.1

### Patch Changes

- [`def11008`](https://github.com/wbkd/react-flow/commit/def11008d88749fec40e6fcba8bc41eea2511bab) Thanks [@moklick](https://github.com/moklick)! - default gap = 20

- Updated dependencies [[`def11008`](https://github.com/wbkd/react-flow/commit/def11008d88749fec40e6fcba8bc41eea2511bab), [`d00faa6b`](https://github.com/wbkd/react-flow/commit/d00faa6b3e77388bfd655d4c02e9a5375bc515e4)]:
  - @reactflow/core@11.1.0

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

### Patch Changes

- Updated dependencies:
  - @reactflow/core@11.0.0
