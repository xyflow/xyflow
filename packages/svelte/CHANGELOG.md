# @xyflow/svelte

## 1.1.0

### Minor Changes

- [#5280](https://github.com/xyflow/xyflow/pull/5280) [`dba6faf2`](https://github.com/xyflow/xyflow/commit/dba6faf20e7ec2524d5270d177331d3bd260f3ac) Thanks [@moklick](https://github.com/moklick)! - Improve typing for Nodes

- [#5276](https://github.com/xyflow/xyflow/pull/5276) [`6ce44a05`](https://github.com/xyflow/xyflow/commit/6ce44a05c829068ff5a8416ce3fa4ee6e0eced48) Thanks [@moklick](https://github.com/moklick)! - Add an `ease` and `interpolate` option to all function that alter the viewport

### Patch Changes

- [#5294](https://github.com/xyflow/xyflow/pull/5294) [`4a582e23`](https://github.com/xyflow/xyflow/commit/4a582e2371066170b12f3df947f24fe233b542cd) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix data in EdgeProps not typed correctly

- [#5275](https://github.com/xyflow/xyflow/pull/5275) [`a67bfc09`](https://github.com/xyflow/xyflow/commit/a67bfc09d5b352b5ff3b896c9a9e7138f2c4b20c) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix setting nodesInitialized multiple times

- [#5295](https://github.com/xyflow/xyflow/pull/5295) [`93aefe71`](https://github.com/xyflow/xyflow/commit/93aefe71fb199d0e3463aca38a4564252ab8cbf4) Thanks [@peterkogo](https://github.com/peterkogo)! - Export missing callback types

- Updated dependencies [[`dba6faf2`](https://github.com/xyflow/xyflow/commit/dba6faf20e7ec2524d5270d177331d3bd260f3ac), [`6ce44a05`](https://github.com/xyflow/xyflow/commit/6ce44a05c829068ff5a8416ce3fa4ee6e0eced48)]:
  - @xyflow/system@0.1.0

## 1.0.2

### Patch Changes

- [#5266](https://github.com/xyflow/xyflow/pull/5266) [`77107453`](https://github.com/xyflow/xyflow/commit/77107453fa6f34cb08ef91640b8b02d58e31275e) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix connection snapping for handles larger than connectionRadius

- [#5267](https://github.com/xyflow/xyflow/pull/5267) [`d9f0ffbe`](https://github.com/xyflow/xyflow/commit/d9f0ffbe5cfa5e46197574456635fab7554d3b44) Thanks [@peterkogo](https://github.com/peterkogo)! - Make Background, Panel, Minimap work outside of SvelteFlow component

- Updated dependencies [[`77107453`](https://github.com/xyflow/xyflow/commit/77107453fa6f34cb08ef91640b8b02d58e31275e)]:
  - @xyflow/system@0.0.61

## 1.0.1

### Patch Changes

- [#5258](https://github.com/xyflow/xyflow/pull/5258) [`47f7a0b6`](https://github.com/xyflow/xyflow/commit/47f7a0b6f2c347aa87d470ab53c9fdc6e02dc067) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix fitView not working when accessed through the SvelteFlowProvider

- [#5259](https://github.com/xyflow/xyflow/pull/5259) [`77bf79c4`](https://github.com/xyflow/xyflow/commit/77bf79c40e71e3da449ace3b1a1ed5bceff46b51) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix background-color css variable fallback.

- Updated dependencies [[`77bf79c4`](https://github.com/xyflow/xyflow/commit/77bf79c40e71e3da449ace3b1a1ed5bceff46b51)]:
  - @xyflow/system@0.0.60

## 1.0.0

Yeah! Svelte Flow 1.0. is here 🚀 It is based on Svelte 5 and introduces a lot of new features and improvements. Please refer to the [migration guide](https://svelteflow.dev/learn/troubleshooting/migrate-to-v1) to see how to upgrade.

### New features

- **[Reconnect edges](https://svelteflow.dev/examples/edges/reconnect-edge)**: You can reconnect your edges by using the new `<EdgeReconnectAnchor />` component. It can be used to add custom reconnection points on custom edges.
- **Keyboard navigation & A11y**: We added support for keyboard navigation and improved accessibility for screen readers. You can now tab through nodes and edges and move nodes with the arrow keys. Can be disabled via [**disableKeyboardA11y**](https://svelteflow.dev/api-reference/svelte-flow#disablekeyboarda11y)
- **[Click connect](https://svelteflow.dev/examples/edges/click-connect)**: You can now create a new connection by clicking on a handle one by one.
- **[Enhanced ViewportPortal](https://svelteflow.dev/api-reference/components/viewport-portal)**: You can now decide if you want to render something below or above the nodes & edges in the viewport.
- **Improved [fitView](https://svelteflow.dev/api-reference/hooks/use-svelte-flow#fitview)**: We finetuned the `fitView` function to better work with dynamically added nodes.
- **colorModeSSR** prop: You can pass a fallback color mode for server side rendering when colorMode is set to 'system'.
- [**elevateNodesOnSelect**](https://svelteflow.dev/api-reference/svelte-flow#elevateNodesOnSelect) & [**elevateEdgesOnSelect**](https://svelteflow.dev/api-reference/svelte-flow#elevateEdgesOnSelect): Control if nodes & edges should be elevated via z-index when selected.
- [**noDragClass, noWheelClass, noPanClass**](https://svelteflow.dev/api-reference/svelte-flow#style-props): You can now modify the class name used to disable dragging, panning and zooming.
- [**onselectionchange**](https://svelteflow.dev/api-reference/svelte-flow#onselectionchange) & [**useOnSelectionChange**](https://svelteflow.dev/api-reference/hooks/use-on-selection-change): You can now listen to selection changes via a callback

## 0.1.39

### Patch Changes

- Updated dependencies [[`a95f0e2f`](https://github.com/xyflow/xyflow/commit/a95f0e2fbfc2d070d9bd70b753d1606a87332e3f)]:
  - @xyflow/system@0.0.59

## 0.1.38

### Patch Changes

- Updated dependencies [[`2a03213b`](https://github.com/xyflow/xyflow/commit/2a03213b0695d504f831579ec9df3f9de2d3e0bd)]:
  - @xyflow/system@0.0.58

## 0.1.37

### Patch Changes

- Updated dependencies [[`a7d10ffc`](https://github.com/xyflow/xyflow/commit/a7d10ffce5a0195471681980f97b1b5f6c448f35), [`4e681f9c`](https://github.com/xyflow/xyflow/commit/4e681f9c529c3f4f8b2ac5d25b4db7878c197e14)]:
  - @xyflow/system@0.0.57

## 0.1.36

### Patch Changes

- [#5212](https://github.com/xyflow/xyflow/pull/5212) [`0f43b8ea`](https://github.com/xyflow/xyflow/commit/0f43b8ea45bd293e50e4a86d83868074bb323f13) Thanks [@moklick](https://github.com/moklick)! - Add polyfill for `Promise.withResolvers`

- [#5191](https://github.com/xyflow/xyflow/pull/5191) [`e5735b51`](https://github.com/xyflow/xyflow/commit/e5735b514a54d86ba0ca7bd725e8bfead89fc08e) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix legacy padding being slightly larger than before

- Updated dependencies [[`0f43b8ea`](https://github.com/xyflow/xyflow/commit/0f43b8ea45bd293e50e4a86d83868074bb323f13), [`fc241253`](https://github.com/xyflow/xyflow/commit/fc241253d5dba35f5febf411e77dbc5acb91d5d7), [`98fe23c7`](https://github.com/xyflow/xyflow/commit/98fe23c7c2b12972f1b7def866215ce82a86e2c0), [`e5735b51`](https://github.com/xyflow/xyflow/commit/e5735b514a54d86ba0ca7bd725e8bfead89fc08e)]:
  - @xyflow/system@0.0.56

## 0.1.35

### Patch Changes

- [#5158](https://github.com/xyflow/xyflow/pull/5158) [`06696060`](https://github.com/xyflow/xyflow/commit/0669606050bb2138a44a1591176ac8e16afeb0f1) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Fix typo in TSDoc comments `React Flow` -> `Svelte Flow`

- Updated dependencies [[`02a3b746`](https://github.com/xyflow/xyflow/commit/02a3b74645799a3f0ce670b69365fa86ecb0616e), [`cbe305e1`](https://github.com/xyflow/xyflow/commit/cbe305e15a5c5d3b92583e0ec12364b2509f49bd), [`1f671bd4`](https://github.com/xyflow/xyflow/commit/1f671bd48f06230da841fdd1d7a312413ef16d03), [`aaebc462`](https://github.com/xyflow/xyflow/commit/aaebc462951ded8e91374c3e084d77af5ed7380a), [`6ec942fc`](https://github.com/xyflow/xyflow/commit/6ec942fc6501f81009c278cc995764bef3e8d03b)]:
  - @xyflow/system@0.0.55

## 0.1.34

### Patch Changes

- [#5139](https://github.com/xyflow/xyflow/pull/5139) [`89de9ca8`](https://github.com/xyflow/xyflow/commit/89de9ca83fbf9263a687a0f5f915efb2beb31654) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Use `rgba` for colors with opacity instead of `rgb` for `MiniMap` mask color

- Updated dependencies [[`f819005b`](https://github.com/xyflow/xyflow/commit/f819005be362d044b16ce4c0b85432f3f300a13a), [`24a1bc89`](https://github.com/xyflow/xyflow/commit/24a1bc89348817ed9b5c87f74bf2519c705143be), [`36657cd6`](https://github.com/xyflow/xyflow/commit/36657cd66322c911e87eb37275c584a80025adfe), [`89de9ca8`](https://github.com/xyflow/xyflow/commit/89de9ca83fbf9263a687a0f5f915efb2beb31654), [`2ac6e155`](https://github.com/xyflow/xyflow/commit/2ac6e155e35256ca436281df16344366e7d05761), [`f0f378e5`](https://github.com/xyflow/xyflow/commit/f0f378e5b6918c2c30d9dc1e32587063cb942d4e)]:
  - @xyflow/system@0.0.54

## 0.1.33

### Patch Changes

- [#5124](https://github.com/xyflow/xyflow/pull/5124) [`b76f7f9e`](https://github.com/xyflow/xyflow/commit/b76f7f9eb4841f139b1468b8eda0430ddd19a1ae) Thanks [@bjornosal](https://github.com/bjornosal)! - Export NodeConnection type

## 0.1.32

### Patch Changes

- [#5059](https://github.com/xyflow/xyflow/pull/5059) [`065ff89d`](https://github.com/xyflow/xyflow/commit/065ff89d10488f9c76c56870511e45eaed299778) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Prevent onPaneClick when connection is in progress. Closes [#5057](https://github.com/xyflow/xyflow/issues/5057)

- [#5067](https://github.com/xyflow/xyflow/pull/5067) [`cb685281`](https://github.com/xyflow/xyflow/commit/cb685281d0eaf03e9833271c31f92b1d143af2fe) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix fitView not working immediately after adding new nodes

- [#5093](https://github.com/xyflow/xyflow/pull/5093) [`65825e89`](https://github.com/xyflow/xyflow/commit/65825e89a6e2e7591087eb41ac89da4da7095f8f) Thanks [@moklick](https://github.com/moklick)! - Hidden nodes are not displayed in the mini map anymore

- Updated dependencies [[`5d15b01b`](https://github.com/xyflow/xyflow/commit/5d15b01ba8cb349d6397a6ed8162848b4dfec293), [`cb685281`](https://github.com/xyflow/xyflow/commit/cb685281d0eaf03e9833271c31f92b1d143af2fe), [`a79f30b3`](https://github.com/xyflow/xyflow/commit/a79f30b3dd7c8ff6400c8d22214b2c2282e5bac1)]:
  - @xyflow/system@0.0.53

## 0.1.31

### Patch Changes

- [#5019](https://github.com/xyflow/xyflow/pull/5019) [`3e80317c`](https://github.com/xyflow/xyflow/commit/3e80317cf6da0e9fdc111c3ade88f2a88a10dbd6) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Add `"./package.json" to the `exports` field so that users can import it

- Updated dependencies [[`99dd7d35`](https://github.com/xyflow/xyflow/commit/99dd7d3549e7423e7d103b2c956c8b37f5747b90)]:
  - @xyflow/system@0.0.52

## 0.1.30

### Patch Changes

- [#5010](https://github.com/xyflow/xyflow/pull/5010) [`6c121d42`](https://github.com/xyflow/xyflow/commit/6c121d427fea9a11e86a85f95d2c12ba8af34919) Thanks [@moklick](https://github.com/moklick)! - Add more TSDocs to components, hooks, utils funcs and types

- Updated dependencies [[`6c121d42`](https://github.com/xyflow/xyflow/commit/6c121d427fea9a11e86a85f95d2c12ba8af34919), [`4947029c`](https://github.com/xyflow/xyflow/commit/4947029cd6cda0f695e1fb4815e4030adb232234), [`e8e0d684`](https://github.com/xyflow/xyflow/commit/e8e0d684957b95d53a6cc11598c8755ff02117c7)]:
  - @xyflow/system@0.0.51

## 0.1.29

### Patch Changes

- [#4957](https://github.com/xyflow/xyflow/pull/4957) [`fe843982`](https://github.com/xyflow/xyflow/commit/fe843982bfc7d7579d54772b201426b4c3f549c6) Thanks [@peterkogo](https://github.com/peterkogo)! - Narrow properties selected, selectable, deletable, draggable of NodeProps type to be required.

- Updated dependencies [[`fe843982`](https://github.com/xyflow/xyflow/commit/fe843982bfc7d7579d54772b201426b4c3f549c6), [`e73ef09f`](https://github.com/xyflow/xyflow/commit/e73ef09fbc8d872b46cf52c9d6a32dbb388c220b)]:
  - @xyflow/system@0.0.50

## 0.1.28

### Patch Changes

- [#4949](https://github.com/xyflow/xyflow/pull/4949) [`592c7eaf`](https://github.com/xyflow/xyflow/commit/592c7eaf9574fc69df3123837da95f85877b23e8) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix useNodeConnection hook not returning all connected edges.

- Updated dependencies [[`592c7eaf`](https://github.com/xyflow/xyflow/commit/592c7eaf9574fc69df3123837da95f85877b23e8)]:
  - @xyflow/system@0.0.49

## 0.1.27

### Patch Changes

- [#4937](https://github.com/xyflow/xyflow/pull/4937) [`9d940300`](https://github.com/xyflow/xyflow/commit/9d940300441b10f4d9eef4b07fac49a3e69d3503) Thanks [@jrmoynihan](https://github.com/jrmoynihan)! - Expose props of Controls

- [#4947](https://github.com/xyflow/xyflow/pull/4947) [`868aa3f3`](https://github.com/xyflow/xyflow/commit/868aa3f3db8223ea1b04a68aa027ea99fd1e91c8) Thanks [@moklick](https://github.com/moklick)! - Export ResizeControlVariant correctly as a value.

- [#4880](https://github.com/xyflow/xyflow/pull/4880) [`e2d849dc`](https://github.com/xyflow/xyflow/commit/e2d849dca63aee5952f676aef1c675c6232bb69a) Thanks [@crimx](https://github.com/crimx)! - Add type check for all event targets

- [#4725](https://github.com/xyflow/xyflow/pull/4725) [`e10f53cf`](https://github.com/xyflow/xyflow/commit/e10f53cf898a56f954783d6efcf6977a0d88f4a9) Thanks [@peterkogo](https://github.com/peterkogo)! - Add useNodeConnections hook to track all connections to a node. Can be filtered by handleType and handleId.

- Updated dependencies [[`e2d849dc`](https://github.com/xyflow/xyflow/commit/e2d849dca63aee5952f676aef1c675c6232bb69a), [`e10f53cf`](https://github.com/xyflow/xyflow/commit/e10f53cf898a56f954783d6efcf6977a0d88f4a9), [`4947f683`](https://github.com/xyflow/xyflow/commit/4947f683b7530f8e6684865ab53ea38633de0f4d)]:
  - @xyflow/system@0.0.48

## 0.1.26

### Patch Changes

- [#4897](https://github.com/xyflow/xyflow/pull/4897) [`c6890512`](https://github.com/xyflow/xyflow/commit/c6890512a685c8ec87310b3b003e62b0b976eca4) Thanks [@peterkogo](https://github.com/peterkogo)! - Freeze required @svelte-put/shortcut version to 3.1.1 to prevent breaking of key inputs.

## 0.1.25

### Patch Changes

- [#4865](https://github.com/xyflow/xyflow/pull/4865) [`2c4acc2b`](https://github.com/xyflow/xyflow/commit/2c4acc2bd9ec271468bd4c904e19d7fca627d9e1) Thanks [@moklick](https://github.com/moklick)! - Add group node to BuiltInNode type. Thanks [@sjdemartini](https://github.com/sjdemartini)!

- [#4877](https://github.com/xyflow/xyflow/pull/4877) [`9a8309da`](https://github.com/xyflow/xyflow/commit/9a8309dab892f047fce10d3c763466cf84f726b0) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix intersections for nodes with origins other than [0,0]. Thanks [@gmvrpw](https://github.com/gmvrpw)!

- Updated dependencies [[`d60331e6`](https://github.com/xyflow/xyflow/commit/d60331e6baa7931c46af219e35c1bedbd156187c)]:
  - @xyflow/system@0.0.47

## 0.1.24

### Patch Changes

- [#4790](https://github.com/xyflow/xyflow/pull/4790) [`2fa9a920`](https://github.com/xyflow/xyflow/commit/2fa9a92042ba11986abbababb7e8b294e208d6cb) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix node dragging & resizing while zooming on flow that does not cover whole browser window.

- [#4782](https://github.com/xyflow/xyflow/pull/4782) [`323e1b35`](https://github.com/xyflow/xyflow/commit/323e1b35c58bca80deb824bc8b136705593a5257) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix node intersections in nested flow.

- Updated dependencies [[`2fa9a920`](https://github.com/xyflow/xyflow/commit/2fa9a92042ba11986abbababb7e8b294e208d6cb), [`323e1b35`](https://github.com/xyflow/xyflow/commit/323e1b35c58bca80deb824bc8b136705593a5257)]:
  - @xyflow/system@0.0.46

## 0.1.23

### Patch Changes

- [#4772](https://github.com/xyflow/xyflow/pull/4772) [`7f670ab0`](https://github.com/xyflow/xyflow/commit/7f670ab0423b3848a50398027297f6ec11deeaa4) Thanks [@mistic](https://github.com/mistic)! - Splits exports field in package.json to support an explicit resolution for browser, node and default to resolve issues with webpack esm module resolution.

- Updated dependencies [[`7f670ab0`](https://github.com/xyflow/xyflow/commit/7f670ab0423b3848a50398027297f6ec11deeaa4)]:
  - @xyflow/system@0.0.45

## 0.1.22

### Patch Changes

- [#4730](https://github.com/xyflow/xyflow/pull/4730) [`2c590b90`](https://github.com/xyflow/xyflow/commit/2c590b90787aabce42de2b4108174bdf31ad6155) Thanks [@peterkogo](https://github.com/peterkogo)! - Fixed rare crash while dragging

- [#4758](https://github.com/xyflow/xyflow/pull/4758) [`e555bd1b`](https://github.com/xyflow/xyflow/commit/e555bd1b1c7fbe801ed46120ac51d3d9cee5a29a) Thanks [@peterkogo](https://github.com/peterkogo)! - Bump Svelte peer dependency to 5.0.0

- Updated dependencies [[`005ae1c0`](https://github.com/xyflow/xyflow/commit/005ae1c05f6a10c1f519cd789f4f3f2fdf293bc6), [`2c590b90`](https://github.com/xyflow/xyflow/commit/2c590b90787aabce42de2b4108174bdf31ad6155)]:
  - @xyflow/system@0.0.44

## 0.1.21

### Patch Changes

- [#4718](https://github.com/xyflow/xyflow/pull/4718) [`51f08aac`](https://github.com/xyflow/xyflow/commit/51f08aaca5ddfbaa3259f666005d687d0a83f3db) Thanks [@peterkogo](https://github.com/peterkogo)! - Fixed hook useNodesData unexpectedly returning undefined

## 0.1.20

### Patch Changes

- [#4670](https://github.com/xyflow/xyflow/pull/4670) [`b056564c`](https://github.com/xyflow/xyflow/commit/b056564c9658bb43b882eebfad5a7e224717ffb5) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix initial `fitView` not working correctly for `nodeOrigin` other than [0,0]

- [#4670](https://github.com/xyflow/xyflow/pull/4670) [`b056564c`](https://github.com/xyflow/xyflow/commit/b056564c9658bb43b882eebfad5a7e224717ffb5) Thanks [@peterkogo](https://github.com/peterkogo)! - Improve `fitView` to respect clamped node positions based on `nodeExtent`

- [#4653](https://github.com/xyflow/xyflow/pull/4653) [`02390f99`](https://github.com/xyflow/xyflow/commit/02390f9966d51c80e4e1b488733b5bf7322ad710) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Calculate viewport dimensions in `fitView` instead of using stored dimensions. Fixes [#4652](https://github.com/xyflow/xyflow/issues/4652)

- Updated dependencies [[`99ba64ac`](https://github.com/xyflow/xyflow/commit/99ba64ac2e1ce9c5ac3cab85a3d574edc0ecf4cc), [`b056564c`](https://github.com/xyflow/xyflow/commit/b056564c9658bb43b882eebfad5a7e224717ffb5)]:
  - @xyflow/system@0.0.43

## 0.1.19

### Patch Changes

- [#4477](https://github.com/xyflow/xyflow/pull/4477) [`d5592e75`](https://github.com/xyflow/xyflow/commit/d5592e7508bc32d5ffc953844b1d42b9ec59b25b) Thanks [@peterkogo](https://github.com/peterkogo)! - Add `getNodesBounds` to `useReactFlow`/`useSvelteFlow` hook as the new recommended way of determining node bounds.

- [#4572](https://github.com/xyflow/xyflow/pull/4572) [`1445e148`](https://github.com/xyflow/xyflow/commit/1445e1483118c966ff6de3f29c5473c93f6b99f1) Thanks [@peterkogo](https://github.com/peterkogo)! - Add nodeExtent prop to `<SvelteFlow />`. You can now restrict nodes from leaving a specified extent.

- [#4572](https://github.com/xyflow/xyflow/pull/4572) [`d9563505`](https://github.com/xyflow/xyflow/commit/d9563505d8fb01862a3a6bae6e05dcea626c2e26) Thanks [@peterkogo](https://github.com/peterkogo)! - Improve handling of global and individual `nodeExtent`s. Nodes will never render outside of specified extents.

- Updated dependencies [[`d5592e75`](https://github.com/xyflow/xyflow/commit/d5592e7508bc32d5ffc953844b1d42b9ec59b25b), [`d9563505`](https://github.com/xyflow/xyflow/commit/d9563505d8fb01862a3a6bae6e05dcea626c2e26)]:
  - @xyflow/system@0.0.42

## 0.1.18

### Patch Changes

- [#4611](https://github.com/xyflow/xyflow/pull/4611) [`2aaa709c`](https://github.com/xyflow/xyflow/commit/2aaa709c0014b91ab75a4e40753b71cc7bb04a2c) Thanks [@moklick](https://github.com/moklick)! - make onViewportChange a dynamic prop

- Updated dependencies [[`2aaa709c`](https://github.com/xyflow/xyflow/commit/2aaa709c0014b91ab75a4e40753b71cc7bb04a2c)]:
  - @xyflow/system@0.0.41

## 0.1.17

### Patch Changes

- [#4574](https://github.com/xyflow/xyflow/pull/4574) [`b65aed19`](https://github.com/xyflow/xyflow/commit/b65aed19840c515949bef236a23d5f0a754cdeb4) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Add `getHandleConnections` helper to `useReactFlow` & `useSvelteFlow`

- Updated dependencies [[`5138d90b`](https://github.com/xyflow/xyflow/commit/5138d90bdb91ff5d8dbeb8c8d29bdfd31c5b59d6), [`12dbe125`](https://github.com/xyflow/xyflow/commit/12dbe125755fad7d2f6dff19100872dd823d1012)]:
  - @xyflow/system@0.0.40

## 0.1.16

### Patch Changes

- [#4568](https://github.com/xyflow/xyflow/pull/4568) [`c3e62782`](https://github.com/xyflow/xyflow/commit/c3e6278222dc13333f75ecdbe634201ddabab87a) Thanks [@peterkogo](https://github.com/peterkogo)! - Only display grab cursor when panOnDrag is on left mouse button

- [#4569](https://github.com/xyflow/xyflow/pull/4569) [`54bfb6d9`](https://github.com/xyflow/xyflow/commit/54bfb6d9383b2c041f243c1ba16ce169c2b90085) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix getIntersectingNodes for subflows

- Updated dependencies [[`c3e62782`](https://github.com/xyflow/xyflow/commit/c3e6278222dc13333f75ecdbe634201ddabab87a)]:
  - @xyflow/system@0.0.39

## 0.1.15

### Patch Changes

- [#4510](https://github.com/xyflow/xyflow/pull/4510) [`12313a5b`](https://github.com/xyflow/xyflow/commit/12313a5b01312ef4425d3fa666e578961a151fe2) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Rename `isConnectable` prop locally to `isConnectableProp` to avoid naming collision with derived value of `isConnectable` in `<Handle>` component.

- [#4517](https://github.com/xyflow/xyflow/pull/4517) [`085951bc`](https://github.com/xyflow/xyflow/commit/085951bc07f02ac7af143409fe156bade8a63113) Thanks [@ghostdevv](https://github.com/ghostdevv)! - fix: make svelte-preprocess a dev dep

- [#4549](https://github.com/xyflow/xyflow/pull/4549) [`99733c01`](https://github.com/xyflow/xyflow/commit/99733c01bc70f9463e7dba0046c5f8d839a1d2ba) Thanks [@moklick](https://github.com/moklick)! - feat(onConnectEnd): pass connectionState param

- Updated dependencies [[`b63a3734`](https://github.com/xyflow/xyflow/commit/b63a3734b84b6817603c8e6e48e2836f048acc3b), [`24e87e39`](https://github.com/xyflow/xyflow/commit/24e87e398419646f671af1085fbfec3e197bc56b), [`692e6440`](https://github.com/xyflow/xyflow/commit/692e6440b10e75cb31f3f3172aede9ed4d7f05d2), [`559d4926`](https://github.com/xyflow/xyflow/commit/559d49264b940f93c5e205bf984aa76230b10806), [`4ecfd7e1`](https://github.com/xyflow/xyflow/commit/4ecfd7e19720b70024d0b5dff27d4537dd46b49a), [`e7ef328f`](https://github.com/xyflow/xyflow/commit/e7ef328f8f9286a817b19457d38c491e6c0bcffd), [`99733c01`](https://github.com/xyflow/xyflow/commit/99733c01bc70f9463e7dba0046c5f8d839a1d2ba)]:
  - @xyflow/system@0.0.38

## 0.1.14

### Patch Changes

- [#4498](https://github.com/xyflow/xyflow/pull/4498) [`7a6e9e30`](https://github.com/xyflow/xyflow/commit/7a6e9e3091c8ee0aedbf8ae6e5c4ee08485417ab) Thanks [@peterkogo](https://github.com/peterkogo)! - fix(pane) only capture pointer after a valid selection has started, fixes #4492

## 0.1.13

### Patch Changes

- Updated dependencies [[`543c0939`](https://github.com/xyflow/xyflow/commit/543c09392d53fdd56a8876e65f4ce2d8ab250098), [`89cd677b`](https://github.com/xyflow/xyflow/commit/89cd677b5668b78434e02e7b025c6ac58db91e58), [`c253c7c5`](https://github.com/xyflow/xyflow/commit/c253c7c59a2ccd2cb91ad44ce4acbe481d9d7fe1)]:
  - @xyflow/system@0.0.37

## 0.1.12

### Patch Changes

- [#4446](https://github.com/xyflow/xyflow/pull/4446) [`80baf53b`](https://github.com/xyflow/xyflow/commit/80baf53bdc7d4fb0715e5eed85efdea77191935a) Thanks [@moklick](https://github.com/moklick)! - fix(resizer): export types

- [#4451](https://github.com/xyflow/xyflow/pull/4451) [`4cccd06a`](https://github.com/xyflow/xyflow/commit/4cccd06a671e9ef1c6f16ab0d788081f8d894d0e) Thanks [@moklick](https://github.com/moklick)! - add nodeClickDistance

- Updated dependencies [[`80baf53b`](https://github.com/xyflow/xyflow/commit/80baf53bdc7d4fb0715e5eed85efdea77191935a), [`4cccd06a`](https://github.com/xyflow/xyflow/commit/4cccd06a671e9ef1c6f16ab0d788081f8d894d0e)]:
  - @xyflow/system@0.0.36

## 0.1.11

### Patch Changes

- [#4434](https://github.com/xyflow/xyflow/pull/4434) [`1bda2451`](https://github.com/xyflow/xyflow/commit/1bda24519658b4aaed6d4abf9e7e9d096e193b5b) Thanks [@moklick](https://github.com/moklick)! - fix(selection): handle pointer capture for selectionOnDrag

- Updated dependencies [[`d2da5765`](https://github.com/xyflow/xyflow/commit/d2da576591305873f8d6514091ee8db1ad4f79e2)]:
  - @xyflow/system@0.0.35

## 0.1.10

- add `paneDistanceClick` prop (max distance between mousedown/up that will trigger a click)
- returned nodes in `on:nodedragstop` are set to `dragging=false`

## 0.1.9

- return Promises for `setViewport`, `fitView`, `fitBounds` and `zoomTo` to be able to await viewport update

## 0.1.8

- `useConnection` returns `ConnectionState` with `toNode` and `toHandle`
- node origin is part of position absolute
- refactor connection handling

## 0.1.7

- revise selection usability (capture while dragging out of the flow)
- only prevent shift scrolling when selection is actually in progress
- use correct end handle position when drawing a connection lines
- determine correct end positions for connection lines

## 0.1.6

- fix node origin bug

## 0.1.5

- prevent zooming on mobile if zoomOnPinch is false
- add straight edge to path built-in-types
- abort drag when multiple touches are detected
- fix merge_styles error

## 0.1.4

- add `selectable`, `deletable` and `draggable` to node and edge props
- add `parentId` to node props
- add `on:edgemouseenter` and `on:edgemouseleave` event handler
- fix deselection of edges
- remove pointer events from panel when user selection is active
- fix viewport initialization with user viewport
- fix parent node lookup in `evaluateAbsolutePosition`- thanks @lcsfort

## 0.1.3

- fix `NodeToolbar` for subflows

## 0.1.2

- export `InternalNode` type

## 0.1.1

- export `useInternalNode` hook

## 0.1.0

This is a bigger update for Svelte Flow to keep up with the latest changes we made for React Flow and the Svelte5 rewrite. The biggest change is the separation of user nodes (type `Node`) and internal nodes (type `InternalNode`), which includes a renaming of the `node.computed` attribute to `node.measured`. In the previous versions, we stored internals in `node[internalsSymbol]`. This doesn't exist anymore, but we only add it to our internal nodes in `node.internals.`.

## ⚠️ Breaking

- rename `node.computed` to `node.measured` - this attribute only includes `width` and `height` and no `positionAbsolute` anymore. For this we added the helpers `getInternalNode` and `useInternalNode`
- rename `node.parentNode` to `node.parentId`

### More updates:

- add `isValidConnection` for `<Handle />` component
- add `fitViewOptions` for `<Controls />` component
- add `getInternalNode` to `useSvelteFlow`
- add `useInternalNode` hook
- don't reset nodes and edges when svelte flow unmounts - thanks @darabos
- fix node event types - thanks @RedPhoenixQ
- make handleId and isTarget reactive - thanks @darabos
- fix MiniMap interaction for touch devices
- fix pane: pinch zoom on windows
- fix nodes: return user node in node event handlers

## 0.0.41

- fix: re-observe nodes when not initialized

## 0.0.40

- add `orientation` ('horizontal' or 'vertical'), `style` and `class` prop for `Controls` component
- allow multiple keys for `deleteKey`, `selectionKey`, `multiSelectionKey`, `panActivationKey` and `zoomActivationKey`
- fix node observe / unobserve
- fix edge and node types
- active context menu releases pressed keys to reset selection

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
