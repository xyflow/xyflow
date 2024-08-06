# @xyflow/react

## 12.0.5

### Patch Changes

- [#4501](https://github.com/xyflow/xyflow/pull/4501) [`ec64b572`](https://github.com/xyflow/xyflow/commit/ec64b57240f0c61912d4910b095210f57d8df8ce) Thanks [@moklick](https://github.com/moklick)! - fix(background): use offset prop correctly for dots variant

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
