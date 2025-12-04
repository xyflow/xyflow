# @xyflow/react

## 12.10.0

### Minor Changes

- [#5637](https://github.com/xyflow/xyflow/pull/5637) [`0c7261a6d`](https://github.com/xyflow/xyflow/commit/0c7261a6dc94f1aa58333a6aebcaca8ced9b5ad2) Thanks [@moklick](https://github.com/moklick)! - Add `zIndexMode` to control how z-index is calculated for nodes and edges

- [#5484](https://github.com/xyflow/xyflow/pull/5484) [`a523919d6`](https://github.com/xyflow/xyflow/commit/a523919d6789995e9d0f3dd29b0b47fc3b8d8439) Thanks [@peterkogo](https://github.com/peterkogo)! - Add `experimental_useOnNodesChangeMiddleware` hook

### Patch Changes

- [#5629](https://github.com/xyflow/xyflow/pull/5629) [`9030fab2d`](https://github.com/xyflow/xyflow/commit/9030fab2df8285fdfb649bda6e1e885dfd228d45) Thanks [@AlaricBaraou](https://github.com/AlaricBaraou)! - Prevent unnecessary re-render in `FlowRenderer`

- [#5592](https://github.com/xyflow/xyflow/pull/5592) [`38dbf41c4`](https://github.com/xyflow/xyflow/commit/38dbf41c464550cc803b946a4ad1f46982385a03) Thanks [@svilen-ivanov-kubit](https://github.com/svilen-ivanov-kubit)! - Always create a new measured object in apply changes.

- [#5635](https://github.com/xyflow/xyflow/pull/5635) [`2d7fa40e2`](https://github.com/xyflow/xyflow/commit/2d7fa40e2684a0fcdd4eca7800ccf2c34338e549) Thanks [@tornado-softwares](https://github.com/tornado-softwares)! - Update an ongoing connection when user moves node with keyboard.

- Updated dependencies [[`0c7261a6d`](https://github.com/xyflow/xyflow/commit/0c7261a6dc94f1aa58333a6aebcaca8ced9b5ad2), [`8598b6bc2`](https://github.com/xyflow/xyflow/commit/8598b6bc2a9d052b12d5215706382da0aa84827b), [`2d7fa40e2`](https://github.com/xyflow/xyflow/commit/2d7fa40e2684a0fcdd4eca7800ccf2c34338e549)]:
  - @xyflow/system@0.0.74

## 12.9.3

### Patch Changes

- [#5621](https://github.com/xyflow/xyflow/pull/5621) [`c1304dba7`](https://github.com/xyflow/xyflow/commit/c1304dba7a20bb8d74c7aceb23cd80b56e4c0482) Thanks [@moklick](https://github.com/moklick)! - Set `paneClickDistance` default value to `1`.

- [#5578](https://github.com/xyflow/xyflow/pull/5578) [`00bcb9f5f`](https://github.com/xyflow/xyflow/commit/00bcb9f5f45f49814b9ac19b3f55cfe069ee3773) Thanks [@peterkogo](https://github.com/peterkogo)! - Pass current pointer position to connection

- Updated dependencies [[`00bcb9f5f`](https://github.com/xyflow/xyflow/commit/00bcb9f5f45f49814b9ac19b3f55cfe069ee3773)]:
  - @xyflow/system@0.0.73

## 12.9.2

### Patch Changes

- [#5593](https://github.com/xyflow/xyflow/pull/5593) [`a8ee089d7`](https://github.com/xyflow/xyflow/commit/a8ee089d7689d9a58113690c8e90e1c1e109602a) Thanks [@moklick](https://github.com/moklick)! - Reset selection box when user selects a node

## 12.9.1

### Patch Changes

- [#5572](https://github.com/xyflow/xyflow/pull/5572) [`5ec0cac7f`](https://github.com/xyflow/xyflow/commit/5ec0cac7fad21109b74839969c0818f88ddc87d9) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix onPaneClick events being suppressed when selectionOnDrag=true

- Updated dependencies [[`5ec0cac7f`](https://github.com/xyflow/xyflow/commit/5ec0cac7fad21109b74839969c0818f88ddc87d9)]:
  - @xyflow/system@0.0.72

## 12.9.0

### Minor Changes

- [#5544](https://github.com/xyflow/xyflow/pull/5544) [`c17b49f4c`](https://github.com/xyflow/xyflow/commit/c17b49f4c16167da3f791430163edd592159d27d) Thanks [@0x0f0f0f](https://github.com/0x0f0f0f)! - Add `EdgeToolbar` component

- [#5550](https://github.com/xyflow/xyflow/pull/5550) [`6ffb9f790`](https://github.com/xyflow/xyflow/commit/6ffb9f7901c32f5b335aee2517f41bf87f274f32) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent child nodes of different parents from overlapping

- [#5551](https://github.com/xyflow/xyflow/pull/5551) [`6bb64b3ed`](https://github.com/xyflow/xyflow/commit/6bb64b3ed60f26c9ea8bc01c8d62fb9bf74cd634) Thanks [@moklick](https://github.com/moklick)! - Allow to start a selection above a node

### Patch Changes

- [#5531](https://github.com/xyflow/xyflow/pull/5531) [`fe2a45ed2`](https://github.com/xyflow/xyflow/commit/fe2a45ed2aa0d96db8e1be0354038be7ce6f824d) Thanks [@Sec-ant](https://github.com/Sec-ant)! - Add `type` property to `EdgeProps` to match `NodeProps` behavior

- [#5528](https://github.com/xyflow/xyflow/pull/5528) [`d50a963cd`](https://github.com/xyflow/xyflow/commit/d50a963cd0f00cd31236d760dcd7995218d80553) Thanks [@peterkogo](https://github.com/peterkogo)! - Let `NodeResizer` props change during ongoing resize

- [#5530](https://github.com/xyflow/xyflow/pull/5530) [`3b9951e42`](https://github.com/xyflow/xyflow/commit/3b9951e42f2041276ac8957154598a7af41f81e9) Thanks [@peterkogo](https://github.com/peterkogo)! - Improve performance of adding nodes & edges

- [#5547](https://github.com/xyflow/xyflow/pull/5547) [`1c8961207`](https://github.com/xyflow/xyflow/commit/1c8961207e8ac326098af18489465b36cdd2d831) Thanks [@moklick](https://github.com/moklick)! - Always call `onMoveEnd` when `onMoveStart` was called

- Updated dependencies [[`c17b49f4c`](https://github.com/xyflow/xyflow/commit/c17b49f4c16167da3f791430163edd592159d27d), [`6ffb9f790`](https://github.com/xyflow/xyflow/commit/6ffb9f7901c32f5b335aee2517f41bf87f274f32), [`d50a963cd`](https://github.com/xyflow/xyflow/commit/d50a963cd0f00cd31236d760dcd7995218d80553), [`6bb64b3ed`](https://github.com/xyflow/xyflow/commit/6bb64b3ed60f26c9ea8bc01c8d62fb9bf74cd634), [`8a9ee2d83`](https://github.com/xyflow/xyflow/commit/8a9ee2d836776da42b867c6ba90d302fbbc79b37), [`1c8961207`](https://github.com/xyflow/xyflow/commit/1c8961207e8ac326098af18489465b36cdd2d831)]:
  - @xyflow/system@0.0.71

## 12.8.6

### Patch Changes

- [#5515](https://github.com/xyflow/xyflow/pull/5515) [`9b4e99029`](https://github.com/xyflow/xyflow/commit/9b4e99029ba87d44c71b33c06259a126db193b43) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix id of static handles not being parsed

- [#5512](https://github.com/xyflow/xyflow/pull/5512) [`70b672604`](https://github.com/xyflow/xyflow/commit/70b67260470738dd0d88ed8ab558d400097be785) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent native page zoom when pinch zooming on node with nowheel class

- Updated dependencies [[`9b4e99029`](https://github.com/xyflow/xyflow/commit/9b4e99029ba87d44c71b33c06259a126db193b43), [`70b672604`](https://github.com/xyflow/xyflow/commit/70b67260470738dd0d88ed8ab558d400097be785)]:
  - @xyflow/system@0.0.70

## 12.8.5

### Patch Changes

- [#5480](https://github.com/xyflow/xyflow/pull/5480) [`f869808e3`](https://github.com/xyflow/xyflow/commit/f869808e3dfd3d289db034d21d505d62f84cdde3) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent multi-touch events while making a new connection

- [#5482](https://github.com/xyflow/xyflow/pull/5482) [`56381ae54`](https://github.com/xyflow/xyflow/commit/56381ae546f392b13e7c1390df60e48c9072f128) Thanks [@peterkogo](https://github.com/peterkogo)! - Make isNodeIntersecting behave the same as getIntersectingNodes

- [#5509](https://github.com/xyflow/xyflow/pull/5509) [`b6ae4cc11`](https://github.com/xyflow/xyflow/commit/b6ae4cc11f1456f843ace7e7f3de41c9196179e0) Thanks [@moklick](https://github.com/moklick)! - Prevent calling onResizeEnd if node was not resized

- [#5511](https://github.com/xyflow/xyflow/pull/5511) [`d891e5ff1`](https://github.com/xyflow/xyflow/commit/d891e5ff106c6202f69a9b14d261294cc29bbec7) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix regression: elevate edges if connected nodes are selected

- [#5497](https://github.com/xyflow/xyflow/pull/5497) [`eba087e8b`](https://github.com/xyflow/xyflow/commit/eba087e8bec74e6591e04ebf0e1e61799b94ecd8) Thanks [@peterkogo](https://github.com/peterkogo)! - Skip eagerly rendering nodes when node dimensions and handles are predefined

- [#5455](https://github.com/xyflow/xyflow/pull/5455) [`d2df1dced`](https://github.com/xyflow/xyflow/commit/d2df1dced7a7de4ed69b003c0069c7d7141bef05) Thanks [@Sec-ant](https://github.com/Sec-ant)! - Fix warning when display is set to none on the wrapper div

- Updated dependencies [[`f869808e3`](https://github.com/xyflow/xyflow/commit/f869808e3dfd3d289db034d21d505d62f84cdde3), [`2a35c65a0`](https://github.com/xyflow/xyflow/commit/2a35c65a02c6c8aec6b005ac3e72988f996669c4), [`b6ae4cc11`](https://github.com/xyflow/xyflow/commit/b6ae4cc11f1456f843ace7e7f3de41c9196179e0), [`d891e5ff1`](https://github.com/xyflow/xyflow/commit/d891e5ff106c6202f69a9b14d261294cc29bbec7), [`eba087e8b`](https://github.com/xyflow/xyflow/commit/eba087e8bec74e6591e04ebf0e1e61799b94ecd8)]:
  - @xyflow/system@0.0.69

## 12.8.4

### Patch Changes

- [#5472](https://github.com/xyflow/xyflow/pull/5472) [`372c493a`](https://github.com/xyflow/xyflow/commit/372c493a2f2008fd9eca7b00cece642d4335ed60) Thanks [@moklick](https://github.com/moklick)! - Remove dangerouslySetInnerHTML from domAttributes

- [#5459](https://github.com/xyflow/xyflow/pull/5459) [`2e7c89c6`](https://github.com/xyflow/xyflow/commit/2e7c89c6c3379030391b842263b06ef36f7e8945) Thanks [@0x0f0f0f](https://github.com/0x0f0f0f)! - Fix open arrow marker using fill color from edge instead of none

- Updated dependencies [[`5ece6b36`](https://github.com/xyflow/xyflow/commit/5ece6b36da44d0dbbf6daf132eb9280e3c294bd2), [`53da1193`](https://github.com/xyflow/xyflow/commit/53da119313f2ad9f1f6512a5ed1f6048bb4b0bec)]:
  - @xyflow/system@0.0.68

## 12.8.3

### Patch Changes

- [#5420](https://github.com/xyflow/xyflow/pull/5420) [`c453ee3f`](https://github.com/xyflow/xyflow/commit/c453ee3f74512bf92f33a7afa3f7104aa82172f6) Thanks [@ShlomoGalle](https://github.com/ShlomoGalle)! - Omit `defaultValue` from `Node`'s `domAttributes` to fix type incompatibility when using `WritableDraft`

- [#5436](https://github.com/xyflow/xyflow/pull/5436) [`def02b96`](https://github.com/xyflow/xyflow/commit/def02b960931c2d05a3419768e20d86f4c1bb0f9) Thanks [@moklick](https://github.com/moklick)! - Prevent a 0 added to the markup for edges when interactionWidth is 0

- [#5444](https://github.com/xyflow/xyflow/pull/5444) [`9aca4839`](https://github.com/xyflow/xyflow/commit/9aca483928d0e24bb598c344806ca1fca840794b) Thanks [@paula-stacho](https://github.com/paula-stacho)! - Export MiniMapNode

- [#5443](https://github.com/xyflow/xyflow/pull/5443) [`144f8feb`](https://github.com/xyflow/xyflow/commit/144f8feb0f4a74b63e44eb9edf5beed4dd8a9230) Thanks [@moklick](https://github.com/moklick)! - Use 1 as the default for interactive Minimap zoom step

- [#5428](https://github.com/xyflow/xyflow/pull/5428) [`f18e9856`](https://github.com/xyflow/xyflow/commit/f18e98569b1cc38b6ec2b7d7a3d1fd8b56a5d42f) Thanks [@Karl255](https://github.com/Karl255)! - Fix clicking on detached handle elements not initiating drawing of connections

- [#5453](https://github.com/xyflow/xyflow/pull/5453) [`7a088817`](https://github.com/xyflow/xyflow/commit/7a088817f71acb71c49e5bf4ac90352dab95f7b8) Thanks [@moklick](https://github.com/moklick)! - Snap selection instead of separate nodes when snap grid is enabled

- [#5415](https://github.com/xyflow/xyflow/pull/5415) [`6838df9d`](https://github.com/xyflow/xyflow/commit/6838df9d67a1f093464e911e949f1360a005832d) Thanks [@moklick](https://github.com/moklick)! - Allow strings and enums for existing marker types

- [#5444](https://github.com/xyflow/xyflow/pull/5444) [`9192fd7d`](https://github.com/xyflow/xyflow/commit/9192fd7d2c8a86c8720d1191bc488f01681dcef2) Thanks [@paula-stacho](https://github.com/paula-stacho)! - Export MiniMapNode

- [#5448](https://github.com/xyflow/xyflow/pull/5448) [`f5fe1d71`](https://github.com/xyflow/xyflow/commit/f5fe1d71e04ded54a96250fa9c0ba7f8ce87fa66) Thanks [@moklick](https://github.com/moklick)! - Use correct HandleConnection type for Handle onConnect

- [#5419](https://github.com/xyflow/xyflow/pull/5419) [`daa33fb3`](https://github.com/xyflow/xyflow/commit/daa33fb3bd40427e8f26117da4dbcd2de726cfde) Thanks [@0x0f0f0f](https://github.com/0x0f0f0f)! - Make arrow heads markers fallback to --xy-edge-stroke CSS variable when passing null as marker color

- Updated dependencies [[`144f8feb`](https://github.com/xyflow/xyflow/commit/144f8feb0f4a74b63e44eb9edf5beed4dd8a9230), [`f18e9856`](https://github.com/xyflow/xyflow/commit/f18e98569b1cc38b6ec2b7d7a3d1fd8b56a5d42f), [`7a088817`](https://github.com/xyflow/xyflow/commit/7a088817f71acb71c49e5bf4ac90352dab95f7b8), [`6838df9d`](https://github.com/xyflow/xyflow/commit/6838df9d67a1f093464e911e949f1360a005832d), [`fddbb7de`](https://github.com/xyflow/xyflow/commit/fddbb7de47b180767a0d6286ec58b5598c0cf6df), [`f5fe1d71`](https://github.com/xyflow/xyflow/commit/f5fe1d71e04ded54a96250fa9c0ba7f8ce87fa66), [`daa33fb3`](https://github.com/xyflow/xyflow/commit/daa33fb3bd40427e8f26117da4dbcd2de726cfde)]:
  - @xyflow/system@0.0.67

## 12.8.2

### Patch Changes

- [#5384](https://github.com/xyflow/xyflow/pull/5384) [`18514e11`](https://github.com/xyflow/xyflow/commit/18514e118fc9a43e2bc80e55639db8beb1d9707a) Thanks [@Sec-ant](https://github.com/Sec-ant)! - Fix node fallback to respect custom default node type when unknown node type is encountered

- [#5394](https://github.com/xyflow/xyflow/pull/5394) [`21db22d4`](https://github.com/xyflow/xyflow/commit/21db22d46a253dc4fd17d65dab201aca53a4a6f4) Thanks [@moklick](https://github.com/moklick)! - Return intersections correctly of passed node is bigger than intersecting nodes

- [#5384](https://github.com/xyflow/xyflow/pull/5384) [`ab05d008`](https://github.com/xyflow/xyflow/commit/ab05d008d949c98124578e99e6a6e4c86a16f629) Thanks [@Sec-ant](https://github.com/Sec-ant)! - Fix edge fallback to respect custom default edge type when unknown edge type is encountered.

- [#5376](https://github.com/xyflow/xyflow/pull/5376) [`f0ce2c87`](https://github.com/xyflow/xyflow/commit/f0ce2c876d8688e13632bc86286cf857f86dead6) Thanks [@kennyjwilli](https://github.com/kennyjwilli)! - Add stepPosition param to step edge

- Updated dependencies [[`864d4188`](https://github.com/xyflow/xyflow/commit/864d4188089b3e7f45b18f8a63e02758ee183f7f), [`f0ce2c87`](https://github.com/xyflow/xyflow/commit/f0ce2c876d8688e13632bc86286cf857f86dead6)]:
  - @xyflow/system@0.0.66

## 12.8.1

### Patch Changes

- Updated dependencies [[`26f2cdd7`](https://github.com/xyflow/xyflow/commit/26f2cdd720fc2c8fb337d3af13b82dab6a90fb60)]:
  - @xyflow/system@0.0.65

## 12.8.0

### Minor Changes

- [#5361](https://github.com/xyflow/xyflow/pull/5361) [`90e9247a`](https://github.com/xyflow/xyflow/commit/90e9247adbdfa9d06db97e1d0d895e35c960551c) Thanks [@peterkogo](https://github.com/peterkogo)! - Render edges above nodes when they are within a subflow

- [#5344](https://github.com/xyflow/xyflow/pull/5344) [`2441bf8d`](https://github.com/xyflow/xyflow/commit/2441bf8d97a6b72494f216915d52d5acbeefefde) Thanks [@moklick](https://github.com/moklick)! - Add connectionDragThreshold prop

### Patch Changes

- [#5368](https://github.com/xyflow/xyflow/pull/5368) [`445017ed`](https://github.com/xyflow/xyflow/commit/445017ed6fdedee4b39a0eaeb1cbbe0155f9a037) Thanks [@moklick](https://github.com/moklick)! - Cleanup store updater

- [#5362](https://github.com/xyflow/xyflow/pull/5362) [`72dc1d60`](https://github.com/xyflow/xyflow/commit/72dc1d602110947e3db83c37b9a9125ee85cf4bc) Thanks [@moklick](https://github.com/moklick)! - Remove pointer events from Panel via CSS while a selection gets dragged

- Updated dependencies [[`72dc1d60`](https://github.com/xyflow/xyflow/commit/72dc1d602110947e3db83c37b9a9125ee85cf4bc), [`90e9247a`](https://github.com/xyflow/xyflow/commit/90e9247adbdfa9d06db97e1d0d895e35c960551c), [`2441bf8d`](https://github.com/xyflow/xyflow/commit/2441bf8d97a6b72494f216915d52d5acbeefefde)]:
  - @xyflow/system@0.0.64

## 12.7.1

### Patch Changes

- [#5354](https://github.com/xyflow/xyflow/pull/5354) [`c4312d89`](https://github.com/xyflow/xyflow/commit/c4312d8997ecdc7ef12cfa4efc1fde7131a2b950) Thanks [@moklick](https://github.com/moklick)! - Add TSDoc annotations

- [#5333](https://github.com/xyflow/xyflow/pull/5333) [`3d7e8b6b`](https://github.com/xyflow/xyflow/commit/3d7e8b6bb10001ee84d79ca4f6a9fd0053c4a276) Thanks [@peterkogo](https://github.com/peterkogo)! - Add missing type exports

- [#5353](https://github.com/xyflow/xyflow/pull/5353) [`4dd3ae66`](https://github.com/xyflow/xyflow/commit/4dd3ae6684fa3c62ee8cabd64e7631a52173c8f4) Thanks [@aidanbarrett](https://github.com/aidanbarrett)! - Add missing `FinalConnectionState` parameter to `onReconnectEnd` prop types

- Updated dependencies [[`c4312d89`](https://github.com/xyflow/xyflow/commit/c4312d8997ecdc7ef12cfa4efc1fde7131a2b950), [`3d7e8b6b`](https://github.com/xyflow/xyflow/commit/3d7e8b6bb10001ee84d79ca4f6a9fd0053c4a276), [`9c61000c`](https://github.com/xyflow/xyflow/commit/9c61000cac6277ce97274cc626fa7266f82dec27)]:
  - @xyflow/system@0.0.63

## 12.7.0

### Minor Changes

- [#5299](https://github.com/xyflow/xyflow/pull/5299) [`848b486b`](https://github.com/xyflow/xyflow/commit/848b486b2201b650ecb3317f367a723edb2458e1) Thanks [@printerscanner](https://github.com/printerscanner)! - Add `ariaRole` prop to nodes and edges

- [#5280](https://github.com/xyflow/xyflow/pull/5280) [`dba6faf2`](https://github.com/xyflow/xyflow/commit/dba6faf20e7ec2524d5270d177331d3bd260f3ac) Thanks [@moklick](https://github.com/moklick)! - Improve typing for Nodes

- [#5276](https://github.com/xyflow/xyflow/pull/5276) [`6ce44a05`](https://github.com/xyflow/xyflow/commit/6ce44a05c829068ff5a8416ce3fa4ee6e0eced48) Thanks [@moklick](https://github.com/moklick)! - Add an `ease` and `interpolate` option to all function that alter the viewport

- [#5277](https://github.com/xyflow/xyflow/pull/5277) [`f59730ce`](https://github.com/xyflow/xyflow/commit/f59730ce3530a91f579f6bbd2ea9335680f552ef) Thanks [@printerscanner](https://github.com/printerscanner)! - Add `ariaLabelConfig` prop for customizing UI text like aria labels and descriptions.

- [#5317](https://github.com/xyflow/xyflow/pull/5317) [`09458f52`](https://github.com/xyflow/xyflow/commit/09458f52ff57356e03404c58e9bfdbfd50579850) Thanks [@moklick](https://github.com/moklick)! - Add `domAttributes` option for nodes and edges

- [#5326](https://github.com/xyflow/xyflow/pull/5326) [`050b511c`](https://github.com/xyflow/xyflow/commit/050b511cd6966ba526299f7ca11f9ca4791fd2cf) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent NodeResizer controls to become too small when zooming out

- [#5308](https://github.com/xyflow/xyflow/pull/5308) [`09fab679`](https://github.com/xyflow/xyflow/commit/09fab6794031410c9e9465281d038c3520afe783) Thanks [@printerscanner](https://github.com/printerscanner)! - Focus nodes on tab if not within the viewport and add a new prop `autoPanOnNodeFocus`

### Patch Changes

- Updated dependencies [[`848b486b`](https://github.com/xyflow/xyflow/commit/848b486b2201b650ecb3317f367a723edb2458e1), [`dba6faf2`](https://github.com/xyflow/xyflow/commit/dba6faf20e7ec2524d5270d177331d3bd260f3ac), [`6ce44a05`](https://github.com/xyflow/xyflow/commit/6ce44a05c829068ff5a8416ce3fa4ee6e0eced48), [`f59730ce`](https://github.com/xyflow/xyflow/commit/f59730ce3530a91f579f6bbd2ea9335680f552ef), [`09458f52`](https://github.com/xyflow/xyflow/commit/09458f52ff57356e03404c58e9bfdbfd50579850), [`050b511c`](https://github.com/xyflow/xyflow/commit/050b511cd6966ba526299f7ca11f9ca4791fd2cf)]:
  - @xyflow/system@0.0.62

## 12.6.4

### Patch Changes

- [#5263](https://github.com/xyflow/xyflow/pull/5263) [`e4a8d4b4`](https://github.com/xyflow/xyflow/commit/e4a8d4b43fdd3a9f493db758bdf02e1a10c6e640) Thanks [@moklick](https://github.com/moklick)! - Multi select key works when input is focused

- [#5266](https://github.com/xyflow/xyflow/pull/5266) [`77107453`](https://github.com/xyflow/xyflow/commit/77107453fa6f34cb08ef91640b8b02d58e31275e) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix connection snapping for handles larger than connectionRadius

- Updated dependencies [[`77107453`](https://github.com/xyflow/xyflow/commit/77107453fa6f34cb08ef91640b8b02d58e31275e)]:
  - @xyflow/system@0.0.61

## 12.6.3

### Patch Changes

- [#5259](https://github.com/xyflow/xyflow/pull/5259) [`77bf79c4`](https://github.com/xyflow/xyflow/commit/77bf79c40e71e3da449ace3b1a1ed5bceff46b51) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix background-color css variable fallback.

- Updated dependencies [[`77bf79c4`](https://github.com/xyflow/xyflow/commit/77bf79c40e71e3da449ace3b1a1ed5bceff46b51)]:
  - @xyflow/system@0.0.60

## 12.6.2

### Patch Changes

- [#5257](https://github.com/xyflow/xyflow/pull/5257) [`b1314be0`](https://github.com/xyflow/xyflow/commit/b1314be04dee07e7589a8c99c9c953006788a152) Thanks [@moklick](https://github.com/moklick)! - Use OnReconnect from system

- Updated dependencies [[`a95f0e2f`](https://github.com/xyflow/xyflow/commit/a95f0e2fbfc2d070d9bd70b753d1606a87332e3f)]:
  - @xyflow/system@0.0.59

## 12.6.1

### Patch Changes

- [#5249](https://github.com/xyflow/xyflow/pull/5249) [`895b5d81`](https://github.com/xyflow/xyflow/commit/895b5d81c8ee5236009820ecd0ed6806c6e59e29) Thanks [@moklick](https://github.com/moklick)! - Call `onNodesChange` for uncontrolled flows that use `updateNode`

- [#5247](https://github.com/xyflow/xyflow/pull/5247) [`67e1cb68`](https://github.com/xyflow/xyflow/commit/67e1cb6891078dbcb9e1d06b9f9fdbfc79860ab6) Thanks [@moklick](https://github.com/moklick)! - Cleanup TSDoc annotations for ReactFlow

- Updated dependencies [[`2a03213b`](https://github.com/xyflow/xyflow/commit/2a03213b0695d504f831579ec9df3f9de2d3e0bd)]:
  - @xyflow/system@0.0.58

## 12.6.0

### Minor Changes

- [#5219](https://github.com/xyflow/xyflow/pull/5219) [`4236adbc`](https://github.com/xyflow/xyflow/commit/4236adbc462b3f65ee41869ef426491ed3fa8ba0) Thanks [@moklick](https://github.com/moklick)! - Add initialMinZoom, initialMaxZoom and initialFitViewOptions to ReactFlowProvider

- [#5227](https://github.com/xyflow/xyflow/pull/5227) [`a7d10ffc`](https://github.com/xyflow/xyflow/commit/a7d10ffce5a0195471681980f97b1b5f6c448f35) Thanks [@moklick](https://github.com/moklick)! - Add `resizeDirection` prop for the `NodeResizeControl` component

### Patch Changes

- [#5217](https://github.com/xyflow/xyflow/pull/5217) [`bce74e88`](https://github.com/xyflow/xyflow/commit/bce74e8811a98c967b5bd06c3e5aecde24c8b679) Thanks [@moklick](https://github.com/moklick)! - Keep node seleciton on pane click if elementsSelectable=false

- Updated dependencies [[`a7d10ffc`](https://github.com/xyflow/xyflow/commit/a7d10ffce5a0195471681980f97b1b5f6c448f35), [`4e681f9c`](https://github.com/xyflow/xyflow/commit/4e681f9c529c3f4f8b2ac5d25b4db7878c197e14)]:
  - @xyflow/system@0.0.57

## 12.5.6

### Patch Changes

- [#5212](https://github.com/xyflow/xyflow/pull/5212) [`0f43b8ea`](https://github.com/xyflow/xyflow/commit/0f43b8ea45bd293e50e4a86d83868074bb323f13) Thanks [@moklick](https://github.com/moklick)! - Add polyfill for `Promise.withResolvers`

- [#5192](https://github.com/xyflow/xyflow/pull/5192) [`fc241253`](https://github.com/xyflow/xyflow/commit/fc241253d5dba35f5febf411e77dbc5acb91d5d7) Thanks [@peterkogo](https://github.com/peterkogo)! - Optimize performance of nodesInitialized

- [#5196](https://github.com/xyflow/xyflow/pull/5196) [`7f902db4`](https://github.com/xyflow/xyflow/commit/7f902db46b6f1ea4adc94390db8d5db47f8c5903) Thanks [@moklick](https://github.com/moklick)! - Hide edge marker and attribution for screenreaders

- [#5213](https://github.com/xyflow/xyflow/pull/5213) [`78782c16`](https://github.com/xyflow/xyflow/commit/78782c1696323ee9be0d38bbd807bd3fde5f549d) Thanks [@moklick](https://github.com/moklick)! - Do not trigger selection events if elementsSelectable=false

- [#5191](https://github.com/xyflow/xyflow/pull/5191) [`e5735b51`](https://github.com/xyflow/xyflow/commit/e5735b514a54d86ba0ca7bd725e8bfead89fc08e) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix legacy padding being slightly larger than before

- Updated dependencies [[`0f43b8ea`](https://github.com/xyflow/xyflow/commit/0f43b8ea45bd293e50e4a86d83868074bb323f13), [`fc241253`](https://github.com/xyflow/xyflow/commit/fc241253d5dba35f5febf411e77dbc5acb91d5d7), [`98fe23c7`](https://github.com/xyflow/xyflow/commit/98fe23c7c2b12972f1b7def866215ce82a86e2c0), [`e5735b51`](https://github.com/xyflow/xyflow/commit/e5735b514a54d86ba0ca7bd725e8bfead89fc08e)]:
  - @xyflow/system@0.0.56

## 12.5.5

### Patch Changes

- [#5172](https://github.com/xyflow/xyflow/pull/5172) [`e6139a00`](https://github.com/xyflow/xyflow/commit/e6139a00d4414ba2c1d3e500cdfa67d7e66e655a) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `useNodesData`, `useReactFlow`, `isNode` and `isEdge`

- [#5165](https://github.com/xyflow/xyflow/pull/5165) [`d536abea`](https://github.com/xyflow/xyflow/commit/d536abea9240bad7f5c1064efc0a4713ebef87d1) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `useViewport`, `useUpdateNodeInternals`, `useOnSelectionChange`, `useNodesInitialized` hooks and `UseOnSelectionChangeOptions`, `UseNodesInitializedOptions` types

- [#5171](https://github.com/xyflow/xyflow/pull/5171) [`62d87409`](https://github.com/xyflow/xyflow/commit/62d874097337a022bebe54b559834c0d582f435e) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `ReactFlowProps`

- [#5154](https://github.com/xyflow/xyflow/pull/5154) [`d0237166`](https://github.com/xyflow/xyflow/commit/d02371662669aab91cd2ac7c45b412491c3377bd) Thanks [@ibagov](https://github.com/ibagov)! - Improve TSDoc comments for `onNodesChange`

- [#5174](https://github.com/xyflow/xyflow/pull/5174) [`ae585d13`](https://github.com/xyflow/xyflow/commit/ae585d136e34c9e9ad9d45f75c059bc5367e73ae) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `BaseEdgeProps`

- [#5159](https://github.com/xyflow/xyflow/pull/5159) [`0c1436d6`](https://github.com/xyflow/xyflow/commit/0c1436d6a371240cfa0adecea573c44fd42df7b3) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `useConnection` hook

- [#5167](https://github.com/xyflow/xyflow/pull/5167) [`934ea42d`](https://github.com/xyflow/xyflow/commit/934ea42d9af6027a3164e1196a78140bdd05d347) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `useEdges`, `useInternalNode`, `useNodes` and `useNodeId` hooks

- [#5163](https://github.com/xyflow/xyflow/pull/5163) [`ab800054`](https://github.com/xyflow/xyflow/commit/ab800054a50c68f9c27dfad2b0d3833b782f4797) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `useNodesState` and `useEdgesState` hook

- [#5160](https://github.com/xyflow/xyflow/pull/5160) [`b357f43d`](https://github.com/xyflow/xyflow/commit/b357f43dfa262205059ac9714198196b4aaf8870) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `type UseHandleConnectionsParams` and `useHandleConnections` hook

- [#5162](https://github.com/xyflow/xyflow/pull/5162) [`29f4aeb2`](https://github.com/xyflow/xyflow/commit/29f4aeb260df0a5d83e775c7c2ed788f997006a7) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `type UseNodeConnectionsParams` and `useNodeConnections` hook

- [#5164](https://github.com/xyflow/xyflow/pull/5164) [`09021550`](https://github.com/xyflow/xyflow/commit/09021550dc72ac240fcbb6adb3cf530d91575f79) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `type UseOnViewportChangeOptions` and `useOnViewportChange` hook

- [#5166](https://github.com/xyflow/xyflow/pull/5166) [`701ad17e`](https://github.com/xyflow/xyflow/commit/701ad17ed3f523389e7d0bf9a006bef249645c3d) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `useStore` hook

- [#5170](https://github.com/xyflow/xyflow/pull/5170) [`eb2a33c6`](https://github.com/xyflow/xyflow/commit/eb2a33c6dfb0629e851ab3a0f2cd70eca92efc42) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `interface GetSimpleBezierPathParams` and `getSimpleBezierPath`

- [#5161](https://github.com/xyflow/xyflow/pull/5161) [`c4efe749`](https://github.com/xyflow/xyflow/commit/c4efe749208e854dc9ced5bdd00933269d5b4382) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `type UseKeyPressOptions` and `useKeyPress` hook

- Updated dependencies [[`02a3b746`](https://github.com/xyflow/xyflow/commit/02a3b74645799a3f0ce670b69365fa86ecb0616e), [`cbe305e1`](https://github.com/xyflow/xyflow/commit/cbe305e15a5c5d3b92583e0ec12364b2509f49bd), [`1f671bd4`](https://github.com/xyflow/xyflow/commit/1f671bd48f06230da841fdd1d7a312413ef16d03), [`aaebc462`](https://github.com/xyflow/xyflow/commit/aaebc462951ded8e91374c3e084d77af5ed7380a), [`6ec942fc`](https://github.com/xyflow/xyflow/commit/6ec942fc6501f81009c278cc995764bef3e8d03b)]:
  - @xyflow/system@0.0.55

## 12.5.4

### Patch Changes

- [#5134](https://github.com/xyflow/xyflow/pull/5134) [`7acab1e1`](https://github.com/xyflow/xyflow/commit/7acab1e123944c296180fbf826a3fd488963608f) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Adjust `@default` TSDoc tags for `BackgroundProps`

- [#5135](https://github.com/xyflow/xyflow/pull/5135) [`754a1671`](https://github.com/xyflow/xyflow/commit/754a167134f22fa00a139de4c7e10aaaa1953ac8) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `NodeResizerProps` and `ResizeControlProps`

- [#5140](https://github.com/xyflow/xyflow/pull/5140) [`82e6860e`](https://github.com/xyflow/xyflow/commit/82e6860e1354b8bb8047399b7773fd090be206d7) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `MiniMapProps` and `PanelProps`

- [#5147](https://github.com/xyflow/xyflow/pull/5147) [`f819005b`](https://github.com/xyflow/xyflow/commit/f819005be362d044b16ce4c0b85432f3f300a13a) Thanks [@moklick](https://github.com/moklick)! - Pass dimensions to final resize change event

- [#5143](https://github.com/xyflow/xyflow/pull/5143) [`b1e1cc11`](https://github.com/xyflow/xyflow/commit/b1e1cc1125d106cf1521a1524286404483e38f30) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `ReactFlowInstance` and `GeneralHelpers`

- [#5138](https://github.com/xyflow/xyflow/pull/5138) [`d4eb8d52`](https://github.com/xyflow/xyflow/commit/d4eb8d52d0e26e9534ec5fc347211ce91d1ddd32) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `ViewportHelperFunctions` and `NodeToolbarProps`

- [#5144](https://github.com/xyflow/xyflow/pull/5144) [`5a1ce56e`](https://github.com/xyflow/xyflow/commit/5a1ce56e8ce83f01e01ef531d90c52181c3e3a1a) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Compare `nodeStrokeWidth` with `number`, not with `string` within `MiniMap`

- [#5141](https://github.com/xyflow/xyflow/pull/5141) [`06cf4c10`](https://github.com/xyflow/xyflow/commit/06cf4c10f5d8a43f57ee0fde19d9a3fe1044cf48) Thanks [@dimaMachina](https://github.com/dimaMachina)! - Improve TSDoc comments for `Edge`, `BaseEdgeProps` and `ConnectionLineComponentProps`

- Updated dependencies [[`f819005b`](https://github.com/xyflow/xyflow/commit/f819005be362d044b16ce4c0b85432f3f300a13a), [`24a1bc89`](https://github.com/xyflow/xyflow/commit/24a1bc89348817ed9b5c87f74bf2519c705143be), [`36657cd6`](https://github.com/xyflow/xyflow/commit/36657cd66322c911e87eb37275c584a80025adfe), [`89de9ca8`](https://github.com/xyflow/xyflow/commit/89de9ca83fbf9263a687a0f5f915efb2beb31654), [`2ac6e155`](https://github.com/xyflow/xyflow/commit/2ac6e155e35256ca436281df16344366e7d05761), [`f0f378e5`](https://github.com/xyflow/xyflow/commit/f0f378e5b6918c2c30d9dc1e32587063cb942d4e)]:
  - @xyflow/system@0.0.54

## 12.5.3

### Patch Changes

- [#5132](https://github.com/xyflow/xyflow/pull/5132) [`75ab8942`](https://github.com/xyflow/xyflow/commit/75ab89420e3cd0fdc34baf06eabdc50113d4de7c) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix fitView not working when onNodesChange is not defined.

## 12.5.2

### Patch Changes

- [#5124](https://github.com/xyflow/xyflow/pull/5124) [`b76f7f9e`](https://github.com/xyflow/xyflow/commit/b76f7f9eb4841f139b1468b8eda0430ddd19a1ae) Thanks [@bjornosal](https://github.com/bjornosal)! - Export NodeConnection type

- [#5127](https://github.com/xyflow/xyflow/pull/5127) [`3079c2c9`](https://github.com/xyflow/xyflow/commit/3079c2c911426f54e8d295083ddbe97ed3aad201) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix `fitView` not working when returning early in `onNodesChange`.

## 12.5.1

### Patch Changes

- [#5120](https://github.com/xyflow/xyflow/pull/5120) [`6dfea686`](https://github.com/xyflow/xyflow/commit/6dfea6863a3cbd91f932bf54a6dba549bd248bd5) Thanks [@moklick](https://github.com/moklick)! - Handle fitView for uncontrolled flows

## 12.5.0

### Minor Changes

- [#5067](https://github.com/xyflow/xyflow/pull/5067) [`acba901d`](https://github.com/xyflow/xyflow/commit/acba901d861aa84cb5beba60b24fff4cfde7ada6) Thanks [@peterkogo](https://github.com/peterkogo)! - You can now express paddings in fitViewOptions as pixels ('30px'), as viewport percentages ('20%') and define different paddings for each side.

### Patch Changes

- [#5109](https://github.com/xyflow/xyflow/pull/5109) [`0cdda42c`](https://github.com/xyflow/xyflow/commit/0cdda42cdd1cd43d43d43c44e54b7b9f7a716ca9) Thanks [@dimaMachina](https://github.com/dimaMachina)! - fix: improve TSDoc comments for `BackgroundProps`

- [#5059](https://github.com/xyflow/xyflow/pull/5059) [`065ff89d`](https://github.com/xyflow/xyflow/commit/065ff89d10488f9c76c56870511e45eaed299778) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Prevent onPaneClick when connection is in progress. Closes [#5057](https://github.com/xyflow/xyflow/issues/5057)

- [#5110](https://github.com/xyflow/xyflow/pull/5110) [`7eb6eb07`](https://github.com/xyflow/xyflow/commit/7eb6eb0709e451d7628bfdbc3ced89b3bb57b626) Thanks [@dimaMachina](https://github.com/dimaMachina)! - fix: improve TSDoc comments for `EdgeLabelOptions` and `BaseEdgeProps`

- [#5113](https://github.com/xyflow/xyflow/pull/5113) [`bce8542d`](https://github.com/xyflow/xyflow/commit/bce8542df19c33f3cd9225f483435e8a7aa4ed94) Thanks [@dimaMachina](https://github.com/dimaMachina)! - fix: improve TSDoc comments for `ControlProps`

- [#5116](https://github.com/xyflow/xyflow/pull/5116) [`58942154`](https://github.com/xyflow/xyflow/commit/589421542386906ec49d8469cac551b8f7ea1c47) Thanks [@dimaMachina](https://github.com/dimaMachina)! - fix: improve TSDoc comments for `NodeToolbarProps`

- [#5114](https://github.com/xyflow/xyflow/pull/5114) [`ba2bfbb4`](https://github.com/xyflow/xyflow/commit/ba2bfbb49aafac979f94b0136bb408faea12d5c6) Thanks [@dimaMachina](https://github.com/dimaMachina)! - feat: export `EdgeLabelRendererProps`

- [#5107](https://github.com/xyflow/xyflow/pull/5107) [`c5a8c237`](https://github.com/xyflow/xyflow/commit/c5a8c23773e5985be6b37abacdac743911be8c09) Thanks [@moklick](https://github.com/moklick)! - Add TSDoc annotations for exported edges

- [#5067](https://github.com/xyflow/xyflow/pull/5067) [`cb685281`](https://github.com/xyflow/xyflow/commit/cb685281d0eaf03e9833271c31f92b1d143af2fe) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix fitView not working immediately after adding new nodes

- [#5115](https://github.com/xyflow/xyflow/pull/5115) [`c2154557`](https://github.com/xyflow/xyflow/commit/c215455735385ef5e12e4130164b9d01f9c18aa2) Thanks [@dimaMachina](https://github.com/dimaMachina)! - fix: improve TSDoc comments for `EdgeLabelOptions` and `EdgeTextProps`

- [#5093](https://github.com/xyflow/xyflow/pull/5093) [`65825e89`](https://github.com/xyflow/xyflow/commit/65825e89a6e2e7591087eb41ac89da4da7095f8f) Thanks [@moklick](https://github.com/moklick)! - Hidden nodes are not displayed in the mini map anymore

- [#5090](https://github.com/xyflow/xyflow/pull/5090) [`8da1748a`](https://github.com/xyflow/xyflow/commit/8da1748a6ad5cdde9f03737ff786bd29c9c968de) Thanks [@moklick](https://github.com/moklick)! - Release key even when an inout field is focused

- Updated dependencies [[`5d15b01b`](https://github.com/xyflow/xyflow/commit/5d15b01ba8cb349d6397a6ed8162848b4dfec293), [`cb685281`](https://github.com/xyflow/xyflow/commit/cb685281d0eaf03e9833271c31f92b1d143af2fe), [`a79f30b3`](https://github.com/xyflow/xyflow/commit/a79f30b3dd7c8ff6400c8d22214b2c2282e5bac1)]:
  - @xyflow/system@0.0.53

## 12.4.4

### Patch Changes

- [#5052](https://github.com/xyflow/xyflow/pull/5052) [`99dd7d35`](https://github.com/xyflow/xyflow/commit/99dd7d3549e7423e7d103b2c956c8b37f5747b90) Thanks [@moklick](https://github.com/moklick)! - Show an error if user drags uninitialized node

- [#5042](https://github.com/xyflow/xyflow/pull/5042) [`2fe0e850`](https://github.com/xyflow/xyflow/commit/2fe0e850a8c415c6a3113796a2c5c80e7cad2376) Thanks [@moklick](https://github.com/moklick)! - Allow click connections when target sets `isConnectableStart`

- [#5047](https://github.com/xyflow/xyflow/pull/5047) [`b3bf5693`](https://github.com/xyflow/xyflow/commit/b3bf5693c659069cea90bf1cb215ae65d06c5509) Thanks [@moklick](https://github.com/moklick)! - Pass generics to OnSelectionChangeFunc so that users can type it correctly

- [#5053](https://github.com/xyflow/xyflow/pull/5053) [`25fb45b5`](https://github.com/xyflow/xyflow/commit/25fb45b5e9d6da391b9aff652b8e6e34eaf757fc) Thanks [@moklick](https://github.com/moklick)! - Remove incorrect deprecation warning

- [#5033](https://github.com/xyflow/xyflow/pull/5033) [`7b4a81fb`](https://github.com/xyflow/xyflow/commit/7b4a81fb6b3d88f8ee7b4f070aef7ac3b962d5a6) Thanks [@dimaMachina](https://github.com/dimaMachina)! - lint: use `React.JSX` type instead of the deprecated global `JSX` namespace

- [#5043](https://github.com/xyflow/xyflow/pull/5043) [`0292ad20`](https://github.com/xyflow/xyflow/commit/0292ad20109a3b2518dc686a82e100a0a6964fb8) Thanks [@moklick](https://github.com/moklick)! - Use current expandParent value on drag to be able to update it while dragging

- [#5032](https://github.com/xyflow/xyflow/pull/5032) [`5867bba8`](https://github.com/xyflow/xyflow/commit/5867bba8050d07378a45a2026557c4bce7bda239) Thanks [@dimaMachina](https://github.com/dimaMachina)! - lint: remove unnecessary type assertions

- Updated dependencies [[`99dd7d35`](https://github.com/xyflow/xyflow/commit/99dd7d3549e7423e7d103b2c956c8b37f5747b90)]:
  - @xyflow/system@0.0.52

## 12.4.3

### Patch Changes

- [#5010](https://github.com/xyflow/xyflow/pull/5010) [`6c121d42`](https://github.com/xyflow/xyflow/commit/6c121d427fea9a11e86a85f95d2c12ba8af34919) Thanks [@moklick](https://github.com/moklick)! - Add more TSDocs to components, hooks, utils funcs and types

- [#4991](https://github.com/xyflow/xyflow/pull/4991) [`ea54d9bc`](https://github.com/xyflow/xyflow/commit/ea54d9bcb197d02d248ef3e4eaabc033a43d966a) Thanks [@waynetee](https://github.com/waynetee)! - Fix viewport shifting on node focus

- [#5013](https://github.com/xyflow/xyflow/pull/5013) [`cde899c5`](https://github.com/xyflow/xyflow/commit/cde899c5be9715c4ff2cc331ea93821102604c62) Thanks [@moklick](https://github.com/moklick)! - Pass `NodeType` type argument from `ReactFlowProps` to `connectionLineComponent` property.

- [#5008](https://github.com/xyflow/xyflow/pull/5008) [`12d859fe`](https://github.com/xyflow/xyflow/commit/12d859fe297593d44cf8493a4d6bf2c664b9139c) Thanks [@moklick](https://github.com/moklick)! - Add package.json to exports

- [#5012](https://github.com/xyflow/xyflow/pull/5012) [`4d3f19e8`](https://github.com/xyflow/xyflow/commit/4d3f19e88b984ce6743970560d7367d174500f32) Thanks [@moklick](https://github.com/moklick)! - Add snapGrid option to screenToFlowPosition and set snapToGrid to false

- [#5003](https://github.com/xyflow/xyflow/pull/5003) [`e8e0d684`](https://github.com/xyflow/xyflow/commit/e8e0d684957b95d53a6cc11598c8755ff02117c7) Thanks [@dimaMachina](https://github.com/dimaMachina)! - repair lint command

- [#4991](https://github.com/xyflow/xyflow/pull/4991) [`4c62f19b`](https://github.com/xyflow/xyflow/commit/4c62f19b3afac4b3db84b14e2c36f8c9e0a96116) Thanks [@waynetee](https://github.com/waynetee)! - Prevent viewport shift after using Tab

- Updated dependencies [[`6c121d42`](https://github.com/xyflow/xyflow/commit/6c121d427fea9a11e86a85f95d2c12ba8af34919), [`4947029c`](https://github.com/xyflow/xyflow/commit/4947029cd6cda0f695e1fb4815e4030adb232234), [`e8e0d684`](https://github.com/xyflow/xyflow/commit/e8e0d684957b95d53a6cc11598c8755ff02117c7)]:
  - @xyflow/system@0.0.51

## 12.4.2

### Patch Changes

- [#4957](https://github.com/xyflow/xyflow/pull/4957) [`fe843982`](https://github.com/xyflow/xyflow/commit/fe843982bfc7d7579d54772b201426b4c3f549c6) Thanks [@peterkogo](https://github.com/peterkogo)! - Narrow properties selected, selectable, deletable, draggable of NodeProps type to be required.

- Updated dependencies [[`fe843982`](https://github.com/xyflow/xyflow/commit/fe843982bfc7d7579d54772b201426b4c3f549c6), [`e73ef09f`](https://github.com/xyflow/xyflow/commit/e73ef09fbc8d872b46cf52c9d6a32dbb388c220b)]:
  - @xyflow/system@0.0.50

## 12.4.1

### Patch Changes

- [#4949](https://github.com/xyflow/xyflow/pull/4949) [`592c7eaf`](https://github.com/xyflow/xyflow/commit/592c7eaf9574fc69df3123837da95f85877b23e8) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix useNodeConnection hook not returning all connected edges.

- Updated dependencies [[`592c7eaf`](https://github.com/xyflow/xyflow/commit/592c7eaf9574fc69df3123837da95f85877b23e8)]:
  - @xyflow/system@0.0.49

## 12.4.0

### Minor Changes

- [#4725](https://github.com/xyflow/xyflow/pull/4725) [`e10f53cf`](https://github.com/xyflow/xyflow/commit/e10f53cf898a56f954783d6efcf6977a0d88f4a9) Thanks [@peterkogo](https://github.com/peterkogo)! - Add useNodeConnections hook to track all connections to a node. Can be filtered by handleType and handleId.

### Patch Changes

- [#4947](https://github.com/xyflow/xyflow/pull/4947) [`868aa3f3`](https://github.com/xyflow/xyflow/commit/868aa3f3db8223ea1b04a68aa027ea99fd1e91c8) Thanks [@moklick](https://github.com/moklick)! - Export ResizeControlVariant correctly as a value.

- [#4880](https://github.com/xyflow/xyflow/pull/4880) [`e2d849dc`](https://github.com/xyflow/xyflow/commit/e2d849dca63aee5952f676aef1c675c6232bb69a) Thanks [@crimx](https://github.com/crimx)! - Add type check for all event targets

- [#4929](https://github.com/xyflow/xyflow/pull/4929) [`4947f683`](https://github.com/xyflow/xyflow/commit/4947f683b7530f8e6684865ab53ea38633de0f4d) Thanks [@peterkogo](https://github.com/peterkogo)! - Optimize selections and take into account if edges connected to selected nodes are actually selectable.

- Updated dependencies [[`e2d849dc`](https://github.com/xyflow/xyflow/commit/e2d849dca63aee5952f676aef1c675c6232bb69a), [`e10f53cf`](https://github.com/xyflow/xyflow/commit/e10f53cf898a56f954783d6efcf6977a0d88f4a9), [`4947f683`](https://github.com/xyflow/xyflow/commit/4947f683b7530f8e6684865ab53ea38633de0f4d)]:
  - @xyflow/system@0.0.48

## 12.3.6

### Patch Changes

- [#4846](https://github.com/xyflow/xyflow/pull/4846) [`75017939`](https://github.com/xyflow/xyflow/commit/7501793900fdb125fe906fa3d9d83f1bd11c6e20) Thanks [@moklick](https://github.com/moklick)! - Make it possible to use expandParent with immer and other immutable helpers

- [#4865](https://github.com/xyflow/xyflow/pull/4865) [`2c4acc2b`](https://github.com/xyflow/xyflow/commit/2c4acc2bd9ec271468bd4c904e19d7fca627d9e1) Thanks [@moklick](https://github.com/moklick)! - Add group node to BuiltInNode type. Thanks [@sjdemartini](https://github.com/sjdemartini)!

- [#4877](https://github.com/xyflow/xyflow/pull/4877) [`9a8309da`](https://github.com/xyflow/xyflow/commit/9a8309dab892f047fce10d3c763466cf84f726b0) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix intersections for nodes with origins other than [0,0]. Thanks [@gmvrpw](https://github.com/gmvrpw)!

- [#4844](https://github.com/xyflow/xyflow/pull/4844) [`6f11e552`](https://github.com/xyflow/xyflow/commit/6f11e552c3f51b5931b98d5ff798156cdb8cc2d9) Thanks [@moklick](https://github.com/moklick)! - Allow custom data-testid for ReactFlow component

- [#4816](https://github.com/xyflow/xyflow/pull/4816) [`43aa52a8`](https://github.com/xyflow/xyflow/commit/43aa52a8cd93e6a01c01afa314c7036eb5b77131) Thanks [@moklick](https://github.com/moklick)! - Type isValidConnection prop correctly by passing EdgeType

- [#4855](https://github.com/xyflow/xyflow/pull/4855) [`106c2cf8`](https://github.com/xyflow/xyflow/commit/106c2cf8e5e9a944ea7ea9a2558e26cb75f9ac93) Thanks [@mhuggins](https://github.com/mhuggins)! - Support passing `path` element attributes to `BaseEdge` component.

- [#4862](https://github.com/xyflow/xyflow/pull/4862) [`adf4fb4e`](https://github.com/xyflow/xyflow/commit/adf4fb4e7bb136cce47ef540e9bcc0f82cf17ff4) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Prevent default scrolling behavior when nodes or a selection is moved with an arrow key press.

- [#4875](https://github.com/xyflow/xyflow/pull/4875) [`41d4743a`](https://github.com/xyflow/xyflow/commit/41d4743a690f054f6dc2b9084b5fad8e54ade921) Thanks [@peterkogo](https://github.com/peterkogo)! - Prevent unnecessary rerenders of edges when resizing the flow.

- [#4826](https://github.com/xyflow/xyflow/pull/4826) [`5f90acda`](https://github.com/xyflow/xyflow/commit/5f90acdab1f4748bb04f8b1ec67d569983684058) Thanks [@chrtze](https://github.com/chrtze)! - Forward ref of the div inside Panel components.

- Updated dependencies [[`d60331e6`](https://github.com/xyflow/xyflow/commit/d60331e6baa7931c46af219e35c1bedbd156187c)]:
  - @xyflow/system@0.0.47

## 12.3.5

### Patch Changes

- [#4789](https://github.com/xyflow/xyflow/pull/4789) [`358eb355`](https://github.com/xyflow/xyflow/commit/358eb355e0b2bea4ffa47b0f04d6edf834343cd7) Thanks [@peterkogo](https://github.com/peterkogo)! - Support key combinations which include '+' (e.g., 'Control++' resolves to the combination 'Control' and '+').

- [#4796](https://github.com/xyflow/xyflow/pull/4796) [`73402779`](https://github.com/xyflow/xyflow/commit/734027798799f4a98212dda115d33b4c54a95a45) Thanks [@Aki-7](https://github.com/Aki-7)! - Fix number of issues connected to batching node & edge updates.

- [#4790](https://github.com/xyflow/xyflow/pull/4790) [`2fa9a920`](https://github.com/xyflow/xyflow/commit/2fa9a92042ba11986abbababb7e8b294e208d6cb) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix node dragging & resizing while zooming on flow that does not cover whole browser window.

- [#4782](https://github.com/xyflow/xyflow/pull/4782) [`323e1b35`](https://github.com/xyflow/xyflow/commit/323e1b35c58bca80deb824bc8b136705593a5257) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix node intersections in nested flow.

- Updated dependencies [[`2fa9a920`](https://github.com/xyflow/xyflow/commit/2fa9a92042ba11986abbababb7e8b294e208d6cb), [`323e1b35`](https://github.com/xyflow/xyflow/commit/323e1b35c58bca80deb824bc8b136705593a5257)]:
  - @xyflow/system@0.0.46

## 12.3.4

### Patch Changes

- [#4772](https://github.com/xyflow/xyflow/pull/4772) [`7f670ab0`](https://github.com/xyflow/xyflow/commit/7f670ab0423b3848a50398027297f6ec11deeaa4) Thanks [@mistic](https://github.com/mistic)! - Splits exports field in package.json to support an explicit resolution for browser, node and default to resolve issues with webpack esm module resolution.

- Updated dependencies [[`7f670ab0`](https://github.com/xyflow/xyflow/commit/7f670ab0423b3848a50398027297f6ec11deeaa4)]:
  - @xyflow/system@0.0.45

## 12.3.3

### Patch Changes

- [#4755](https://github.com/xyflow/xyflow/pull/4755) [`005ae1c0`](https://github.com/xyflow/xyflow/commit/005ae1c05f6a10c1f519cd789f4f3f2fdf293bc6) Thanks [@peterkogo](https://github.com/peterkogo)! - Add module to exports in package.json. This should resolve possible issues with Webpack ESM Module Resolution.

- [#4730](https://github.com/xyflow/xyflow/pull/4730) [`2c590b90`](https://github.com/xyflow/xyflow/commit/2c590b90787aabce42de2b4108174bdf31ad6155) Thanks [@peterkogo](https://github.com/peterkogo)! - Fixed rare crash while dragging

- Updated dependencies [[`005ae1c0`](https://github.com/xyflow/xyflow/commit/005ae1c05f6a10c1f519cd789f4f3f2fdf293bc6), [`2c590b90`](https://github.com/xyflow/xyflow/commit/2c590b90787aabce42de2b4108174bdf31ad6155)]:
  - @xyflow/system@0.0.44

## 12.3.2

### Patch Changes

- [#4722](https://github.com/xyflow/xyflow/pull/4722) [`e816bb69`](https://github.com/xyflow/xyflow/commit/e816bb6953486e37dd39d93252aa9b94fe5d4ec1) Thanks [@moklick](https://github.com/moklick)! - Fix internal behaviour that mutated user nodes which led to an issue with Redux and immer

## 12.3.1

### Patch Changes

- [#4670](https://github.com/xyflow/xyflow/pull/4670) [`b056564c`](https://github.com/xyflow/xyflow/commit/b056564c9658bb43b882eebfad5a7e224717ffb5) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix initial `fitView` not working correctly for `nodeOrigin` other than [0,0]

- [#4670](https://github.com/xyflow/xyflow/pull/4670) [`b056564c`](https://github.com/xyflow/xyflow/commit/b056564c9658bb43b882eebfad5a7e224717ffb5) Thanks [@peterkogo](https://github.com/peterkogo)! - Improve `fitView` to respect clamped node positions based on `nodeExtent`

- [#4653](https://github.com/xyflow/xyflow/pull/4653) [`02390f99`](https://github.com/xyflow/xyflow/commit/02390f9966d51c80e4e1b488733b5bf7322ad710) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Calculate viewport dimensions in `fitView` instead of using stored dimensions. Fixes [#4652](https://github.com/xyflow/xyflow/issues/4652)

- Updated dependencies [[`99ba64ac`](https://github.com/xyflow/xyflow/commit/99ba64ac2e1ce9c5ac3cab85a3d574edc0ecf4cc), [`b056564c`](https://github.com/xyflow/xyflow/commit/b056564c9658bb43b882eebfad5a7e224717ffb5)]:
  - @xyflow/system@0.0.43

## 12.3.0

### Minor Changes

- [#4477](https://github.com/xyflow/xyflow/pull/4477) [`d5592e75`](https://github.com/xyflow/xyflow/commit/d5592e7508bc32d5ffc953844b1d42b9ec59b25b) Thanks [@peterkogo](https://github.com/peterkogo)! - Add `getNodesBounds` to `useReactFlow`/`useSvelteFlow` hook as the new recommended way of determining node bounds.

### Patch Changes

- [#4630](https://github.com/xyflow/xyflow/pull/4630) [`4347269f`](https://github.com/xyflow/xyflow/commit/4347269f02488a24f411d083c409f5741cbf468e) Thanks [@moklick](https://github.com/moklick)! - Fix `<Minimap />` only displaying nodes when providing `onNodesChange`.

- [#4572](https://github.com/xyflow/xyflow/pull/4572) [`d9563505`](https://github.com/xyflow/xyflow/commit/d9563505d8fb01862a3a6bae6e05dcea626c2e26) Thanks [@peterkogo](https://github.com/peterkogo)! - Improve handling of global and individual `nodeExtent`s. Nodes will never render outside of specified extents.

- Updated dependencies [[`d5592e75`](https://github.com/xyflow/xyflow/commit/d5592e7508bc32d5ffc953844b1d42b9ec59b25b), [`d9563505`](https://github.com/xyflow/xyflow/commit/d9563505d8fb01862a3a6bae6e05dcea626c2e26)]:
  - @xyflow/system@0.0.42

## 12.2.1

### Patch Changes

- [#4619](https://github.com/xyflow/xyflow/pull/4619) [`a7eb7c2d`](https://github.com/xyflow/xyflow/commit/a7eb7c2dbbeca85ca2d99917007dee78c8951a06) Thanks [@moklick](https://github.com/moklick)! - align background pattern with snap grid

- [#4611](https://github.com/xyflow/xyflow/pull/4611) [`2aaa709c`](https://github.com/xyflow/xyflow/commit/2aaa709c0014b91ab75a4e40753b71cc7bb04a2c) Thanks [@moklick](https://github.com/moklick)! - make onViewportChange a dynamic prop

- Updated dependencies [[`2aaa709c`](https://github.com/xyflow/xyflow/commit/2aaa709c0014b91ab75a4e40753b71cc7bb04a2c)]:
  - @xyflow/system@0.0.41

## 12.2.0

### Minor Changes

- [#4574](https://github.com/xyflow/xyflow/pull/4574) [`b65aed19`](https://github.com/xyflow/xyflow/commit/b65aed19840c515949bef236a23d5f0a754cdeb4) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Add `getHandleConnections` helper to `useReactFlow` & `useSvelteFlow`

### Patch Changes

- [#4594](https://github.com/xyflow/xyflow/pull/4594) [`5138d90b`](https://github.com/xyflow/xyflow/commit/5138d90bdb91ff5d8dbeb8c8d29bdfd31c5b59d6) Thanks [@peterkogo](https://github.com/peterkogo)! - Fixed reconnecting edges with loose connectionMode

- [#4603](https://github.com/xyflow/xyflow/pull/4603) [`12dbe125`](https://github.com/xyflow/xyflow/commit/12dbe125755fad7d2f6dff19100872dd823d1012) Thanks [@moklick](https://github.com/moklick)! - use correct index when using setNodes for inserting

- Updated dependencies [[`5138d90b`](https://github.com/xyflow/xyflow/commit/5138d90bdb91ff5d8dbeb8c8d29bdfd31c5b59d6), [`12dbe125`](https://github.com/xyflow/xyflow/commit/12dbe125755fad7d2f6dff19100872dd823d1012)]:
  - @xyflow/system@0.0.40

## 12.1.1

### Patch Changes

- [#4568](https://github.com/xyflow/xyflow/pull/4568) [`c3e62782`](https://github.com/xyflow/xyflow/commit/c3e6278222dc13333f75ecdbe634201ddabab87a) Thanks [@peterkogo](https://github.com/peterkogo)! - Only display grab cursor when panOnDrag is on left mouse button

- [#4567](https://github.com/xyflow/xyflow/pull/4567) [`cc75c29f`](https://github.com/xyflow/xyflow/commit/cc75c29f3c7450321c64107f5b2a0f2084a0431c) Thanks [@peterkogo](https://github.com/peterkogo)! - Fix internal type of edges in store

- Updated dependencies [[`c3e62782`](https://github.com/xyflow/xyflow/commit/c3e6278222dc13333f75ecdbe634201ddabab87a)]:
  - @xyflow/system@0.0.39

## 12.1.0

### Minor Changes

- [#4555](https://github.com/xyflow/xyflow/pull/4555) [`24e87e39`](https://github.com/xyflow/xyflow/commit/24e87e398419646f671af1085fbfec3e197bc56b) Thanks [@peterkogo](https://github.com/peterkogo)! - Added final connection state as a function parameter to onReconnectEnd

- [#4554](https://github.com/xyflow/xyflow/pull/4554) [`cca11ea1`](https://github.com/xyflow/xyflow/commit/cca11ea1c549f3fae1e52f5c121f607ded9764f3) Thanks [@peterkogo](https://github.com/peterkogo)! - Added optional selector for useConnection hook

- [#4549](https://github.com/xyflow/xyflow/pull/4549) [`99733c01`](https://github.com/xyflow/xyflow/commit/99733c01bc70f9463e7dba0046c5f8d839a1d2ba) Thanks [@moklick](https://github.com/moklick)! - feat(onConnectEnd): pass connectionState param

### Patch Changes

- [#4550](https://github.com/xyflow/xyflow/pull/4550) [`41981970`](https://github.com/xyflow/xyflow/commit/41981970e40baae29ec1631ea5f1eec9c27dfb12) Thanks [@moklick](https://github.com/moklick)! - fix(fitView): only trigger for resize observer

- [#4501](https://github.com/xyflow/xyflow/pull/4501) [`ec64b572`](https://github.com/xyflow/xyflow/commit/ec64b57240f0c61912d4910b095210f57d8df8ce) Thanks [@jeffgord](https://github.com/jeffgord)! - fix(background): use offset prop correctly for dots variant

- [#4548](https://github.com/xyflow/xyflow/pull/4548) [`692e6440`](https://github.com/xyflow/xyflow/commit/692e6440b10e75cb31f3f3172aede9ed4d7f05d2) Thanks [@peterkogo](https://github.com/peterkogo)! - Replaced algorithm used for searching close handles while connecting

- [#4547](https://github.com/xyflow/xyflow/pull/4547) [`fdff601d`](https://github.com/xyflow/xyflow/commit/fdff601de418f2ac6a78f04e5a586d67b8d436e6) Thanks [@moklick](https://github.com/moklick)! - chore(react): re-export Handle type

- Updated dependencies [[`b63a3734`](https://github.com/xyflow/xyflow/commit/b63a3734b84b6817603c8e6e48e2836f048acc3b), [`24e87e39`](https://github.com/xyflow/xyflow/commit/24e87e398419646f671af1085fbfec3e197bc56b), [`692e6440`](https://github.com/xyflow/xyflow/commit/692e6440b10e75cb31f3f3172aede9ed4d7f05d2), [`559d4926`](https://github.com/xyflow/xyflow/commit/559d49264b940f93c5e205bf984aa76230b10806), [`4ecfd7e1`](https://github.com/xyflow/xyflow/commit/4ecfd7e19720b70024d0b5dff27d4537dd46b49a), [`e7ef328f`](https://github.com/xyflow/xyflow/commit/e7ef328f8f9286a817b19457d38c491e6c0bcffd), [`99733c01`](https://github.com/xyflow/xyflow/commit/99733c01bc70f9463e7dba0046c5f8d839a1d2ba)]:
  - @xyflow/system@0.0.38

## 12.0.4

### Patch Changes

- [#4480](https://github.com/xyflow/xyflow/pull/4480) [`aae526f4`](https://github.com/xyflow/xyflow/commit/aae526f4ce0818e8ab5ee9f44dd7ce4b70eb4cf9) Thanks [@peterkogo](https://github.com/peterkogo)! - fix(dragging) nodeExtent breaks dragging nodes in subflows

- [#4498](https://github.com/xyflow/xyflow/pull/4498) [`7a6e9e30`](https://github.com/xyflow/xyflow/commit/7a6e9e3091c8ee0aedbf8ae6e5c4ee08485417ab) Thanks [@peterkogo](https://github.com/peterkogo)! - fix(pane) only capture pointer after a valid selection has started, fixes #4492

## 12.0.3

### Patch Changes

- Updated dependencies [[`543c0939`](https://github.com/xyflow/xyflow/commit/543c09392d53fdd56a8876e65f4ce2d8ab250098), [`89cd677b`](https://github.com/xyflow/xyflow/commit/89cd677b5668b78434e02e7b025c6ac58db91e58), [`c253c7c5`](https://github.com/xyflow/xyflow/commit/c253c7c59a2ccd2cb91ad44ce4acbe481d9d7fe1)]:
  - @xyflow/system@0.0.37

## 12.0.2

### Patch Changes

- [#4446](https://github.com/xyflow/xyflow/pull/4446) [`80baf53b`](https://github.com/xyflow/xyflow/commit/80baf53bdc7d4fb0715e5eed85efdea77191935a) Thanks [@moklick](https://github.com/moklick)! - fix(resizer): export types

- [#4450](https://github.com/xyflow/xyflow/pull/4450) [`18a12661`](https://github.com/xyflow/xyflow/commit/18a1266131e7c2bdd9a15268dbf871cdf17cad9a) Thanks [@moklick](https://github.com/moklick)! - fix(selection): dont trigger onSelectionEnd on click

- [#4451](https://github.com/xyflow/xyflow/pull/4451) [`4cccd06a`](https://github.com/xyflow/xyflow/commit/4cccd06a671e9ef1c6f16ab0d788081f8d894d0e) Thanks [@moklick](https://github.com/moklick)! - add nodeClickDistance

- Updated dependencies [[`80baf53b`](https://github.com/xyflow/xyflow/commit/80baf53bdc7d4fb0715e5eed85efdea77191935a), [`4cccd06a`](https://github.com/xyflow/xyflow/commit/4cccd06a671e9ef1c6f16ab0d788081f8d894d0e)]:
  - @xyflow/system@0.0.36

## 12.0.1

### Patch Changes

- [#4434](https://github.com/xyflow/xyflow/pull/4434) [`1bda2451`](https://github.com/xyflow/xyflow/commit/1bda24519658b4aaed6d4abf9e7e9d096e193b5b) Thanks [@moklick](https://github.com/moklick)! - fix(selection): handle pointer capture for selectionOnDrag

- [#4432](https://github.com/xyflow/xyflow/pull/4432) [`d2da5765`](https://github.com/xyflow/xyflow/commit/d2da576591305873f8d6514091ee8db1ad4f79e2) Thanks [@moklick](https://github.com/moklick)! - refactor(useConnection): return internal node, add node generic

- Updated dependencies [[`d2da5765`](https://github.com/xyflow/xyflow/commit/d2da576591305873f8d6514091ee8db1ad4f79e2)]:
  - @xyflow/system@0.0.35

## 12.0.0

React Flow 12 is finally out! With a new package name `@xyflow/react`!

### Main features

- **SSR / SSG**: you can define `width`, `height` and `handles` for the nodes. This makes it possible to render a flow on the server and hydrate on the client: [SSR guide](http://reactflow.dev/learn/advanced-use/ssr-ssg-configuration)
  - Details: In v11, `width` and `height` were set by the library as soon as the nodes got measured. This still happens, but we are now using `measured.width` and `measured.height` to store this information. In the previous versions there was always a lot of confusion about `width` and `height`. It’s hard to understand, that you can’t use it for passing an actual width or height. It’s also not obvious that those attributes get added by the library. We think that the new implementation solves both of the problems: `width` and `height` are optional attributes that can be used to define dimensions and the measured dimensions are stored in `measured`.
- **Reactive Flows:** The new hooks `useHandleConnections` and `useNodesData` and the new `updateNode` and `updateNodeData` functions can be used for managing the data flow between your nodes: [computing flows guide](http://reactflow.dev/learn/advanced-use/computing-flows)
  - Details: Working with reactive flows is super common. You update node A and want to react on those changes in the connected node B. Until now everyone had to come up with a custom solution. With this version we want to change this and give you performant helpers to handle this. If you are excited about this, you can check out this example:
- **Dark mode and css variables:** React Flow now comes with a built-in dark mode, that can be toggled by using the new `colorMode` prop (”light”, “dark” or “system”): [dark mode example](https://reactflow.dev/examples/styling/dark-mode)
  - Details: With this version we want to make it easier to switch between dark and light modes and give you a better starting point for dark flows. If you pass colorMode=”dark”, we add the class name “dark” to the wrapper and use it to adjust the styling. To make the implementation for this new feature easier on our ends, we switched to CSS variables for most of the styles. These variables can also be used in user land to customize a flow.

### More features and updates

There is more! Besides the new main features, we added some minor things that were on our list for a long time. We also started to use TS docs for better docs. We already started to add some docs for some types and hooks which should improve the developer experience.

- **[`useConnection` hook](https://reactflow.dev/api-reference/hooks/use-connection):** With this hook you can access the ongoing connection. For example, you can use it for colorizing handles styling a custom connection line based on the current start / end handles.
- **Controlled `viewport`:** This is an advanced feature. Possible use cases are to animate the viewport or round the transform for lower res screens for example. This features brings two new props: [`viewport`](https://reactflow.dev/api-reference/react-flow#viewport) and [`onViewportChange`](https://reactflow.dev/api-reference/react-flow#on-viewport-change).
- **[`ViewportPortal`](https://reactflow.dev/api-reference/components/viewport-portal) component:** This makes it possible to render elements in the viewport without the need to implement a custom node.
- **[`onDelete`](https://reactflow.dev/api-reference/react-flow#on-delete) handler**: We added a combined handler for `onDeleteNodes` and `onDeleteEdges` to make it easier to react to deletions.
- **[`onBeforeDelete`](https://reactflow.dev/api-reference/react-flow#on-before-delete) handler**: With this handler you can prevent/ manage deletions.
- **[`isValidConnection`](https://reactflow.dev/api-reference/react-flow#is-valid-connection) prop:** This makes it possible to implement one validation function for all connections. It also gets called for programmatically added edges.
- **[`autoPanSpeed`](https://reactflow.dev/api-reference/react-flow#autoPanSpeed) prop:** For controlling the speed while auto panning.
- **Background component**: add [`patternClassName`](https://reactflow.dev/api-reference/components/background#pattern-class-name) prop to be able to style the background pattern by using a class name. This is useful if you want to style the background pattern with Tailwind for example.
- **`onMove` callback** gets triggered for library-invoked viewport updates (like fitView or zoom-in)
- **`deleteElements`** now returns deleted nodes and deleted edges
- add **`origin` attribute** for nodes
- add **`selectable` attribute** for edges
- Node Resizer: child nodes don't move when the group is resized, extent and expand is recognized correctly
- Correct types for `BezierEdge`, `StepEdge`, `SmoothStepEdge` and `StraightEdge` components
- New edges created by the library only have `sourceHandle` and `targetHandle` attributes when those attributes are set. (We used to pass `sourceHandle: null` and `targetHandle: null`)
- Edges do not mount/unmount when their z-index change
- connection line knows about the target handle position so that the path is drawn correctly
- `nodeDragThreshold` is 1 by default instead of 0
- a better selection box usability (capture while dragging out of the flow)
- add `selectable`, `deletable`, `draggable` and `parentId` to `NodeProps`
- add a warning when styles not loaded

## 12.0.0-next.28

- add `paneDistanceClick` prop (max distance between mousedown/up that will trigger a click)
- returned nodes in `onNodeDragStop` are set to `dragging=false`

## 12.0.0-next.27

- return Promises for `setViewport`, `fitView`, `fitBounds` and `zoomTo` to be able to await viewport update

## 12.0.0-next.26

- add `autoPanSpeed` prop

## 12.0.0-next.25

- `useConnection` returns `ConnectionState` with `toNode` and `toHandle`
- add `toNode` and `toHandle` to custom connection line props
- node origin is part of position absolute
- refactor connection handling

## 12.0.0-next.24

- fix `window` bug for SSR for real

## 12.0.0-next.23

- fix `window` bug for SSR

## 12.0.0-next.22

- ⚠️ rename `updateEdge` to `reconnectEdge` and realted APIs [#4373](https://github.com/xyflow/xyflow/pull/4373)
- revise selection usability (capture while dragging out of the flow)
- use correct end handle position when drawing a connection lines
- determine correct end positions for connection lines

## 12.0.0-next.21

- fix node origin bug

## 12.0.0-next.20

- add `updateEdge` and `updateEdgeData` helpers to `useReactFlow`
- enable dynamic edge label updates
- prevent zooming on mobile if zoomOnPinch is false
- add straight edge to path built-in-types
- abort drag when multiple touches are detected

## 12.0.0-next.19

- update internals on node resizer updates
- re-observe node when `node.hidden` is toggled
- update `updateNodeData` argument type - thanks @ogroppo
- add `selectable`, `deletable` and `draggable` to node and edge props
- add `parentId` to node props
- fix parent node lookup in `evaluateAbsolutePosition`- thanks @lcsfort

## 12.0.0-next.18

- don't show nodeTypes warning if not necessary you've created a new nodeTypes or edgeTypes
- add node resizer styles to base.css
- remove `HandleComponentProps` type, only export `HandleProps` type
- add warning when styles not loaded

## 12.0.0-next.17

- fix broken `defaultNodes`
- add string array to `UpdateNodeInternals` thanks @DenizUgur
- pinch zoom on windows
- drag for touch devices
- return user node in node event handlers
- cleanup `useReactFlow`
- export `KeyCode` and `Align` type
- remove `Instance` in favour of `ReactFlowInstance` type

## 12.0.0-next.16

## Patch changes

- fix batching for `setNodes`, `updateNode`, `updateNodeData` etc.
- fix `useNodesInitialized`

## 12.0.0-next.15

## Patch changes

- re-observe nodes when using `onlyRenderVisibleElements={true}`
- use correct positions for intersection helpers
- fix minimap interaction for touch devices
- pass user nodes to `onSelectionChange` instead of internal ones to work with Redux
- call `onEnd` in XYResizer thanks @tonyf
- cleanup `getPositionWithOrigin` usage
- use `setAttributes` flag for dimension change when `width`/`height` should be set
- use `replace: false` as the default for `updateNode` function

## 12.0.0-next.14

## Patch changes

- fix hidden nodes
- use `direction=ltr` for outer wrapper to support rtl sites
- allow pinch zoom even if `preventScrolling=false`
- export node and edge change related types
- only trigger dimensions updates when changes detected

## 12.0.0-next.13

## ⚠️ Breaking changes

- rename `node.parentNode` to `node.parentId`
- rename node.computed to node.measured
- remove positionAbsolute from `node.computed`

## Minor Changes

- new helpers: `useInternalNode` hook, `getInternalNode` function

## Patch changes

- remove `internalsSymbol` (now called internals and only available for internal nodes)
- handle parentExpand on library side instead of applyChanges
- new type `InternalNode`

## 12.0.0-next.12

## Patch changes

- fix useNodesData: handle invalid node id thanks @saswatax
- fix forwardRef: use custom fixForwardRef function
- refactor intersection helpers to use passed node value

## 12.0.0-next.11

## Patch changes

- fix `ref` prop for `ReactFlow` and `Handle` component
- unify `Edge` and `Node` type handling
- fix safari: prevent selection of viewport
- fix `useNodesData` hook to prevent re-renderings
- fix edges: allow start at 0,0

## 12.0.0-next.10

## ⚠️ Breaking changes

- `useNodesData` not only returns data objects but also the type and the id of the node
- status class names for Handle components are slightly different. It's now "connectingfrom" and "connectingto" instead of "connecting"

## Patch changes

- better cursor defaults for the pane, nodes and edges
- `disableKeyboardA11y` now also disables Enter and Escape for selecting/deselecting nodes and edges
- fix bug where users couldn't drag a node after toggle nodes `hidden` attribute
- add `initialWidth` and `initialHeight` node attributes for specifying initial dimensions for ssr
- fix `NodeResizer` when used in combination with `nodeOrigin`

## 12.0.0-next.9

### Patch changes

- a better `NodeResizer` that works with subflows. Child nodes do not move when parent node gets resized and parent extent is taken into account
- refactor `setNodes` batching
- re-measure nodes when necessary
- don't trigger drag start / end when node is not draggable

## 12.0.0-next.8

### Patch changes

- selection box is not interrupted by selectionKey being let go
- fix `OnNodeDrag` type
- do not use fallback handle if a specific id is being used
- fix `defaultEdgeOptions` markers not being applied
- fix `getNodesBounds` and add second param for passing options
- fix `expandParent` for child nodes

## 12.0.0-next.7

## Minor changes

- add second option param to `screenToFlowPosition` for configuring if `snapToGrid` should be used

### Patch changes

- pass `Node`/ `Edge` types to changes thanks @FelipeEmos
- use position instead of positionAbsolute for `getNodesBounds`
- infer types for `getIncomers`, `getOutgoers`, `updateEdge`, `addEdge` and `getConnectedEdges` thanks @joeyballentine
- refactor handles: prefix with flow id for handling nested flows
- add comments for types like `ReactFlowProps` or `Node` for a better developer experience

## 12.0.0-next.6

### Patch changes

- fix `deleteElements`
- refactor internal `applyChanges`
- batch `setNodes` and `setEdges` from `useReactFlow`
- add `aria-label` prop for `<Controls />`

## 12.0.0-next.5

### Minor changes

- fix applyChanges: handle multi changes for one node, deletions and expandParent
- use `XYResizer` from @xyflow/system
- add unit tests for `applyNodeChanges` and `applyEdgeChanges`

## 12.0.0-next.4

### Minor changes

- fix applyChanges: handle empty flows + addNodes/addEdges closes
- cleanup exports

## 12.0.0-next.3

### Minor changes

- fix edges styles when using base.css

## 12.0.0-next.2

### Minor changes

- fix connection line rendering
- fix multi handle

## 12.0.0-next.1

### Minor changes

- fix edge rendering

## 12.0.0-next.0

React Flow v12 is coming soon! We worked hard over the past months and tried to make as few breaking changes as possible (there are some). We are in no rush to release v12, so we’d be happy to hear any early feedback so we can adjust the API or redefine new features before launching stable v12. 🚀 The big topics for this version are:

1. **Support for SSG/ SSR**: you can now render flows on the server
2. **Reactive flows**: new hooks and helper functions to simplify data flows
3. **Dark mode**: a new base style and easy way to switch between built in color modes

Svelte Flow had a big impact on this release as well. While combing through each line of React Flow, we created framework agnostic helpers, found bugs, and made some under the hood improvements. All of these changes are baked into the v12 release as a welcome side-effect of that launch. 🙌🏻 We also improved the performance for larger flows with the help of Ivan.

### Migrate from 11 to 12

Before you can try out the new features, you need to do some minor updates:

- **A new npm package name:** Our name changed from `reactflow` to `@xyflow/react` and the main component is no longer a default, but a named import:
  - v11: `import ReactFlow from 'reactflow';`
  - v12: `import { ReactFlow } from '@xyflow/react';`
- **Node attribute “computed”:** All computed node values are now stored in `node.computed`
  - v11: `node.width`, `node.height` ,`node.positionAbsolute`
  - v12: `node.computed.width`, `node.computed.height` and `node.computed.positionAbsolute` . (`node.width`/ `node.height` can now be used for SSG)
- **Updating nodes:** We are not supporting node updates with object mutations anymore. If you want to update a certain attribute, you need to create a new node.
  - v11:
    ```js
    setNodes((nds) =>
      nds.map((node) => {
        node.hidden = true;
        return node;
      })
    );
    ```
  - v12:
    ```js
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        hidden: true,
      }))
    );
    ```
- **NodeProps:** `posX`/`posY` is now called `positionAbsoluteX`/`positionAbsoluteY`
- **Typescript only:** We simplified types and fixed issues about functions where users could pass a `NodeData` generic. The new way is to define your own node type for the whole app and then only use that one. The big advantage of this is, that you can have multiple node types with different data structures and always be able to distinguish by checking the `node.type` attribute.
  - v11: `applyNodeChange<NodeData, NodeType>`
  - v12: `type MyNodeType = Node<{ value: number }, ‘number’> | Node<{ value: string }, ‘text’>; applyNodeChange<MyNodeType>`
  - affected functions: `useNodes`, `useNodesState`, `useEdgesState`, `applyNodeChange`, `onInit`, `applyEdgeChanges` , `MiniMapProps`
- **Removal of deprecated functions:**
  - `getTransformForBounds` (new name: `getViewportForBounds`),
  - `getRectOfNodes` (new name: `getNodesBounds`)
  - `project` (new name: `screenToFlowPosition`)
  - `getMarkerEndId`

### Main features

Now that you successfully migrated to v12, you can use all the fancy features. As mentioned above, the biggest updates for v12 are:

- **SSR / SSG**: you can define `width`, `height` and `handles` for the nodes. This makes it possible to render a flow on the server and hydrate on the client: [codesandbox](https://codesandbox.io/p/devbox/reactflow-v12-next-pr66yh)
  - Details: In v11, `width` and `height` were set by the library as soon as the nodes got measured. This still happens, but we are now using `computed.width` and `computed.height` to store this information. The `positionAbsolute` attribute also gets stored in `computed` . In the previous versions there was always a lot of confusion about `width` and `height`. It’s hard to understand, that you can’t use it for passing an actual width or height. It’s also not obvious that those attributes get added by the library. We think that the new implementation solves both of the problems: `width` and `height` are optional attributes that can be used to define dimensions and everything that is set by the library, is stored in `computed`.
- **Reactive Flows:** The new hooks `useHandleConnections` and `useNodesData` and the new `updateNode` and `updateNodeData` functions can be used for managing the data flow between your nodes: [codesandbox](https://codesandbox.io/p/sandbox/reactflow-reactive-flow-sy93yx)
  - Details: Working with reactive flows is super common. You update node A and want to react on those changes in the connected node B. Until now everyone had to come up with a custom solution. With this version we want to change this and give you performant helpers to handle this. If you are excited about this, you can check out this example:
- **Dark mode and css variables:** React Flow now comes with a built-in dark mode, that can be toggled by using the new `colorMode` prop (”light”, “dark” or “system”): [codesandbox](https://codesandbox.io/p/sandbox/reactflow-dark-mode-256l99)
  - Details: With this version we want to make it easier to switch between dark and light modes and give you a better starting point for dark flows. If you pass colorMode=”dark”, we add the class name “dark” to the wrapper and use it to adjust the styling. To make the implementation for this new feature easier on our ends, we switched to CSS variables for most of the styles. These variables can also be used in user land to customize a flow.

### More features and updates

There is more! Besides the new main features, we added some minor things that were on our list for a long time. We also started to use TS docs for better docs. We already started to add some docs for some types and hooks which should improve the developer experience.

- **`useConnection` hook:** This hook makes it possible to handle an ongoing connection. For example, you can use it for colorizing handles.
- **`onDelete` handler**: We added a combined handler for `onDeleteNodes` and `onDeleteEdges` to make it easier to react to deletions.
- **`isValidConnection` prop:** This makes it possible to implement one validation function for all connections. It also gets called for programatically added edges.
- **Controlled `viewport`:** This is definitely an advanced feature. Possible use cases are to animate the viewport or round the transform for lower res screens for example. This features brings two new props: `viewport` and `onViewportChange`.
- **`ViewportPortal` component:** This makes it possible to render elements in the viewport without the need to implement a custom node.
- **Background component**: add `patternClassName` to be able to style the background pattern by using a class name. This is useful if you want to style the background pattern with Tailwind for example.
- **`onMove` callback** gets triggered for library-invoked viewport updates (like fitView or zoom-in)
- **`deleteElements`** now returns deleted nodes and deleted edges
- add **`origin` attribute** for nodes
- add **`selectable` attribute** for edges
- Correct types for `BezierEdge`, `StepEdge`, `SmoothStepEdge` and `StraightEdge` components
- New edges created by the library only have `sourceHandle` and `targetHandle` attributes when those attributes are set. (We used to pass `sourceHandle: null` and `targetHandle: null`)
- Edges do not mount/unmount when their z-index change

### Internal changes

These changes are not really user-facing, but it could be important for folks who are working with the React Flow store:

- The biggest internal change is that we created a new package **@xyflow/system with framework agnostic helpers** that can be used be React Flow and Svelte Flow
  - **XYDrag** for handling dragging node(s) and selection
  - **XYPanZoom** for controlling the viewport panning and zooming
  - **XYHandle** for managing new connections
- We replaced the `nodeInternals` map with a `nodes` array. We added a new `nodeLookup` map that serves as a lookup, but we are not creating a new map object on any change so it’s really only useful as a lookup.
- We removed `connectionNodeId`, `connectionHandleId`, `connectionHandleType` from the store and added `connectionStartHandle.nodeId`, `connectionStartHandle.handleId`, …
- add `data-id` to edges

**With v12 the `reactflow` package was renamed to `@xyflow/react` - you can find the v11 source and the [`reactflow` changelog](https://github.com/xyflow/xyflow/blob/v11/packages/reactflow/CHANGELOG.md) on the v11 branch.**
