# @xyflow/system

## 0.0.74

### Patch Changes

- [#5637](https://github.com/xyflow/xyflow/pull/5637) [`0c7261a6d`](https://github.com/xyflow/xyflow/commit/0c7261a6dc94f1aa58333a6aebcaca8ced9b5ad2) Thanks [@moklick](https://github.com/moklick)! - Add `zIndexMode` to control how z-index is calculated for nodes and edges

- [#5617](https://github.com/xyflow/xyflow/pull/5617) [`8598b6bc2`](https://github.com/xyflow/xyflow/commit/8598b6bc2a9d052b12d5215706382da0aa84827b) Thanks [@akre54](https://github.com/akre54)! - Allow custom `getEdgeId` function in `addEdge` and `reconnectEdge` options to enable custom edge ID schemes.

- [#5635](https://github.com/xyflow/xyflow/pull/5635) [`2d7fa40e2`](https://github.com/xyflow/xyflow/commit/2d7fa40e2684a0fcdd4eca7800ccf2c34338e549) Thanks [@tornado-softwares](https://github.com/tornado-softwares)! - Update an ongoing connection when user moves node with keyboard.

## 0.0.73

### Patch Changes

- [#5578](https://github.com/xyflow/xyflow/pull/5578) [`00bcb9f5f`](https://github.com/xyflow/xyflow/commit/00bcb9f5f45f49814b9ac19b3f55cfe069ee3773) Thanks [@peterkogo](https://github.com/peterkogo)! - Pass current pointer position to connection

## 0.0.72

### Patch Changes

- [#5572](https://github.com/xyflow/xyflow/pull/5572) [`5ec0cac7f`](https://github.com/xyflow/xyflow/commit/5ec0cac7fad21109b74839969c0818f88ddc87d9) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix onPaneClick events being suppressed when selectionOnDrag=true

## 0.0.71

### Patch Changes

- [#5544](https://github.com/xyflow/xyflow/pull/5544) [`c17b49f4c`](https://github.com/xyflow/xyflow/commit/c17b49f4c16167da3f791430163edd592159d27d) Thanks [@0x0f0f0f](https://github.com/0x0f0f0f)! - Add `EdgeToolbar` component

- [#5550](https://github.com/xyflow/xyflow/pull/5550) [`6ffb9f790`](https://github.com/xyflow/xyflow/commit/6ffb9f7901c32f5b335aee2517f41bf87f274f32) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent child nodes of different parents from overlapping

- [#5528](https://github.com/xyflow/xyflow/pull/5528) [`d50a963cd`](https://github.com/xyflow/xyflow/commit/d50a963cd0f00cd31236d760dcd7995218d80553) Thanks [@peterkogo](https://github.com/peterkogo)! - Let `NodeResizer` props change during ongoing resize

- [#5551](https://github.com/xyflow/xyflow/pull/5551) [`6bb64b3ed`](https://github.com/xyflow/xyflow/commit/6bb64b3ed60f26c9ea8bc01c8d62fb9bf74cd634) Thanks [@moklick](https://github.com/moklick)! - Allow to start a selection above a node

- [#5546](https://github.com/xyflow/xyflow/pull/5546) [`8a9ee2d83`](https://github.com/xyflow/xyflow/commit/8a9ee2d836776da42b867c6ba90d302fbbc79b37) Thanks [@0x0f0f0f](https://github.com/0x0f0f0f)! - Do not crash mini map if all nodes are hidden

- [#5547](https://github.com/xyflow/xyflow/pull/5547) [`1c8961207`](https://github.com/xyflow/xyflow/commit/1c8961207e8ac326098af18489465b36cdd2d831) Thanks [@moklick](https://github.com/moklick)! - Always call `onMoveEnd` when `onMoveStart` was called

## 0.0.70

### Patch Changes

- [#5515](https://github.com/xyflow/xyflow/pull/5515) [`9b4e99029`](https://github.com/xyflow/xyflow/commit/9b4e99029ba87d44c71b33c06259a126db193b43) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix id of static handles not being parsed

- [#5512](https://github.com/xyflow/xyflow/pull/5512) [`70b672604`](https://github.com/xyflow/xyflow/commit/70b67260470738dd0d88ed8ab558d400097be785) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent native page zoom when pinch zooming on node with nowheel class

## 0.0.69

### Patch Changes

- [#5480](https://github.com/xyflow/xyflow/pull/5480) [`f869808e3`](https://github.com/xyflow/xyflow/commit/f869808e3dfd3d289db034d21d505d62f84cdde3) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent multi-touch events while making a new connection

- [#5489](https://github.com/xyflow/xyflow/pull/5489) [`2a35c65a0`](https://github.com/xyflow/xyflow/commit/2a35c65a02c6c8aec6b005ac3e72988f996669c4) Thanks [@Sec-ant](https://github.com/Sec-ant)! - Fix nodeDragThreshold changing with zoom level

- [#5509](https://github.com/xyflow/xyflow/pull/5509) [`b6ae4cc11`](https://github.com/xyflow/xyflow/commit/b6ae4cc11f1456f843ace7e7f3de41c9196179e0) Thanks [@moklick](https://github.com/moklick)! - Prevent calling onResizeEnd if node was not resized

- [#5511](https://github.com/xyflow/xyflow/pull/5511) [`d891e5ff1`](https://github.com/xyflow/xyflow/commit/d891e5ff106c6202f69a9b14d261294cc29bbec7) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix regression: elevate edges if connected nodes are selected

- [#5497](https://github.com/xyflow/xyflow/pull/5497) [`eba087e8b`](https://github.com/xyflow/xyflow/commit/eba087e8bec74e6591e04ebf0e1e61799b94ecd8) Thanks [@peterkogo](https://github.com/peterkogo)! - Skip eagerly rendering nodes when node dimensions and handles are predefined

## 0.0.68

### Patch Changes

- [#5469](https://github.com/xyflow/xyflow/pull/5469) [`5ece6b36`](https://github.com/xyflow/xyflow/commit/5ece6b36da44d0dbbf6daf132eb9280e3c294bd2) Thanks [@moklick](https://github.com/moklick)! - Allow null for extent

- [`53da1193`](https://github.com/xyflow/xyflow/commit/53da119313f2ad9f1f6512a5ed1f6048bb4b0bec) Thanks [@moklick](https://github.com/moklick)! - Round floating numbers for node positions when dragging a multi selection

## 0.0.67

### Patch Changes

- [#5443](https://github.com/xyflow/xyflow/pull/5443) [`144f8feb`](https://github.com/xyflow/xyflow/commit/144f8feb0f4a74b63e44eb9edf5beed4dd8a9230) Thanks [@moklick](https://github.com/moklick)! - Use 1 as the default for interactive Minimap zoom step

- [#5428](https://github.com/xyflow/xyflow/pull/5428) [`f18e9856`](https://github.com/xyflow/xyflow/commit/f18e98569b1cc38b6ec2b7d7a3d1fd8b56a5d42f) Thanks [@Karl255](https://github.com/Karl255)! - Fix clicking on detached handle elements not initiating drawing of connections

- [#5453](https://github.com/xyflow/xyflow/pull/5453) [`7a088817`](https://github.com/xyflow/xyflow/commit/7a088817f71acb71c49e5bf4ac90352dab95f7b8) Thanks [@moklick](https://github.com/moklick)! - Snap selection instead of separate nodes when snap grid is enabled

- [#5415](https://github.com/xyflow/xyflow/pull/5415) [`6838df9d`](https://github.com/xyflow/xyflow/commit/6838df9d67a1f093464e911e949f1360a005832d) Thanks [@moklick](https://github.com/moklick)! - Allow strings and enums for existing marker types

- [#5450](https://github.com/xyflow/xyflow/pull/5450) [`fddbb7de`](https://github.com/xyflow/xyflow/commit/fddbb7de47b180767a0d6286ec58b5598c0cf6df) Thanks [@moklick](https://github.com/moklick)! - Call onNodeDrag while autopan is ongoing

- [#5448](https://github.com/xyflow/xyflow/pull/5448) [`f5fe1d71`](https://github.com/xyflow/xyflow/commit/f5fe1d71e04ded54a96250fa9c0ba7f8ce87fa66) Thanks [@moklick](https://github.com/moklick)! - Use correct HandleConnection type for Handle onConnect

- [#5419](https://github.com/xyflow/xyflow/pull/5419) [`daa33fb3`](https://github.com/xyflow/xyflow/commit/daa33fb3bd40427e8f26117da4dbcd2de726cfde) Thanks [@0x0f0f0f](https://github.com/0x0f0f0f)! - Make arrow heads markers fallback to --xy-edge-stroke CSS variable when passing null as marker color

## 0.0.66

### Patch Changes

- [#5321](https://github.com/xyflow/xyflow/pull/5321) [`864d4188`](https://github.com/xyflow/xyflow/commit/864d4188089b3e7f45b18f8a63e02758ee183f7f) Thanks [@dylanmiddendorf](https://github.com/dylanmiddendorf)! - Fix incorrect node position clamping for non-child nodes

- [#5376](https://github.com/xyflow/xyflow/pull/5376) [`f0ce2c87`](https://github.com/xyflow/xyflow/commit/f0ce2c876d8688e13632bc86286cf857f86dead6) Thanks [@kennyjwilli](https://github.com/kennyjwilli)! - Add stepPosition param to step edge

## 0.0.65

### Patch Changes

- [#5370](https://github.com/xyflow/xyflow/pull/5370) [`26f2cdd7`](https://github.com/xyflow/xyflow/commit/26f2cdd720fc2c8fb337d3af13b82dab6a90fb60) Thanks [@moklick](https://github.com/moklick)! - Only fire connection end events if connection was started

## 0.0.64

### Patch Changes

- [#5362](https://github.com/xyflow/xyflow/pull/5362) [`72dc1d60`](https://github.com/xyflow/xyflow/commit/72dc1d602110947e3db83c37b9a9125ee85cf4bc) Thanks [@moklick](https://github.com/moklick)! - Remove pointer events from Panel via CSS while a selection gets dragged

- [#5361](https://github.com/xyflow/xyflow/pull/5361) [`90e9247a`](https://github.com/xyflow/xyflow/commit/90e9247adbdfa9d06db97e1d0d895e35c960551c) Thanks [@peterkogo](https://github.com/peterkogo)! - Render edges above nodes when they are within a subflow

- [#5344](https://github.com/xyflow/xyflow/pull/5344) [`2441bf8d`](https://github.com/xyflow/xyflow/commit/2441bf8d97a6b72494f216915d52d5acbeefefde) Thanks [@moklick](https://github.com/moklick)! - Add connectionDragThreshold prop

## 0.0.63

### Patch Changes

- [#5354](https://github.com/xyflow/xyflow/pull/5354) [`c4312d89`](https://github.com/xyflow/xyflow/commit/c4312d8997ecdc7ef12cfa4efc1fde7131a2b950) Thanks [@moklick](https://github.com/moklick)! - Add TSDoc annotations

- [#5333](https://github.com/xyflow/xyflow/pull/5333) [`3d7e8b6b`](https://github.com/xyflow/xyflow/commit/3d7e8b6bb10001ee84d79ca4f6a9fd0053c4a276) Thanks [@peterkogo](https://github.com/peterkogo)! - Add missing type exports

- [#5350](https://github.com/xyflow/xyflow/pull/5350) [`9c61000c`](https://github.com/xyflow/xyflow/commit/9c61000cac6277ce97274cc626fa7266f82dec27) Thanks [@moklick](https://github.com/moklick)! - Only send node position updates if positions changed

## 0.0.62

### Patch Changes

- [#5299](https://github.com/xyflow/xyflow/pull/5299) [`848b486b`](https://github.com/xyflow/xyflow/commit/848b486b2201b650ecb3317f367a723edb2458e1) Thanks [@printerscanner](https://github.com/printerscanner)! - Add `ariaRole` prop to nodes and edges

- [#5280](https://github.com/xyflow/xyflow/pull/5280) [`dba6faf2`](https://github.com/xyflow/xyflow/commit/dba6faf20e7ec2524d5270d177331d3bd260f3ac) Thanks [@moklick](https://github.com/moklick)! - Improve typing for Nodes

- [#5276](https://github.com/xyflow/xyflow/pull/5276) [`6ce44a05`](https://github.com/xyflow/xyflow/commit/6ce44a05c829068ff5a8416ce3fa4ee6e0eced48) Thanks [@moklick](https://github.com/moklick)! - Add an `ease` and `interpolate` option to all function that alter the viewport

- [#5277](https://github.com/xyflow/xyflow/pull/5277) [`f59730ce`](https://github.com/xyflow/xyflow/commit/f59730ce3530a91f579f6bbd2ea9335680f552ef) Thanks [@printerscanner](https://github.com/printerscanner)! - Add `ariaLabelConfig` prop for customizing UI text like aria labels and descriptions.

- [#5317](https://github.com/xyflow/xyflow/pull/5317) [`09458f52`](https://github.com/xyflow/xyflow/commit/09458f52ff57356e03404c58e9bfdbfd50579850) Thanks [@moklick](https://github.com/moklick)! - Add `domAttributes` option for nodes and edges

- [#5326](https://github.com/xyflow/xyflow/pull/5326) [`050b511c`](https://github.com/xyflow/xyflow/commit/050b511cd6966ba526299f7ca11f9ca4791fd2cf) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent NodeResizer controls to become too small when zooming out

## 0.0.61

### Patch Changes

- [#5266](https://github.com/xyflow/xyflow/pull/5266) [`77107453`](https://github.com/xyflow/xyflow/commit/77107453fa6f34cb08ef91640b8b02d58e31275e) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix connection snapping for handles larger than connectionRadius

## 0.0.60

### Patch Changes

- [#5259](https://github.com/xyflow/xyflow/pull/5259) [`77bf79c4`](https://github.com/xyflow/xyflow/commit/77bf79c40e71e3da449ace3b1a1ed5bceff46b51) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix background-color css variable fallback.

## 0.0.59

### Patch Changes

- [#5255](https://github.com/xyflow/xyflow/pull/5255) [`a95f0e2f`](https://github.com/xyflow/xyflow/commit/a95f0e2fbfc2d070d9bd70b753d1606a87332e3f) Thanks [@peterkogo](https://github.com/peterkogo)! - Added OnReconnect types

## 0.0.58

### Patch Changes

- [#5252](https://github.com/xyflow/xyflow/pull/5252) [`2a03213b`](https://github.com/xyflow/xyflow/commit/2a03213b0695d504f831579ec9df3f9de2d3e0bd) Thanks [@moklick](https://github.com/moklick)! - Center panel correctly when bottom-center or top-center position is used

## 0.0.57

### Patch Changes

- [#5227](https://github.com/xyflow/xyflow/pull/5227) [`a7d10ffc`](https://github.com/xyflow/xyflow/commit/a7d10ffce5a0195471681980f97b1b5f6c448f35) Thanks [@moklick](https://github.com/moklick)! - add resizeDirection for XYResizer

- [#5221](https://github.com/xyflow/xyflow/pull/5221) [`4e681f9c`](https://github.com/xyflow/xyflow/commit/4e681f9c529c3f4f8b2ac5d25b4db7878c197e14) Thanks [@moklick](https://github.com/moklick)! - Allow zero as a valid node width/height value

## 0.0.56

### Patch Changes

- [#5212](https://github.com/xyflow/xyflow/pull/5212) [`0f43b8ea`](https://github.com/xyflow/xyflow/commit/0f43b8ea45bd293e50e4a86d83868074bb323f13) Thanks [@moklick](https://github.com/moklick)! - Add polyfill for `Promise.withResolvers`

- [#5192](https://github.com/xyflow/xyflow/pull/5192) [`fc241253`](https://github.com/xyflow/xyflow/commit/fc241253d5dba35f5febf411e77dbc5acb91d5d7) Thanks [@peterkogo](https://github.com/peterkogo)! - Optimize performance of nodesInitialized

- [#5153](https://github.com/xyflow/xyflow/pull/5153) [`98fe23c7`](https://github.com/xyflow/xyflow/commit/98fe23c7c2b12972f1b7def866215ce82a86e2c0) Thanks [@nick-lawrence-ctm](https://github.com/nick-lawrence-ctm)! - Add separators to horizontal control buttons

- [#5191](https://github.com/xyflow/xyflow/pull/5191) [`e5735b51`](https://github.com/xyflow/xyflow/commit/e5735b514a54d86ba0ca7bd725e8bfead89fc08e) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix legacy padding being slightly larger than before

## 0.0.55

### Patch Changes

- [#5156](https://github.com/xyflow/xyflow/pull/5156) [`02a3b746`](https://github.com/xyflow/xyflow/commit/02a3b74645799a3f0ce670b69365fa86ecb0616e) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `type GetSmoothStepPathParams` and `getSmoothStepPath` function

- [#5168](https://github.com/xyflow/xyflow/pull/5168) [`cbe305e1`](https://github.com/xyflow/xyflow/commit/cbe305e15a5c5d3b92583e0ec12364b2509f49bd) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `getOutgoers`, `getIncomers` and `type GetNodesBoundsParams`

- [#5169](https://github.com/xyflow/xyflow/pull/5169) [`1f671bd4`](https://github.com/xyflow/xyflow/commit/1f671bd48f06230da841fdd1d7a312413ef16d03) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `type ReconnectEdgeOptions` and `getViewportForBounds`

- [#5155](https://github.com/xyflow/xyflow/pull/5155) [`aaebc462`](https://github.com/xyflow/xyflow/commit/aaebc462951ded8e91374c3e084d77af5ed7380a) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `type GetStraightPathParams` and `getStraightPath` function

- [#5157](https://github.com/xyflow/xyflow/pull/5157) [`6ec942fc`](https://github.com/xyflow/xyflow/commit/6ec942fc6501f81009c278cc995764bef3e8d03b) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `type GetBezierPathParams` and `getBezierPath` function

## 0.0.54

### Patch Changes

- [#5147](https://github.com/xyflow/xyflow/pull/5147) [`f819005b`](https://github.com/xyflow/xyflow/commit/f819005be362d044b16ce4c0b85432f3f300a13a) Thanks [@moklick](https://github.com/moklick)! - Pass dimensions to final resize change event

- [#5142](https://github.com/xyflow/xyflow/pull/5142) [`24a1bc89`](https://github.com/xyflow/xyflow/commit/24a1bc89348817ed9b5c87f74bf2519c705143be) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `HandleProps`, `NodeBase` and `InternalNodeBase`

- [#5136](https://github.com/xyflow/xyflow/pull/5136) [`36657cd6`](https://github.com/xyflow/xyflow/commit/36657cd66322c911e87eb37275c584a80025adfe) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `EdgeBase`

- [#5139](https://github.com/xyflow/xyflow/pull/5139) [`89de9ca8`](https://github.com/xyflow/xyflow/commit/89de9ca83fbf9263a687a0f5f915efb2beb31654) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Use `rgba` for colors with opacity instead of `rgb` for `MiniMap` mask color

- [#5148](https://github.com/xyflow/xyflow/pull/5148) [`2ac6e155`](https://github.com/xyflow/xyflow/commit/2ac6e155e35256ca436281df16344366e7d05761) Thanks [@moklick](https://github.com/moklick)! - Prevent browser zoom for pinch zoom gestures on nowheel elements

- [#5137](https://github.com/xyflow/xyflow/pull/5137) [`f0f378e5`](https://github.com/xyflow/xyflow/commit/f0f378e5b6918c2c30d9dc1e32587063cb942d4e) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `Connection` and `ConnectionInProgress`

## 0.0.53

### Patch Changes

- [#5118](https://github.com/xyflow/xyflow/pull/5118) [`5d15b01b`](https://github.com/xyflow/xyflow/commit/5d15b01ba8cb349d6397a6ed8162848b4dfec293) Thanks [@moklick](https://github.com/moklick)! - Do not swallow key events when a button is focused

- [#5067](https://github.com/xyflow/xyflow/pull/5067) [`cb685281`](https://github.com/xyflow/xyflow/commit/cb685281d0eaf03e9833271c31f92b1d143af2fe) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix fitView not working immediately after adding new nodes

- [#5091](https://github.com/xyflow/xyflow/pull/5091) [`a79f30b3`](https://github.com/xyflow/xyflow/commit/a79f30b3dd7c8ff6400c8d22214b2c2282e5bac1) Thanks [@moklick](https://github.com/moklick)! - Add center-left and center-right as a panel position

## 0.0.52

### Patch Changes

- [#5052](https://github.com/xyflow/xyflow/pull/5052) [`99dd7d35`](https://github.com/xyflow/xyflow/commit/99dd7d3549e7423e7d103b2c956c8b37f5747b90) Thanks [@moklick](https://github.com/moklick)! - Show an error if user drags uninitialized node

## 0.0.51

### Patch Changes

- [#5010](https://github.com/xyflow/xyflow/pull/5010) [`6c121d42`](https://github.com/xyflow/xyflow/commit/6c121d427fea9a11e86a85f95d2c12ba8af34919) Thanks [@moklick](https://github.com/moklick)! - Add more TSDocs to components, hooks, utils funcs and types

- [#4990](https://github.com/xyflow/xyflow/pull/4990) [`4947029c`](https://github.com/xyflow/xyflow/commit/4947029cd6cda0f695e1fb4815e4030adb232234) Thanks [@damianstasik](https://github.com/damianstasik)! - Make it possible to stop autoPanOnDrag by setting it to false

- [#5003](https://github.com/xyflow/xyflow/pull/5003) [`e8e0d684`](https://github.com/xyflow/xyflow/commit/e8e0d684957b95d53a6cc11598c8755ff02117c7) Thanks [@dimaMachina](https://github.com/dimaMachina)! - repair lint command

## 0.0.50

### Patch Changes

- [#4957](https://github.com/xyflow/xyflow/pull/4957) [`fe843982`](https://github.com/xyflow/xyflow/commit/fe843982bfc7d7579d54772b201426b4c3f549c6) Thanks [@peterkogo](https://github.com/peterkogo)! - Narrow properties selected, selectable, deletable, draggable of NodeProps type to be required.

- [#4968](https://github.com/xyflow/xyflow/pull/4968) [`e73ef09f`](https://github.com/xyflow/xyflow/commit/e73ef09fbc8d872b46cf52c9d6a32dbb388c220b) Thanks [@peterkogo](https://github.com/peterkogo)! - Make internal nodes immutable

## 0.0.49

### Patch Changes

- [#4949](https://github.com/xyflow/xyflow/pull/4949) [`592c7eaf`](https://github.com/xyflow/xyflow/commit/592c7eaf9574fc69df3123837da95f85877b23e8) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix useNodeConnection hook not returning all connected edges.

## 0.0.48

### Patch Changes

- [#4880](https://github.com/xyflow/xyflow/pull/4880) [`e2d849dc`](https://github.com/xyflow/xyflow/commit/e2d849dca63aee5952f676aef1c675c6232bb69a) Thanks [@crimx](https://github.com/crimx)! - Add type check for all event targets

- [#4725](https://github.com/xyflow/xyflow/pull/4725) [`e10f53cf`](https://github.com/xyflow/xyflow/commit/e10f53cf898a56f954783d6efcf6977a0d88f4a9) Thanks [@peterkogo](https://github.com/peterkogo)! - Add useNodeConnections hook to track all connections to a node. Can be filtered by handleType and handleId.

- [#4929](https://github.com/xyflow/xyflow/pull/4929) [`4947f683`](https://github.com/xyflow/xyflow/commit/4947f683b7530f8e6684865ab53ea38633de0f4d) Thanks [@peterkogo](https://github.com/peterkogo)! - Optimize selections and take into account if edges connected to selected nodes are actually selectable.

## 0.0.47

### Patch Changes

- [#4874](https://github.com/xyflow/xyflow/pull/4874) [`d60331e6`](https://github.com/xyflow/xyflow/commit/d60331e6baa7931c46af219e35c1bedbd156187c) Thanks [@crimx](https://github.com/crimx)! - Refactor isInputDOMNode so that it handles non-html objects

## 0.0.46

### Patch Changes

- [#4790](https://github.com/xyflow/xyflow/pull/4790) [`2fa9a920`](https://github.com/xyflow/xyflow/commit/2fa9a92042ba11986abbababb7e8b294e208d6cb) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix node dragging & resizing while zooming on flow that does not cover whole browser window.

- [#4782](https://github.com/xyflow/xyflow/pull/4782) [`323e1b35`](https://github.com/xyflow/xyflow/commit/323e1b35c58bca80deb824bc8b136705593a5257) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix node intersections in nested flow.

## 0.0.45

### Patch Changes

- [#4772](https://github.com/xyflow/xyflow/pull/4772) [`7f670ab0`](https://github.com/xyflow/xyflow/commit/7f670ab0423b3848a50398027297f6ec11deeaa4) Thanks [@mistic](https://github.com/mistic)! - Splits exports field in package.json to support an explicit resolution for browser, node and default to resolve issues with webpack esm module resolution.

## 0.0.44

### Patch Changes

- [#4755](https://github.com/xyflow/xyflow/pull/4755) [`005ae1c0`](https://github.com/xyflow/xyflow/commit/005ae1c05f6a10c1f519cd789f4f3f2fdf293bc6) Thanks [@peterkogo](https://github.com/peterkogo)! - Add module to exports in package.json. This should resolve possible issues with Webpack ESM Module Resolution.

- [#4730](https://github.com/xyflow/xyflow/pull/4730) [`2c590b90`](https://github.com/xyflow/xyflow/commit/2c590b90787aabce42de2b4108174bdf31ad6155) Thanks [@peterkogo](https://github.com/peterkogo)! - Fixed rare crash while dragging

## 0.0.43

### Patch Changes

- [#4681](https://github.com/xyflow/xyflow/pull/4681) [`99ba64ac`](https://github.com/xyflow/xyflow/commit/99ba64ac2e1ce9c5ac3cab85a3d574edc0ecf4cc) Thanks [@moklick](https://github.com/moklick)! - Fix an issue that appeared when user deleted node while dragging.

- [#4670](https://github.com/xyflow/xyflow/pull/4670) [`b056564c`](https://github.com/xyflow/xyflow/commit/b056564c9658bb43b882eebfad5a7e224717ffb5) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix initial `fitView` not working correctly for `nodeOrigin` other than [0,0]

## 0.0.42

### Patch Changes

- [#4477](https://github.com/xyflow/xyflow/pull/4477) [`d5592e75`](https://github.com/xyflow/xyflow/commit/d5592e7508bc32d5ffc953844b1d42b9ec59b25b) Thanks [@peterkogo](https://github.com/peterkogo)! - Add `getNodesBounds` to `useReactFlow`/`useSvelteFlow` hook as the new recommended way of determining node bounds.

- [#4572](https://github.com/xyflow/xyflow/pull/4572) [`d9563505`](https://github.com/xyflow/xyflow/commit/d9563505d8fb01862a3a6bae6e05dcea626c2e26) Thanks [@peterkogo](https://github.com/peterkogo)! - Improve handling of global and individual `nodeExtent`s. Nodes will never render outside of specified extents.

## 0.0.41

### Patch Changes

- [#4611](https://github.com/xyflow/xyflow/pull/4611) [`2aaa709c`](https://github.com/xyflow/xyflow/commit/2aaa709c0014b91ab75a4e40753b71cc7bb04a2c) Thanks [@moklick](https://github.com/moklick)! - make onViewportChange a dynamic prop

## 0.0.40

### Patch Changes

- [#4594](https://github.com/xyflow/xyflow/pull/4594) [`5138d90b`](https://github.com/xyflow/xyflow/commit/5138d90bdb91ff5d8dbeb8c8d29bdfd31c5b59d6) Thanks [@peterkogo](https://github.com/peterkogo)! - Fixed reconnecting edges with loose connectionMode

- [#4603](https://github.com/xyflow/xyflow/pull/4603) [`12dbe125`](https://github.com/xyflow/xyflow/commit/12dbe125755fad7d2f6dff19100872dd823d1012) Thanks [@moklick](https://github.com/moklick)! - use correct index when using setNodes for inserting

## 0.0.39

### Patch Changes

- [#4568](https://github.com/xyflow/xyflow/pull/4568) [`c3e62782`](https://github.com/xyflow/xyflow/commit/c3e6278222dc13333f75ecdbe634201ddabab87a) Thanks [@peterkogo](https://github.com/peterkogo)! - Only display grab cursor when panOnDrag is on left mouse button

## 0.0.38

### Patch Changes

- [#4544](https://github.com/xyflow/xyflow/pull/4544) [`b63a3734`](https://github.com/xyflow/xyflow/commit/b63a3734b84b6817603c8e6e48e2836f048acc3b) Thanks [@moklick](https://github.com/moklick)! - strengthen css selector for edges for overflow visible

- [#4555](https://github.com/xyflow/xyflow/pull/4555) [`24e87e39`](https://github.com/xyflow/xyflow/commit/24e87e398419646f671af1085fbfec3e197bc56b) Thanks [@peterkogo](https://github.com/peterkogo)! - Added final connection state as a function parameter to onReconnectEnd

- [#4548](https://github.com/xyflow/xyflow/pull/4548) [`692e6440`](https://github.com/xyflow/xyflow/commit/692e6440b10e75cb31f3f3172aede9ed4d7f05d2) Thanks [@peterkogo](https://github.com/peterkogo)! - Replaced algorithm used for searching close handles while connecting

- [#4519](https://github.com/xyflow/xyflow/pull/4519) [`559d4926`](https://github.com/xyflow/xyflow/commit/559d49264b940f93c5e205bf984aa76230b10806) Thanks [@peterkogo](https://github.com/peterkogo)! - fix(connection) snapped position not updated correctly

- [#4538](https://github.com/xyflow/xyflow/pull/4538) [`4ecfd7e1`](https://github.com/xyflow/xyflow/commit/4ecfd7e19720b70024d0b5dff27d4537dd46b49a) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Use the handle id of the matching handle type when warning about an edge that can't be created due to missing handle ids.

- [#4536](https://github.com/xyflow/xyflow/pull/4536) [`e7ef328f`](https://github.com/xyflow/xyflow/commit/e7ef328f8f9286a817b19457d38c491e6c0bcffd) Thanks [@peterkogo](https://github.com/peterkogo)! - fix(onlyRenderVisible) edges to offscreen nodes with fixed width & height displayed correctly

- [#4549](https://github.com/xyflow/xyflow/pull/4549) [`99733c01`](https://github.com/xyflow/xyflow/commit/99733c01bc70f9463e7dba0046c5f8d839a1d2ba) Thanks [@moklick](https://github.com/moklick)! - feat(onConnectEnd): pass connectionState param

## 0.0.37

### Patch Changes

- [#4465](https://github.com/xyflow/xyflow/pull/4465) [`543c0939`](https://github.com/xyflow/xyflow/commit/543c09392d53fdd56a8876e65f4ce2d8ab250098) Thanks [@moklick](https://github.com/moklick)! - fix(nodes): re-measure when measured is not set

- [#4464](https://github.com/xyflow/xyflow/pull/4464) [`89cd677b`](https://github.com/xyflow/xyflow/commit/89cd677b5668b78434e02e7b025c6ac58db91e58) Thanks [@moklick](https://github.com/moklick)! - fix(handles): reconnect for connectionMode=loose

- [#4467](https://github.com/xyflow/xyflow/pull/4467) [`c253c7c5`](https://github.com/xyflow/xyflow/commit/c253c7c59a2ccd2cb91ad44ce4acbe481d9d7fe1) Thanks [@moklick](https://github.com/moklick)! - chore(subflows): log warning instead of throwing an error when parent node cant be found

## 0.0.36

### Patch Changes

- [#4446](https://github.com/xyflow/xyflow/pull/4446) [`80baf53b`](https://github.com/xyflow/xyflow/commit/80baf53bdc7d4fb0715e5eed85efdea77191935a) Thanks [@moklick](https://github.com/moklick)! - fix(resizer): export types

- [#4451](https://github.com/xyflow/xyflow/pull/4451) [`4cccd06a`](https://github.com/xyflow/xyflow/commit/4cccd06a671e9ef1c6f16ab0d788081f8d894d0e) Thanks [@moklick](https://github.com/moklick)! - add nodeClickDistance

## 0.0.35

### Patch Changes

- [#4432](https://github.com/xyflow/xyflow/pull/4432) [`d2da5765`](https://github.com/xyflow/xyflow/commit/d2da576591305873f8d6514091ee8db1ad4f79e2) Thanks [@moklick](https://github.com/moklick)! - refactor(ConnectionState): use internal node, add node generic
