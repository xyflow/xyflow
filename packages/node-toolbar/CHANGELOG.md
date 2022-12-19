# @reactflow/node-toolbar

## 1.1.0

### Patch Changes

- [#2660](https://github.com/wbkd/react-flow/pull/2660) [`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0) - Add `getNodes` function to the store so that you don't need to do `Array.from(store.getState().nodeInternals.values())` anymore.

- Updated dependencies [[`ab2ff374`](https://github.com/wbkd/react-flow/commit/ab2ff3740618da48bd4350597e816c397f3d78ff), [`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0), [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493), [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9), [`7ef29108`](https://github.com/wbkd/react-flow/commit/7ef2910808aaaee029894363d52efc0c378a7654), [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c)]:
  - @reactflow/core@11.4.0

## 1.1.0-next.1

### Minor Changes

- panOnDrag: Use numbers for prop ([1,2] = drag via middle or right mouse button)
  selection: do not include hidden nodes
  minimap: fix onNodeClick for nodes outside the viewport
  keys: allow multi select when input is focused

### Patch Changes

- Updated dependencies []:
  - @reactflow/core@11.4.0-next.1

## 1.1.0-next.0

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

- Updated dependencies [[`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0), [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493), [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9), [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c)]:
  - @reactflow/core@11.4.0-next.0

## 1.0.2

### Patch Changes

- [#2626](https://github.com/wbkd/react-flow/pull/2626) [`d29c401d`](https://github.com/wbkd/react-flow/commit/d29c401d598dbf2dcd5609b7adb8d029906a6f18) - Get nodeId from React Flow context if it is not passed explicitly as prop

- Updated dependencies [[`e6b5d90f`](https://github.com/wbkd/react-flow/commit/e6b5d90f61c8ee60e817bba232a162cae2ab3e2a), [`6ee44e07`](https://github.com/wbkd/react-flow/commit/6ee44e076eaa6908d07578a757a5187642b732ae), [`aa69c207`](https://github.com/wbkd/react-flow/commit/aa69c20765e6978f4f9c8cc63ed7110dbf6d9d9d), [`d29c401d`](https://github.com/wbkd/react-flow/commit/d29c401d598dbf2dcd5609b7adb8d029906a6f18), [`0df02f35`](https://github.com/wbkd/react-flow/commit/0df02f35f8d6c54dae36af18278feadc77acb2d6)]:
  - @reactflow/core@11.3.2

## 1.0.1

### Patch Changes

- [#2594](https://github.com/wbkd/react-flow/pull/2594) [`ec94d9ec`](https://github.com/wbkd/react-flow/commit/ec94d9ecdc964d6d66c04e9242f195614bbfdbbe) Thanks [@chrtze](https://github.com/chrtze)! - Allow multiple node ids to be passed for enabling multi selection toolbars

- Updated dependencies [[`c828bfda`](https://github.com/wbkd/react-flow/commit/c828bfda0a8c4774bc43588640c7cca0cfdcb3f4), [`b0302ce4`](https://github.com/wbkd/react-flow/commit/b0302ce4261a992bee841bae84af347d03be690f), [`b2c72813`](https://github.com/wbkd/react-flow/commit/b2c728137d1b53e38883f044fa447585c377a6af)]:
  - @reactflow/core@11.3.1

## 1.0.0

### Major Changes

- [#2563](https://github.com/wbkd/react-flow/pull/2563) [`98116d43`](https://github.com/wbkd/react-flow/commit/98116d431f9fcdcc9b23a5b606a94ec0740b64cd) Thanks [@chrtze](https://github.com/chrtze)! - Export a new component "NodeToolbar" that renders a fixed element attached to a node
