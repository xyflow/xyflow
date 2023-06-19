# @reactflow/node-resizer

## 2.1.1

### Patch Changes

- [#3150](https://github.com/wbkd/react-flow/pull/3150) [`880a5932`](https://github.com/wbkd/react-flow/commit/880a593292ce5fdff30b656c2a1290cf98771818) Thanks [@goliney](https://github.com/goliney)! - add onResize/onResizeStart/onResizeEnd to useEffect deps

- Updated dependencies [[`52dbac5a`](https://github.com/wbkd/react-flow/commit/52dbac5a56c092504256f947df7a959eb07385c6), [`3a277cb1`](https://github.com/wbkd/react-flow/commit/3a277cb123a886af093cee694c289c7e139c79ef)]:
  - @reactflow/core@11.7.3

## 2.1.0

### Minor Changes

- [#2900](https://github.com/wbkd/react-flow/pull/2900) [`b1190837`](https://github.com/wbkd/react-flow/commit/b11908370bc438ca8d4179497cd4eb1f8c656798) Thanks [@stffabi](https://github.com/stffabi)! - add `maxWidth` and `maxHeight` props
- [#2900](https://github.com/wbkd/react-flow/pull/2900) [`b1190837`](https://github.com/wbkd/react-flow/commit/b11908370bc438ca8d4179497cd4eb1f8c656798) - add `keepAspectRatio` prop

### Patch Changes

- Updated dependencies [[`3d5764ca`](https://github.com/wbkd/react-flow/commit/3d5764cac6548984a30cbf85899024e62fd69425), [`83fc4675`](https://github.com/wbkd/react-flow/commit/83fc467545527729633e817dbccfe59d0040da4b), [`b1190837`](https://github.com/wbkd/react-flow/commit/b11908370bc438ca8d4179497cd4eb1f8c656798), [`5fabd272`](https://github.com/wbkd/react-flow/commit/5fabd2720f6367f75f79a45822d8f675a3b8e1cf), [`8f080bd5`](https://github.com/wbkd/react-flow/commit/8f080bd5e0e7e6c71f51eee9c9f2bc4b25182861), [`b8886514`](https://github.com/wbkd/react-flow/commit/b88865140c72fa7e92a883498768000cb2cc96a7), [`16bf89f2`](https://github.com/wbkd/react-flow/commit/16bf89f2b7bbf8449c00d0e2c07c19c3ff6d2533)]:
  - @reactflow/core@11.6.0

## 2.0.1

### Patch Changes

- [#2792](https://github.com/wbkd/react-flow/pull/2792) [`d8c679b4`](https://github.com/wbkd/react-flow/commit/d8c679b4c90c5b57d4b51e4aaa988243d6eaff5a) - Accept React 17 types as dev dependency

- Updated dependencies [[`d8c679b4`](https://github.com/wbkd/react-flow/commit/d8c679b4c90c5b57d4b51e4aaa988243d6eaff5a)]:
  - @reactflow/core@11.5.2

## 2.0.0

After this update it should be easier to update the node resizer (no need to update the reactflow package anymore).

New props:

- `shouldResize`: user can pass a function that determines if resize should be executed
- `direction`: gets passed as an attribute on resize

### Major Changes

- [#2749](https://github.com/wbkd/react-flow/pull/2749) [`e347dd82`](https://github.com/wbkd/react-flow/commit/e347dd82d342bf9c4884ca667afaa5cf639283e5) - Add `shouldResize`, rename and cleanup types - `ResizeEventParams` is now `ResizeParams`

### Patch Changes

- Updated dependencies [[`e96309b6`](https://github.com/wbkd/react-flow/commit/e96309b6a57b1071faeebf7b0547fef7fd418694), [`85003b01`](https://github.com/wbkd/react-flow/commit/85003b01add71ea852bd5b0d2f1e7496050a6b52), [`4c516882`](https://github.com/wbkd/react-flow/commit/4c516882d2bbf426c1832a53ad40763cc1abef92)]:
  - @reactflow/core@11.5.0

## 1.2.2

### Patch Changes

- [#2741](https://github.com/wbkd/react-flow/pull/2741) [`e2aff6c1`](https://github.com/wbkd/react-flow/commit/e2aff6c1e4ce54b57b724b2624367ee5fefd1c39) - chore(dependencies): update and cleanup

- Updated dependencies [[`e34a3072`](https://github.com/wbkd/react-flow/commit/e34a30726dc55184f59adc4f16ca5215a7c42805), [`e2aff6c1`](https://github.com/wbkd/react-flow/commit/e2aff6c1e4ce54b57b724b2624367ee5fefd1c39)]:
  - @reactflow/core@11.4.2

## 1.2.1

### Patch Changes

- Updated dependencies [[`82988485`](https://github.com/wbkd/react-flow/commit/82988485b730a9e32acbdae1ddcc81b33ddccaba), [`d91e619a`](https://github.com/wbkd/react-flow/commit/d91e619a70a95db99a621ede59bc05b5a7766086)]:
  - @reactflow/core@11.4.1

## 1.2.0

### Patch Changes

- Updated dependencies [[`ab2ff374`](https://github.com/wbkd/react-flow/commit/ab2ff3740618da48bd4350597e816c397f3d78ff), [`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0), [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493), [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9), [`7ef29108`](https://github.com/wbkd/react-flow/commit/7ef2910808aaaee029894363d52efc0c378a7654), [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c)]:
  - @reactflow/core@11.4.0

## 1.2.0-next.1

### Minor Changes

- panOnDrag: Use numbers for prop ([1,2] = drag via middle or right mouse button)
- selection: do not include hidden nodes
- minimap: fix onNodeClick for nodes outside the viewport
- keys: allow multi select when input is focused

### Patch Changes

- Updated dependencies []:
  - @reactflow/core@11.4.0-next.1

## 1.1.1-next.0

### Patch Changes

- Updated dependencies [[`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0), [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493), [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9), [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c)]:
  - @reactflow/core@11.4.0-next.0

## 1.1.0

### Minor Changes

- Add `onResizeStart`, `onResize`, `onResizeEnd` handlers
- Fix resizing flag
- Cleanup types

## 1.0.3

### Patch Changes

- cleanup

## 1.0.2

### Patch Changes

- fix `minWidth` and `minHeight` so that it can be used dynamically

## 1.0.1

### Patch Changes

- pass `minWidth` and `minHeight` from `NodeResizer` component to `NodeResizeControl`

## 1.0.0

This is a new package that exports components to build a UI for resizing a node 🎉 It exports a [`<NodeResizer />`](https://reactflow.dev/docs/api/nodes/node-resizer/) component and a [`<NodeResizeControl />`](https://reactflow.dev/docs/api/nodes/node-resizer/#noderesizecontrol--component) component.

### Major Changes

- [#2626](https://github.com/wbkd/react-flow/pull/2626) [`d29c401d`](https://github.com/wbkd/react-flow/commit/d29c401d598dbf2dcd5609b7adb8d029906a6f18) - Add a node resizer component that can be used to resize a custom node

### Patch Changes

- Updated dependencies [[`e6b5d90f`](https://github.com/wbkd/react-flow/commit/e6b5d90f61c8ee60e817bba232a162cae2ab3e2a), [`6ee44e07`](https://github.com/wbkd/react-flow/commit/6ee44e076eaa6908d07578a757a5187642b732ae), [`aa69c207`](https://github.com/wbkd/react-flow/commit/aa69c20765e6978f4f9c8cc63ed7110dbf6d9d9d), [`d29c401d`](https://github.com/wbkd/react-flow/commit/d29c401d598dbf2dcd5609b7adb8d029906a6f18), [`0df02f35`](https://github.com/wbkd/react-flow/commit/0df02f35f8d6c54dae36af18278feadc77acb2d6)]:
  - @reactflow/core@11.3.2
