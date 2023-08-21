# reactflow

## 11.8.3

Yet another fix for step and smoothstep edge routes

### Patch Changes

- [#3345](https://github.com/wbkd/react-flow/pull/3345) [`3b329d69`](https://github.com/wbkd/react-flow/commit/3b329d6991023e66b9b1b8b4cba1cccf21b6788e) - fix(step-edge): routing for equal handle positions

### Patch Changes

- Updated dependencies [[`3b329d69`](https://github.com/wbkd/react-flow/commit/3b329d6991023e66b9b1b8b4cba1cccf21b6788e)]:
  - @reactflow/core@11.8.3
  - @reactflow/background@11.2.8
  - @reactflow/controls@11.1.19
  - @reactflow/minimap@11.6.3
  - @reactflow/node-resizer@2.1.5
  - @reactflow/node-toolbar@1.2.7

## 11.8.2

With this fix it's possible to use React17 again

### Patch Changes

- [#3327](https://github.com/wbkd/react-flow/pull/3327) [`7132c168`](https://github.com/wbkd/react-flow/commit/7132c16895c89c6d538a6b8de626e6167d41ce95) - fix(react17): dont use mjs for esm modules

- Updated dependencies [[`7132c168`](https://github.com/wbkd/react-flow/commit/7132c16895c89c6d538a6b8de626e6167d41ce95)]:
  - @reactflow/background@11.2.7
  - @reactflow/controls@11.1.18
  - @reactflow/core@11.8.2
  - @reactflow/minimap@11.6.2
  - @reactflow/node-resizer@2.1.4
  - @reactflow/node-toolbar@1.2.6

## 11.8.1

This patch release fixes an issue with nextjs that was introduces in 11.8.0

### Patch Changes

- [`1d99926c`](https://github.com/wbkd/react-flow/commit/1d99926c92c8519286d01fb584c8ef6497dc247a) Thanks [@Reflejo](https://github.com/Reflejo)! - Fix navigator being used on server-side rendering
- Updated dependencies [[`1d99926c`](https://github.com/wbkd/react-flow/commit/1d99926c92c8519286d01fb584c8ef6497dc247a)]:
  - @reactflow/core@11.8.1
  - @reactflow/background@11.2.6
  - @reactflow/controls@11.1.17
  - @reactflow/minimap@11.6.1
  - @reactflow/node-resizer@2.1.3
  - @reactflow/node-toolbar@1.2.5

## 11.8.0

This is probably the last minor and hopefully also the last patch release for v11. In the next weeks we will focus on the xyflow branch and the upcoming v12 major release. This release comes with a lot of fixes that we wanted to do for a long time. We finally fixed some windows scroll related bugs (fast zooming, no horizontal pan on scroll) and smooth edge bugs (better label positions, weird layouts).

#### Important updates for Windows users

- default key for zoom activation and multi selection is "Control" instead of "Meta"
- you can pan horizontally when Shift is pressed (when `panOnScroll` is set)
- we fixed the fast zooming bug when users pressed Control

#### Important note for Zustand users

If you are using Zustand, you need to update to v4.4.1 and follow the migration guide https://github.com/pmndrs/zustand/releases/tag/v4.4.0

### Fixes

- [#3286](https://github.com/wbkd/react-flow/pull/3286) [`ff85d908`](https://github.com/wbkd/react-flow/commit/ff85d908a94ba5add9bc66a0ded0cb755c95fcda) - fix(selection): keep node positions when extent is reached
- [#3289](https://github.com/wbkd/react-flow/pull/3289) [`61d90578`](https://github.com/wbkd/react-flow/commit/61d905784113c2fb3cdf5993292cc6ac694dac7c) - fix(onMoveEnd): falsely triggered on right click
- [#3307](https://github.com/wbkd/react-flow/pull/3307) [`fdddf43d`](https://github.com/wbkd/react-flow/commit/fdddf43d0d3b4b71158c0e0b56aab9dcbd61da6d) Thanks [@s-yadav](https://github.com/s-yadav)! - fix(windows): allow horizontal pan with Shift + scroll
- [#3290](https://github.com/wbkd/react-flow/pull/3290) [`6e6bb674`](https://github.com/wbkd/react-flow/commit/6e6bb6743ed4b4f517528f52411d9612f3f13d58) - fix(panOnScroll): fire move events
- [#3293](https://github.com/wbkd/react-flow/pull/3293) [`bb1b9318`](https://github.com/wbkd/react-flow/commit/bb1b93183a374fbf002625e962441ff0ff288c08) - fix(zoom): handle windows zoom with ctrl
- [#3279](https://github.com/wbkd/react-flow/pull/3279) [`ed4a0c1b`](https://github.com/wbkd/react-flow/commit/ed4a0c1b1629ab356dc4b4fd2dcedfde6e99d3b8) - fix(step-edge): edge path for horizontally or vertically aligned nodes
- [#3305](https://github.com/wbkd/react-flow/pull/3305) [`10a32239`](https://github.com/wbkd/react-flow/commit/10a32239063be3c2cc107145b9a21ac850c90410) - fix(step-edge): better default label positions
- [#3306](https://github.com/wbkd/react-flow/pull/3306) [`f9169108`](https://github.com/wbkd/react-flow/commit/f916910820916305be0d93060532224ff311aa80) Thanks [@VictorWinberg](https://github.com/VictorWinberg)! - fix(key-press): mac issue keyup not triggered
- [#3301](https://github.com/wbkd/react-flow/pull/3301) [`8b3e8400`](https://github.com/wbkd/react-flow/commit/8b3e840039ab7406ac3837ba373ec01b002892de) - fix(windows): more natural key defaults
- [#3294](https://github.com/wbkd/react-flow/pull/3294) [`de989bc6`](https://github.com/wbkd/react-flow/commit/de989bc604ccbc7951371430381547582f768dff) Thanks [@hayleigh-dot-dev](https://github.com/hayleigh-dot-dev)! - fix(node-click): handle deleted node

### Minimap Updates

- [#3283](https://github.com/wbkd/react-flow/pull/3283) [`1f4a2b52`](https://github.com/wbkd/react-flow/commit/1f4a2b5244b15a2dad5c6afd565cc459f33c4abc) Thanks [@Elringus](https://github.com/Elringus)! - feat(minimap): add `offsetScale` prop
- [#3284](https://github.com/wbkd/react-flow/pull/3284) [`327e54f5`](https://github.com/wbkd/react-flow/commit/327e54f587d4834e85a2caf2af45a6fc2b24d8b2) Thanks [@Elringus](https://github.com/Elringus)! - feat(minimap): add selected class name to minimap node

### Chore and Refactoring

- [#3304](https://github.com/wbkd/react-flow/pull/3304) [`15742c00`](https://github.com/wbkd/react-flow/commit/15742c004759e8cfcb84b83cb71e678b6c855d23) - chore(zustand): use latest version
- [#3292](https://github.com/wbkd/react-flow/pull/3292) [`6255c4cf`](https://github.com/wbkd/react-flow/commit/6255c4cf29ee6177762d49289cff9a555510bcce) - chore(pkg): add exports field for package.json
- [#3288](https://github.com/wbkd/react-flow/pull/3288) [`511ca769`](https://github.com/wbkd/react-flow/commit/511ca7699b67d8fc9088069f426c062184487b8a) - refactor(onError): use for node and edge type creation
- [#3285](https://github.com/wbkd/react-flow/pull/3285) [`e64e961a`](https://github.com/wbkd/react-flow/commit/e64e961a80517351068fc04146123fbd4fc744e5) - chore(a11y): always add role attribute to edge wrapper
- chore(tests): use latest cypress version
- Updated dependencies [[`15742c00`](https://github.com/wbkd/react-flow/commit/15742c004759e8cfcb84b83cb71e678b6c855d23), [`10a32239`](https://github.com/wbkd/react-flow/commit/10a32239063be3c2cc107145b9a21ac850c90410), [`fdddf43d`](https://github.com/wbkd/react-flow/commit/fdddf43d0d3b4b71158c0e0b56aab9dcbd61da6d), [`6255c4cf`](https://github.com/wbkd/react-flow/commit/6255c4cf29ee6177762d49289cff9a555510bcce), [`ff85d908`](https://github.com/wbkd/react-flow/commit/ff85d908a94ba5add9bc66a0ded0cb755c95fcda), [`61d90578`](https://github.com/wbkd/react-flow/commit/61d905784113c2fb3cdf5993292cc6ac694dac7c), [`6e6bb674`](https://github.com/wbkd/react-flow/commit/6e6bb6743ed4b4f517528f52411d9612f3f13d58), [`327e54f5`](https://github.com/wbkd/react-flow/commit/327e54f587d4834e85a2caf2af45a6fc2b24d8b2), [`1f4a2b52`](https://github.com/wbkd/react-flow/commit/1f4a2b5244b15a2dad5c6afd565cc459f33c4abc), [`511ca769`](https://github.com/wbkd/react-flow/commit/511ca7699b67d8fc9088069f426c062184487b8a), [`bb1b9318`](https://github.com/wbkd/react-flow/commit/bb1b93183a374fbf002625e962441ff0ff288c08), [`ed4a0c1b`](https://github.com/wbkd/react-flow/commit/ed4a0c1b1629ab356dc4b4fd2dcedfde6e99d3b8), [`f9169108`](https://github.com/wbkd/react-flow/commit/f916910820916305be0d93060532224ff311aa80), [`8b3e8400`](https://github.com/wbkd/react-flow/commit/8b3e840039ab7406ac3837ba373ec01b002892de), [`e64e961a`](https://github.com/wbkd/react-flow/commit/e64e961a80517351068fc04146123fbd4fc744e5), [`de989bc6`](https://github.com/wbkd/react-flow/commit/de989bc604ccbc7951371430381547582f768dff)]:
  - @reactflow/background@11.2.5
  - @reactflow/controls@11.1.16
  - @reactflow/core@11.8.0
  - @reactflow/minimap@11.6.0
  - @reactflow/node-resizer@2.1.2
  - @reactflow/node-toolbar@1.2.4

## 11.7.4

### Patch Changes

- [#3166](https://github.com/wbkd/react-flow/pull/3166) [`1941c561`](https://github.com/wbkd/react-flow/commit/1941c561c9eab937c0a01747c6d188ec8c6a1bf8) - fix(nodeExtent): include node width and height
- [#3164](https://github.com/wbkd/react-flow/pull/3164) [`c8b607dc`](https://github.com/wbkd/react-flow/commit/c8b607dcddeaf80912b756b0ce8045f7974e4657) - fix(handles): always check handles below mouse while connecting
- Updated dependencies [[`1941c561`](https://github.com/wbkd/react-flow/commit/1941c561c9eab937c0a01747c6d188ec8c6a1bf8), [`c8b607dc`](https://github.com/wbkd/react-flow/commit/c8b607dcddeaf80912b756b0ce8045f7974e4657)]:
  - @reactflow/core@11.7.4
  - @reactflow/background@11.2.4
  - @reactflow/controls@11.1.15
  - @reactflow/minimap@11.5.4
  - @reactflow/node-toolbar@1.2.3

## 11.7.3

### Patch Changes

- [#3154](https://github.com/wbkd/react-flow/pull/3154) [`3a277cb1`](https://github.com/wbkd/react-flow/commit/3a277cb123a886af093cee694c289c7e139c79ef) - ElevateEdgesOnSelect: adjust behaviour so that it works like elevateNodesOnSelect
- [#3152](https://github.com/wbkd/react-flow/pull/3152) [`52dbac5a`](https://github.com/wbkd/react-flow/commit/52dbac5a56c092504256f947df7a959eb07385c6) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Use all valid handles in proximity to determine the closest handle that can be snapped to. Fixes invalid handles connection radius blocking snap to valid handles inside the same radius
- [#3150](https://github.com/wbkd/react-flow/pull/3150) [`880a5932`](https://github.com/wbkd/react-flow/commit/880a593292ce5fdff30b656c2a1290cf98771818) Thanks [@goliney](https://github.com/goliney)! - Node-Resizer: add onResize/onResizeStart/onResizeEnd to useEffect deps
- [#3153](https://github.com/wbkd/react-flow/pull/3153) [`fbbee046`](https://github.com/wbkd/react-flow/commit/fbbee046282d466612089d31a2eff5a010733283) - Minimap: Improve performance for flows with lots of nodes that use the MiniMap component

- Updated dependencies [[`fbbee046`](https://github.com/wbkd/react-flow/commit/fbbee046282d466612089d31a2eff5a010733283), [`52dbac5a`](https://github.com/wbkd/react-flow/commit/52dbac5a56c092504256f947df7a959eb07385c6), [`3a277cb1`](https://github.com/wbkd/react-flow/commit/3a277cb123a886af093cee694c289c7e139c79ef), [`880a5932`](https://github.com/wbkd/react-flow/commit/880a593292ce5fdff30b656c2a1290cf98771818)]:
  - @reactflow/minimap@11.5.3
  - @reactflow/core@11.7.3
  - @reactflow/node-resizer@2.1.1
  - @reactflow/background@11.2.3
  - @reactflow/controls@11.1.14
  - @reactflow/node-toolbar@1.2.2

## 11.7.2

### Patch Changes

- [#3063](https://github.com/wbkd/react-flow/pull/3063) [`33915b88`](https://github.com/wbkd/react-flow/commit/33915b88c2ae701847870346b381f9cfa86c6459) - controls: disable zoom buttons when min/max is reached
- [#3060](https://github.com/wbkd/react-flow/pull/3060) [`70ec97f7`](https://github.com/wbkd/react-flow/commit/70ec97f7daec6d5401215cae3edac04aea88a3ba) - fix useNodes and useEdges bug with infinite re-renderings
- [#3064](https://github.com/wbkd/react-flow/pull/3064) [`d2d1aebc`](https://github.com/wbkd/react-flow/commit/d2d1aebc0f7fea4183406e7d1915b7fcd6995f48) - refactor useUpdateNodeInternals: only call updateNodeDimensions once
- [#3059](https://github.com/wbkd/react-flow/pull/3059) [`4374459e`](https://github.com/wbkd/react-flow/commit/4374459ef9fec797bbc0407231f09a1acacd245b) - fix useUpdateNodeInternals: update type
- Updated dependencies [[`70ec97f7`](https://github.com/wbkd/react-flow/commit/70ec97f7daec6d5401215cae3edac04aea88a3ba), [`33915b88`](https://github.com/wbkd/react-flow/commit/33915b88c2ae701847870346b381f9cfa86c6459), [`d2d1aebc`](https://github.com/wbkd/react-flow/commit/d2d1aebc0f7fea4183406e7d1915b7fcd6995f48), [`4374459e`](https://github.com/wbkd/react-flow/commit/4374459ef9fec797bbc0407231f09a1acacd245b)]:
  - @reactflow/core@11.7.2
  - @reactflow/controls@11.1.13
  - @reactflow/background@11.2.2
  - @reactflow/minimap@11.5.2
  - @reactflow/node-toolbar@1.2.1

## 11.7.1

### Patch Changes

- [#3043](https://github.com/wbkd/react-flow/pull/3043) [`cf7a7d3d`](https://github.com/wbkd/react-flow/commit/cf7a7d3dad1e73215a72a5dc72e21fd50208cdbb) - handles: handles on top of each other, reduce re-renderings
- [#3046](https://github.com/wbkd/react-flow/pull/3046) [`07b975bb`](https://github.com/wbkd/react-flow/commit/07b975bbee3580249e36a19582213b250f78093c) - base-edge: pass id to base edge path
- [#3007](https://github.com/wbkd/react-flow/pull/3007) [`c80d269b`](https://github.com/wbkd/react-flow/commit/c80d269b85a0054221f4639c328fc36a3befbe70) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - allow array of ids as updateNodeInternals arg
- [#3029](https://github.com/wbkd/react-flow/pull/3029) [`a3fa164c`](https://github.com/wbkd/react-flow/commit/a3fa164c34cc820c79bb031c9fd97b72a3546614) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - autopan: only update nodes when transform change happen
- [#3052](https://github.com/wbkd/react-flow/pull/3052) [`55e05cf7`](https://github.com/wbkd/react-flow/commit/55e05cf76ae21863691153e76dbd51d1eecd2c60) Thanks [@Noam3kCH](https://github.com/Noam3kCH)! - node-toolbar: add prop to align bar at start, center or end

- Updated dependencies [[`cf7a7d3d`](https://github.com/wbkd/react-flow/commit/cf7a7d3dad1e73215a72a5dc72e21fd50208cdbb), [`07b975bb`](https://github.com/wbkd/react-flow/commit/07b975bbee3580249e36a19582213b250f78093c), [`55e05cf7`](https://github.com/wbkd/react-flow/commit/55e05cf76ae21863691153e76dbd51d1eecd2c60), [`c80d269b`](https://github.com/wbkd/react-flow/commit/c80d269b85a0054221f4639c328fc36a3befbe70), [`46526b4e`](https://github.com/wbkd/react-flow/commit/46526b4e02b83d74726701e3ba73d0be8cf80787), [`a3fa164c`](https://github.com/wbkd/react-flow/commit/a3fa164c34cc820c79bb031c9fd97b72a3546614)]:
  - @reactflow/core@11.7.1
  - @reactflow/node-toolbar@1.2.0
  - @reactflow/controls@11.1.12
  - @reactflow/background@11.2.1
  - @reactflow/minimap@11.5.1

## 11.7.0

Most notable updates:

- `@reactflow/node-resizer` is now part of this package. No need to install it separately anymore.
- Handles: `isConnectableStart` and `isConnectableEnd` props to configure if you can start or end a connection at a certain handle
- Edges: `updatable` option to enable updates for specific edges
- MiniMap: `inversePan` and `zoomStep` props
- Background: `id` and `offset` props - this enables you to combine different patterns (useful if you want a graph paper like background for example)
- useNodesInitialized: options to configure if hidden nodes should be included (false by default)

Big thanks to [@Elringus](https://github.com/Elringus) and [@bcakmakoglu](https://github.com/bcakmakoglu)!

### Minor Changes

- [#2964](https://github.com/wbkd/react-flow/pull/2964) [`2fb4c2c8`](https://github.com/wbkd/react-flow/commit/2fb4c2c82343751ff536da262de74bd9080321b4) - add @reactflow/node-resizer package
- [#2960](https://github.com/wbkd/react-flow/pull/2960) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - edges: add `updatable` option
- [#2958](https://github.com/wbkd/react-flow/pull/2958) [`4d97a0ed`](https://github.com/wbkd/react-flow/commit/4d97a0ed168ce643fc0c99fa6b47cf1296d66065) - handles: add `isConnectableStart` and `isConnectableEnd` props
- [#2956](https://github.com/wbkd/react-flow/pull/2956) [`923a54c4`](https://github.com/wbkd/react-flow/commit/923a54c481b90954806202817ba844cfa7203a38) - add options for `useNodesInitialized`, ignore hidden nodes by default
- [#2944](https://github.com/wbkd/react-flow/pull/2944) Thanks [@Elringus](https://github.com/Elringus)! - add `inversePan` and `zoomStep` props
- [#2941](https://github.com/wbkd/react-flow/pull/2941) Thanks [@Elringus](https://github.com/Elringus)! - background: add `id` and `offset` props

### Patch Changes

- [#2926](https://github.com/wbkd/react-flow/pull/2926) Thanks [@Elringus](https://github.com/Elringus)! - fix non-passive wheel event listener violation
- [#2933](https://github.com/wbkd/react-flow/pull/2933) [`fe8cac0a`](https://github.com/wbkd/react-flow/commit/fe8cac0adb359109e0e9eafe8b9261ba354076bb) - prefix error keys with "error"
- [#2939](https://github.com/wbkd/react-flow/pull/2939) [`4a4ca171`](https://github.com/wbkd/react-flow/commit/4a4ca171955f5c8d58b23e3ad48406f1a21dc402) - add connection result to store

### Patch Changes

- Updated dependencies [[`098eee3d`](https://github.com/wbkd/react-flow/commit/098eee3d41dabc870777b081796401ff13b5a776), [`fe8cac0a`](https://github.com/wbkd/react-flow/commit/fe8cac0adb359109e0e9eafe8b9261ba354076bb), [`4a4ca171`](https://github.com/wbkd/react-flow/commit/4a4ca171955f5c8d58b23e3ad48406f1a21dc402), [`c1448c2f`](https://github.com/wbkd/react-flow/commit/c1448c2f7415dd3b4b2c54e05404c5ab24e8978d), [`923a54c4`](https://github.com/wbkd/react-flow/commit/923a54c481b90954806202817ba844cfa7203a38), [`4d97a0ed`](https://github.com/wbkd/react-flow/commit/4d97a0ed168ce643fc0c99fa6b47cf1296d66065), [`771c7a5d`](https://github.com/wbkd/react-flow/commit/771c7a5d133ce96e9f7471394c15189e0657ce01), [`c22e1c28`](https://github.com/wbkd/react-flow/commit/c22e1c28c5555a638c2a8e82c3bfc986b3965d36)]:
  - @reactflow/core@11.7.0
  - @reactflow/minimap@11.5.0
  - @reactflow/background@11.2.0
  - @reactflow/controls@11.1.11
  - @reactflow/node-toolbar@1.1.11

## 11.6.1

### Patch Changes

- Always create new edge object (fixes an issue with Redux toolkit and other immutable helper libs)

## 11.6.0

This release introduces a new `isValidConnection` prop for the ReactFlow component. You no longer need to pass it to all your Handle components but can pass it once. We also added a new option for the `updateEdge` function that allows you to specify if you want to replace an id when updating it. More over the `MiniMap` got a new `nodeComponent` prop to pass a custom component for the mini map nodes.

### Minor Changes

- [#2877](https://github.com/wbkd/react-flow/pull/2877) [`b8886514`](https://github.com/wbkd/react-flow/commit/b88865140c72fa7e92a883498768000cb2cc96a7) - add `isValidConnection` prop for ReactFlow component
- [#2847](https://github.com/wbkd/react-flow/pull/2847) [`16bf89f2`](https://github.com/wbkd/react-flow/commit/16bf89f2b7bbf8449c00d0e2c07c19c3ff6d2533) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Add option to enable/disable replacing edge id when using `updateEdge`
- [#2906](https://github.com/wbkd/react-flow/pull/2906) [`4a30185a`](https://github.com/wbkd/react-flow/commit/4a30185a12899691ff61259f0db84bc5494cb573) Thanks [@hayleigh-dot-dev](https://github.com/hayleigh-dot-dev)! - Minimap: add nodeComponent prop for passing custom component

### Patch Changes

- [#2895](https://github.com/wbkd/react-flow/pull/2895) [`3d5764ca`](https://github.com/wbkd/react-flow/commit/3d5764cac6548984a30cbf85899024e62fd69425) - add data-testid for controls, minimap and background
- [#2894](https://github.com/wbkd/react-flow/pull/2894) [`83fc4675`](https://github.com/wbkd/react-flow/commit/83fc467545527729633e817dbccfe59d0040da4b) - fix(nodes): blur when node gets unselected
- [#2892](https://github.com/wbkd/react-flow/pull/2892) [`5fabd272`](https://github.com/wbkd/react-flow/commit/5fabd2720f6367f75f79a45822d8f675a3b8e1cf) Thanks [@danielgek](https://github.com/danielgek) - track modifier keys on useKeypress
- [#2893](https://github.com/wbkd/react-flow/pull/2893) [`8f080bd5`](https://github.com/wbkd/react-flow/commit/8f080bd5e0e7e6c71f51eee9c9f2bc4b25182861) - fix: check if handle is connectable

- Updated dependencies [[`3d5764ca`](https://github.com/wbkd/react-flow/commit/3d5764cac6548984a30cbf85899024e62fd69425), [`4a30185a`](https://github.com/wbkd/react-flow/commit/4a30185a12899691ff61259f0db84bc5494cb573), [`83fc4675`](https://github.com/wbkd/react-flow/commit/83fc467545527729633e817dbccfe59d0040da4b), [`b1190837`](https://github.com/wbkd/react-flow/commit/b11908370bc438ca8d4179497cd4eb1f8c656798), [`5fabd272`](https://github.com/wbkd/react-flow/commit/5fabd2720f6367f75f79a45822d8f675a3b8e1cf), [`8f080bd5`](https://github.com/wbkd/react-flow/commit/8f080bd5e0e7e6c71f51eee9c9f2bc4b25182861), [`b8886514`](https://github.com/wbkd/react-flow/commit/b88865140c72fa7e92a883498768000cb2cc96a7), [`16bf89f2`](https://github.com/wbkd/react-flow/commit/16bf89f2b7bbf8449c00d0e2c07c19c3ff6d2533)]:
  - @reactflow/background@11.1.9
  - @reactflow/controls@11.1.9
  - @reactflow/core@11.6.0
  - @reactflow/minimap@11.4.0
  - @reactflow/node-toolbar@1.1.9

## 11.5.6

### Patch Changes

- [#2834](https://github.com/wbkd/react-flow/pull/2834) [`23424ea6`](https://github.com/wbkd/react-flow/commit/23424ea6750f092210f83df17a00c89adb910d96) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Add `nodes` to fit view options to allow fitting view only around specified set of nodes
- [#2836](https://github.com/wbkd/react-flow/pull/2836) [`959b1114`](https://github.com/wbkd/react-flow/commit/959b111448bba4686040473e46988be9e7befbe6) - Fix: connections for handles with bigger handles than connection radius
- [#2819](https://github.com/wbkd/react-flow/pull/2819) [`0d259b02`](https://github.com/wbkd/react-flow/commit/0d259b028558aab650546f3371a85f3bce45252f) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Avoid triggering edge update if not using left mouse button
- [#2832](https://github.com/wbkd/react-flow/pull/2832) [`f3de9335`](https://github.com/wbkd/react-flow/commit/f3de9335af6cd96cd77dc77f24a944eef85384e5) - fitView: return type boolean
- [#2838](https://github.com/wbkd/react-flow/pull/2838) [`021f5a92`](https://github.com/wbkd/react-flow/commit/021f5a9210f47a968e50446cd2f9dae1f97880a4) - refactor: use key press handle modifier keys + input
- [#2839](https://github.com/wbkd/react-flow/pull/2839) [`72216ff6`](https://github.com/wbkd/react-flow/commit/72216ff62014acd2d73999053c72bd7aeed351f6) - fix PropsWithChildren: pass default generic for v17 types

- Updated dependencies [[`72216ff6`](https://github.com/wbkd/react-flow/commit/72216ff62014acd2d73999053c72bd7aeed351f6), [`959b1114`](https://github.com/wbkd/react-flow/commit/959b111448bba4686040473e46988be9e7befbe6), [`0d259b02`](https://github.com/wbkd/react-flow/commit/0d259b028558aab650546f3371a85f3bce45252f), [`f3de9335`](https://github.com/wbkd/react-flow/commit/f3de9335af6cd96cd77dc77f24a944eef85384e5), [`23424ea6`](https://github.com/wbkd/react-flow/commit/23424ea6750f092210f83df17a00c89adb910d96), [`021f5a92`](https://github.com/wbkd/react-flow/commit/021f5a9210f47a968e50446cd2f9dae1f97880a4)]:
  - @reactflow/core@11.5.5
  - @reactflow/background@11.1.8
  - @reactflow/controls@11.1.8
  - @reactflow/minimap@11.3.8
  - @reactflow/node-toolbar@1.1.8

## 11.5.5

### Patch Changes

- [`383a074a`](https://github.com/wbkd/react-flow/commit/383a074aeae6dbec8437fa08c7c8d8240838a84e) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Check if prevClosestHandle exists in onPointerUp. Fixes connections getting stuck on last handle and connecting, even when out of connectionRadius

- Updated dependencies [[`383a074a`](https://github.com/wbkd/react-flow/commit/383a074aeae6dbec8437fa08c7c8d8240838a84e)]:
  - @reactflow/core@11.5.4
  - @reactflow/background@11.1.7
  - @reactflow/controls@11.1.7
  - @reactflow/minimap@11.3.7
  - @reactflow/node-toolbar@1.1.7

## 11.5.4

This release fixes some issues with the newly introduced connection radius feature. We are now not only checking the radius but the handle itself too (like in the old version). That means that you can connect to a handle that is bigger than the connection radius. We are also not snapping connections anymore when they are not valid and pass a status class to the connection line that says if the current connection is valid or not. More over we fixed a connection issue with iOS.

### Patch Changes

- [#2800](https://github.com/wbkd/react-flow/pull/2800) [`be8097ac`](https://github.com/wbkd/react-flow/commit/be8097acadca3054c3b236ce4296fc516010ef8c) - When node is not draggable, you can't move it with a selection either
- [#2803](https://github.com/wbkd/react-flow/pull/2803) [`1527795d`](https://github.com/wbkd/react-flow/commit/1527795d18c3af38c8ec7059436ea0fbf6c27bbd) - connection: add status class (valid or invalid) while in connection radius
- [#2801](https://github.com/wbkd/react-flow/pull/2801) [`3b6348a8`](https://github.com/wbkd/react-flow/commit/3b6348a8d1573afb39576327318bc172e33393c2) - fix(ios): connection error + dont snap invalid connection lines, check handle and connection radius

- Updated dependencies [[`be8097ac`](https://github.com/wbkd/react-flow/commit/be8097acadca3054c3b236ce4296fc516010ef8c), [`1527795d`](https://github.com/wbkd/react-flow/commit/1527795d18c3af38c8ec7059436ea0fbf6c27bbd), [`3b6348a8`](https://github.com/wbkd/react-flow/commit/3b6348a8d1573afb39576327318bc172e33393c2)]:
  - @reactflow/core@11.5.3
  - @reactflow/background@11.1.6
  - @reactflow/controls@11.1.6
  - @reactflow/minimap@11.3.6
  - @reactflow/node-toolbar@1.1.6

## 11.5.3

### Patch Changes

- [#2792](https://github.com/wbkd/react-flow/pull/2792) [`d8c679b4`](https://github.com/wbkd/react-flow/commit/d8c679b4c90c5b57d4b51e4aaa988243d6eaff5a) - Accept React 17 types as dev dependency

- Updated dependencies [[`d8c679b4`](https://github.com/wbkd/react-flow/commit/d8c679b4c90c5b57d4b51e4aaa988243d6eaff5a)]:
  - @reactflow/background@11.1.5
  - @reactflow/controls@11.1.5
  - @reactflow/core@11.5.2
  - @reactflow/minimap@11.3.5
  - @reactflow/node-toolbar@1.1.5

## 11.5.2

### Patch Changes

- [#2783](https://github.com/wbkd/react-flow/pull/2783) [`71153534`](https://github.com/wbkd/react-flow/commit/7115353418ebc7f7c81ab0e861200972bbf7dbd5) - connections: check handle below mouse before using connection radius

- Updated dependencies [[`71153534`](https://github.com/wbkd/react-flow/commit/7115353418ebc7f7c81ab0e861200972bbf7dbd5)]:
  - @reactflow/core@11.5.1
  - @reactflow/background@11.1.4
  - @reactflow/controls@11.1.4
  - @reactflow/minimap@11.3.4
  - @reactflow/node-toolbar@1.1.4

## 11.5.1

### Minor Changes

- use latest node-toolbar package to prevent dependency issues

## 11.5.0

Lot's of improvements are coming with this release!

- **Connecting radius**: No need to drop a connection line on top of handle anymore. You only need to be close to the handle. That radius can be configured with the `connectionRadius` prop.
- **Auto pan**: When you drag a node, a selection or the connection line to the border of the pane, it will pan into that direction. That makes it easier to connect far away nodes for example. If you don't like it you can set `autoPnaOnNodeDrag` and `autoPanOnConnect` to false.
- **Touch devices**: It's finally possibleto connect nodes with the connection line on touch devices. In combination with the new auto pan and connection radius the overall UX is way better.
- **Errors**: We added an `onError` prop to get notified when an error like "couldn't find source handle" happens. This is useful if you want to log errors for example.
- **Node type**: We added a second param to the generic `Node` type. You can not only pass `NodeData` but also the type as a second param:

```ts
type MyCustomNode = Node<MyCustomNodeData, 'custom-node-type'>;
```

This makes it easier to work with different custom nodes and data types.

### Minor Changes

- [#2754](https://github.com/wbkd/react-flow/pull/2754) [`e96309b6`](https://github.com/wbkd/react-flow/commit/e96309b6a57b1071faeebf7b0547fef7fd418694) - Add auto pan for connecting and node dragging and `connectionRadius`
- [#2773](https://github.com/wbkd/react-flow/pull/2773) - Add `onError` prop to get notified when an error happens

### Patch Changes

- [#2763](https://github.com/wbkd/react-flow/pull/2763) [`85003b01`](https://github.com/wbkd/react-flow/commit/85003b01add71ea852bd5b0d2f1e7496050a6b52) - Connecting nodes: Enable connections on touch devices
- [#2620](https://github.com/wbkd/react-flow/pull/2620) - Thanks [RichSchulz](https://github.com/RichSchulz)! - Types: improve typing for node type

- Updated dependencies [[`e96309b6`](https://github.com/wbkd/react-flow/commit/e96309b6a57b1071faeebf7b0547fef7fd418694), [`85003b01`](https://github.com/wbkd/react-flow/commit/85003b01add71ea852bd5b0d2f1e7496050a6b52), [`4c516882`](https://github.com/wbkd/react-flow/commit/4c516882d2bbf426c1832a53ad40763cc1abef92)]:
  - @reactflow/core@11.5.0
  - @reactflow/background@11.1.3
  - @reactflow/controls@11.1.3
  - @reactflow/minimap@11.3.3

## 11.4.2

### Patch Changes

- [#2741](https://github.com/wbkd/react-flow/pull/2741) [`e2aff6c1`](https://github.com/wbkd/react-flow/commit/e2aff6c1e4ce54b57b724b2624367ee5fefd1c39) - chore(dependencies): update and cleanup

- Updated dependencies [[`e34a3072`](https://github.com/wbkd/react-flow/commit/e34a30726dc55184f59adc4f16ca5215a7c42805), [`e2aff6c1`](https://github.com/wbkd/react-flow/commit/e2aff6c1e4ce54b57b724b2624367ee5fefd1c39)]:
  - @reactflow/background@11.1.2
  - @reactflow/core@11.4.2
  - @reactflow/minimap@11.3.2
  - @reactflow/node-toolbar@1.1.2
  - @reactflow/controls@11.1.2

## 11.4.1

### Patch Changes

- [#2738](https://github.com/wbkd/react-flow/pull/2738) [`82988485`](https://github.com/wbkd/react-flow/commit/82988485b730a9e32acbdae1ddcc81b33ddccaba) - fix: fitView for subflows, context menu on right mouse pan
- [#2740](https://github.com/wbkd/react-flow/pull/2740) [`d91e619a`](https://github.com/wbkd/react-flow/commit/d91e619a70a95db99a621ede59bc05b5a7766086) Thanks [@michaelspiss](https://github.com/michaelspiss)! - EdgeRenderer: check all handles for connection mode loose

- Updated dependencies [[`82988485`](https://github.com/wbkd/react-flow/commit/82988485b730a9e32acbdae1ddcc81b33ddccaba), [`d91e619a`](https://github.com/wbkd/react-flow/commit/d91e619a70a95db99a621ede59bc05b5a7766086)]:
  - @reactflow/core@11.4.1
  - @reactflow/background@11.1.1
  - @reactflow/controls@11.1.1
  - @reactflow/minimap@11.3.1
  - @reactflow/node-toolbar@1.1.1

## 11.4.0

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

- Updated dependencies [[`ab2ff374`](https://github.com/wbkd/react-flow/commit/ab2ff3740618da48bd4350597e816c397f3d78ff), [`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0), [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493), [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9), [`7ef29108`](https://github.com/wbkd/react-flow/commit/7ef2910808aaaee029894363d52efc0c378a7654), [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c)]:
  - @reactflow/core@11.4.0
  - @reactflow/minimap@11.3.0
  - @reactflow/node-toolbar@1.1.0
  - @reactflow/background@11.1.0
  - @reactflow/controls@11.1.0

## 11.4.0-next.1

### Minor Changes

- panOnDrag: Use numbers for prop ([1,2] = drag via middle or right mouse button)
  selection: do not include hidden nodes
  minimap: fix onNodeClick for nodes outside the viewport
  keys: allow multi select when input is focused

### Patch Changes

- Updated dependencies []:
  - @reactflow/background@11.1.0-next.1
  - @reactflow/controls@11.1.0-next.1
  - @reactflow/core@11.4.0-next.1
  - @reactflow/minimap@11.3.0-next.1
  - @reactflow/node-toolbar@1.1.0-next.1

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

- Updated dependencies [[`50032c3d`](https://github.com/wbkd/react-flow/commit/50032c3d953bd819d0afe48e4b61f77f987cc8d0), [`baa8689e`](https://github.com/wbkd/react-flow/commit/baa8689ef629d22da4cbbef955e0c83d21df0493), [`4244bae2`](https://github.com/wbkd/react-flow/commit/4244bae25a36cb4904dc1fbba26e1c4d5d463cb9), [`23afb3ab`](https://github.com/wbkd/react-flow/commit/23afb3abebdb42fad284f68bec164afac609563c)]:
  - @reactflow/core@11.4.0-next.0
  - @reactflow/minimap@11.3.0-next.0
  - @reactflow/node-toolbar@1.1.0-next.0
  - @reactflow/background@11.0.8-next.0
  - @reactflow/controls@11.0.8-next.0

## 11.3.3

In this update we did some changes so that we could implement the new [`<NodeResizer />`](https://reactflow.dev/docs/api/nodes/node-resizer/) component (not part of the `reactflow` package!) more smoothly.

### Patch Changes

- Updated dependencies [[`e6b5d90f`](https://github.com/wbkd/react-flow/commit/e6b5d90f61c8ee60e817bba232a162cae2ab3e2a), [`6ee44e07`](https://github.com/wbkd/react-flow/commit/6ee44e076eaa6908d07578a757a5187642b732ae), [`d29c401d`](https://github.com/wbkd/react-flow/commit/d29c401d598dbf2dcd5609b7adb8d029906a6f18), [`aa69c207`](https://github.com/wbkd/react-flow/commit/aa69c20765e6978f4f9c8cc63ed7110dbf6d9d9d), [`d29c401d`](https://github.com/wbkd/react-flow/commit/d29c401d598dbf2dcd5609b7adb8d029906a6f18), [`0df02f35`](https://github.com/wbkd/react-flow/commit/0df02f35f8d6c54dae36af18278feadc77acb2d6)]:
  - @reactflow/core@11.3.2
  - @reactflow/minimap@11.2.3
  - @reactflow/node-toolbar@1.0.2
  - @reactflow/background@11.0.7
  - @reactflow/controls@11.0.7

## 11.3.2

### Patch Changes

- [`7ece618d`](https://github.com/wbkd/react-flow/commit/7ece618d94b76183c1ecd45b16f6ab168168351b) Thanks [@lounsbrough](https://github.com/lounsbrough)! - Fix minimap node position

- Updated dependencies [[`7ece618d`](https://github.com/wbkd/react-flow/commit/7ece618d94b76183c1ecd45b16f6ab168168351b)]:
  - @reactflow/minimap@11.2.2

## 11.3.1

### Patch Changes

- [#2595](https://github.com/wbkd/react-flow/pull/2595) [`c828bfda`](https://github.com/wbkd/react-flow/commit/c828bfda0a8c4774bc43588640c7cca0cfdcb3f4) Thanks [@chrtze](https://github.com/chrtze)! - Fix and improve the behaviour when using nodeOrigin in combination with subflows
- [#2602](https://github.com/wbkd/react-flow/pull/2602) [`b0302ce4`](https://github.com/wbkd/react-flow/commit/b0302ce4261a992bee841bae84af347d03be690f) Thanks [@sdegueldre](https://github.com/sdegueldre)! - Don't use try catch in wrapper for checking if provider is available
- [#2601](https://github.com/wbkd/react-flow/pull/2601) [`b2c72813`](https://github.com/wbkd/react-flow/commit/b2c728137d1b53e38883f044fa447585c377a6af) Thanks [@hoondeveloper](https://github.com/hoondeveloper)! - fix isRectObject function
- [#2594](https://github.com/wbkd/react-flow/pull/2594) [`ec94d9ec`](https://github.com/wbkd/react-flow/commit/ec94d9ecdc964d6d66c04e9242f195614bbfdbbe) Thanks [@chrtze](https://github.com/chrtze)! - Allow multiple node ids to be passed for enabling multi selection toolbars

- Updated dependencies [[`c828bfda`](https://github.com/wbkd/react-flow/commit/c828bfda0a8c4774bc43588640c7cca0cfdcb3f4), [`b0302ce4`](https://github.com/wbkd/react-flow/commit/b0302ce4261a992bee841bae84af347d03be690f), [`b2c72813`](https://github.com/wbkd/react-flow/commit/b2c728137d1b53e38883f044fa447585c377a6af), [`ec94d9ec`](https://github.com/wbkd/react-flow/commit/ec94d9ecdc964d6d66c04e9242f195614bbfdbbe)]:
  - @reactflow/core@11.3.1
  - @reactflow/minimap@11.2.1
  - @reactflow/node-toolbar@1.0.1
  - @reactflow/background@11.0.6
  - @reactflow/controls@11.0.6

## 11.3.0

### Minor Changes

- [#2562](https://github.com/wbkd/react-flow/pull/2562) [`d745aa33`](https://github.com/wbkd/react-flow/commit/d745aa33fcd1333e12929c862f9a3d6de53f7179) Thanks [@moklick](https://github.com/moklick)! - Minimap: Add `maskStrokeColor` and `maskStrokeWidth` props
- [#2563](https://github.com/wbkd/react-flow/pull/2563) [`98116d43`](https://github.com/wbkd/react-flow/commit/98116d431f9fcdcc9b23a5b606a94ec0740b64cd) Thanks [@chrtze](https://github.com/chrtze)! - Core: Add `<NodeToolbar />` component that renders a fixed element attached to a node
- [#2545](https://github.com/wbkd/react-flow/pull/2545) [`8f63f751`](https://github.com/wbkd/react-flow/commit/8f63f751e302d3c935865760d2134350c31ab93f) Thanks [@chrtze](https://github.com/chrtze)! - Minimap: Add `ariaLabel` prop to configure or remove the aria-label

### Patch Changes

- [#2561](https://github.com/wbkd/react-flow/pull/2561) [`92cf497e`](https://github.com/wbkd/react-flow/commit/92cf497eb72f21af592a53f5af9770c9f1e6d940) Thanks [@moklick](https://github.com/moklick)! - Core: Fix multi selection and fitView when nodeOrigin is used
- [#2560](https://github.com/wbkd/react-flow/pull/2560) [`a39224b3`](https://github.com/wbkd/react-flow/commit/a39224b3a80afbdb83fc4490dd5f4f2be23cd4dd) Thanks [@neo](https://github.com/neo)! - Core: Always elevate zIndex when node is selected
- [#2573](https://github.com/wbkd/react-flow/pull/2573) [`5e8b67dd`](https://github.com/wbkd/react-flow/commit/5e8b67dd41f9bb60dcd7f5d14cc34b42c970e967) Thanks [@moklick](https://github.com/moklick)! - Core: Fix disappearing connection line for loose flows
- [#2558](https://github.com/wbkd/react-flow/pull/2558) [`2a1c7db6`](https://github.com/wbkd/react-flow/commit/2a1c7db6b27ac0f4f81dcef2d593f4753c4321c7) Thanks [@moklick](https://github.com/moklick)! - Core: Handle multiple instances on a page for EdgeLabelRenderer

- Updated dependencies [[`d745aa33`](https://github.com/wbkd/react-flow/commit/d745aa33fcd1333e12929c862f9a3d6de53f7179), [`92cf497e`](https://github.com/wbkd/react-flow/commit/92cf497eb72f21af592a53f5af9770c9f1e6d940), [`98116d43`](https://github.com/wbkd/react-flow/commit/98116d431f9fcdcc9b23a5b606a94ec0740b64cd), [`8f63f751`](https://github.com/wbkd/react-flow/commit/8f63f751e302d3c935865760d2134350c31ab93f), [`a39224b3`](https://github.com/wbkd/react-flow/commit/a39224b3a80afbdb83fc4490dd5f4f2be23cd4dd), [`5e8b67dd`](https://github.com/wbkd/react-flow/commit/5e8b67dd41f9bb60dcd7f5d14cc34b42c970e967), [`2a1c7db6`](https://github.com/wbkd/react-flow/commit/2a1c7db6b27ac0f4f81dcef2d593f4753c4321c7), [`c793433c`](https://github.com/wbkd/react-flow/commit/c793433cafc214281ae97c9a32f5ac2fe453c34f)]:
  - @reactflow/minimap@11.2.0
  - @reactflow/core@11.3.0
  - @reactflow/node-toolbar@1.0.0
  - @reactflow/background@11.0.5
  - @reactflow/controls@11.0.5

## 11.2.0

### Minor Changes

- [#2535](https://github.com/wbkd/react-flow/pull/2535) [`7902a3ce`](https://github.com/wbkd/react-flow/commit/7902a3ce3188426d5cd07cf0943a68f679e67948) Thanks [@moklick](https://github.com/moklick)! - Feat: Add edge label renderer
- [#2536](https://github.com/wbkd/react-flow/pull/2536) [`b25d499e`](https://github.com/wbkd/react-flow/commit/b25d499ec05b5c6f21ac552d03650eb37433552e) Thanks [@pengfu](https://github.com/pengfu)! - Feat: add deleteElements helper function
- [#2539](https://github.com/wbkd/react-flow/pull/2539) [`4fc1253e`](https://github.com/wbkd/react-flow/commit/4fc1253eadf9b7dd392d8dc2348f44fa8d08f931) Thanks [@moklick](https://github.com/moklick)! - Feat: add intersection helpers
- [#2530](https://github.com/wbkd/react-flow/pull/2530) [`8ba4dd5d`](https://github.com/wbkd/react-flow/commit/8ba4dd5d1d4b2e6f107c148de62aec0b688d8b21) Thanks [@moklick](https://github.com/moklick)! - Feat: Add pan and zoom to mini map

### Patch Changes

- [#2538](https://github.com/wbkd/react-flow/pull/2538) [`740659c0`](https://github.com/wbkd/react-flow/commit/740659c0e788c7572d4a1e64e1d33d60712233fc) Thanks [@neo](https://github.com/neo)! - Refactor: put React Flow in isolated stacking context

- Updated dependencies [[`740659c0`](https://github.com/wbkd/react-flow/commit/740659c0e788c7572d4a1e64e1d33d60712233fc), [`7902a3ce`](https://github.com/wbkd/react-flow/commit/7902a3ce3188426d5cd07cf0943a68f679e67948), [`b25d499e`](https://github.com/wbkd/react-flow/commit/b25d499ec05b5c6f21ac552d03650eb37433552e), [`4fc1253e`](https://github.com/wbkd/react-flow/commit/4fc1253eadf9b7dd392d8dc2348f44fa8d08f931), [`8ba4dd5d`](https://github.com/wbkd/react-flow/commit/8ba4dd5d1d4b2e6f107c148de62aec0b688d8b21)]:
  - @reactflow/core@11.2.0
  - @reactflow/minimap@11.1.0
  - @reactflow/background@11.0.4
  - @reactflow/controls@11.0.4

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
