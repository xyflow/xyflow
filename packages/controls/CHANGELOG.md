# @reactflow/controls

## 11.1.0

### Patch Changes

- Updated dependencies [[`ab2ff374`](https://github.com/wbkd/react-flow/commit/ab2ff3740618da48bd4350597e816c397f3d78ff), [`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0), [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493), [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9), [`7ef29108`](https://github.com/wbkd/react-flow/commit/7ef2910808aaaee029894363d52efc0c378a7654), [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c)]:
  - @reactflow/core@11.4.0

## 11.1.0-next.1

### Minor Changes

- panOnDrag: Use numbers for prop ([1,2] = drag via middle or right mouse button)
- selection: do not include hidden nodes
- minimap: fix onNodeClick for nodes outside the viewport
- keys: allow multi select when input is focused

### Patch Changes

- Updated dependencies []:
  - @reactflow/core@11.4.0-next.1

## 11.0.8-next.0

### Patch Changes

- Updated dependencies [[`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0), [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493), [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9), [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c)]:
  - @reactflow/core@11.4.0-next.0

## 11.0.7

### Patch Changes

- Updated dependencies [[`e6b5d90f`](https://github.com/wbkd/react-flow/commit/e6b5d90f61c8ee60e817bba232a162cae2ab3e2a), [`6ee44e07`](https://github.com/wbkd/react-flow/commit/6ee44e076eaa6908d07578a757a5187642b732ae), [`aa69c207`](https://github.com/wbkd/react-flow/commit/aa69c20765e6978f4f9c8cc63ed7110dbf6d9d9d), [`d29c401d`](https://github.com/wbkd/react-flow/commit/d29c401d598dbf2dcd5609b7adb8d029906a6f18), [`0df02f35`](https://github.com/wbkd/react-flow/commit/0df02f35f8d6c54dae36af18278feadc77acb2d6)]:
  - @reactflow/core@11.3.2

## 11.0.6

### Patch Changes

- Updated dependencies [[`c828bfda`](https://github.com/wbkd/react-flow/commit/c828bfda0a8c4774bc43588640c7cca0cfdcb3f4), [`b0302ce4`](https://github.com/wbkd/react-flow/commit/b0302ce4261a992bee841bae84af347d03be690f), [`b2c72813`](https://github.com/wbkd/react-flow/commit/b2c728137d1b53e38883f044fa447585c377a6af)]:
  - @reactflow/core@11.3.1

## 11.0.5

### Patch Changes

- Updated dependencies [[`92cf497e`](https://github.com/wbkd/react-flow/commit/92cf497eb72f21af592a53f5af9770c9f1e6d940), [`98116d43`](https://github.com/wbkd/react-flow/commit/98116d431f9fcdcc9b23a5b606a94ec0740b64cd), [`a39224b3`](https://github.com/wbkd/react-flow/commit/a39224b3a80afbdb83fc4490dd5f4f2be23cd4dd), [`5e8b67dd`](https://github.com/wbkd/react-flow/commit/5e8b67dd41f9bb60dcd7f5d14cc34b42c970e967), [`2a1c7db6`](https://github.com/wbkd/react-flow/commit/2a1c7db6b27ac0f4f81dcef2d593f4753c4321c7)]:
  - @reactflow/core@11.3.0

## 11.0.4

### Patch Changes

- Updated dependencies [[`740659c0`](https://github.com/wbkd/react-flow/commit/740659c0e788c7572d4a1e64e1d33d60712233fc), [`7902a3ce`](https://github.com/wbkd/react-flow/commit/7902a3ce3188426d5cd07cf0943a68f679e67948), [`b25d499e`](https://github.com/wbkd/react-flow/commit/b25d499ec05b5c6f21ac552d03650eb37433552e), [`4fc1253e`](https://github.com/wbkd/react-flow/commit/4fc1253eadf9b7dd392d8dc2348f44fa8d08f931), [`8ba4dd5d`](https://github.com/wbkd/react-flow/commit/8ba4dd5d1d4b2e6f107c148de62aec0b688d8b21)]:
  - @reactflow/core@11.2.0

## 11.0.3

### Patch Changes

- cleanup types
- Updated dependencies:
  - @reactflow/core@11.1.2

## 11.0.2

### Patch Changes

- Updated dependencies:
  - @reactflow/core@11.1.1

## 11.0.1

### Patch Changes

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
