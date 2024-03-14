# @xyflow/react

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
