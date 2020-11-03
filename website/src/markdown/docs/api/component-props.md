---
title: Prop Types
---

This is the list of prop types you can pass to the main `ReactFlow` component.

```jsx
import ReactFlow from 'react-flow-renderer';
```

### Basic Props
- `elements`: array of [nodes](/docs/api/nodes/) and [edges](/docs/api/edges/) *(required)*
- `style`: css properties
- `className`: additional class name

### Flow View
- `minZoom`: default: `0.5`
- `maxZoom`: default: `2`
- `defaultZoom`: default: `1`
- `defaultPosition`: default: `[0, 0]`
- `snapToGrid`: default: `false`
- `snapGrid`: [x, y] array - default: `[15, 15]`
- `onlyRenderVisibleNodes`: default: `true`
- `translateExtent`: [default `[[-∞, -∞], [+∞, +∞]]`](https://github.com/d3/d3-zoom#zoom_translateExtent)

### Event Handlers
- `onElementClick(event, element)`: called when user clicks node or edge
- `onElementsRemove(elements)`: called when user removes node or edge
- `onNodeDragStart(event, node)`: node drag start
- `onNodeDragStop(event, node)`: node drag stop
- `onNodeMouseEnter(event, node)`: node mouse enter
- `onNodeMouseMove(event, node)`: node mouse move
- `onNodeMouseLeave(event, node)`: node mouse leave
- `onNodeContextMenu(event, node)`: node context menu
- `onConnect({ source, target })`: called when user connects two nodes
- `onConnectStart(event, { nodeId, handleType })`: called when user starts to drag connection line
- `onConnectStop(event)`: called when user stops to drag connection line
- `onConnectEnd(event)`: called after user stops or connects nodes
- `onLoad(reactFlowInstance)`: called after flow is initialized
- `onMove(flowTransform)`: called when user is panning or zooming
- `onMoveStart(flowTransform)`: called when user starts panning or zooming
- `onMoveEnd(flowTransform)`: called when user ends panning or zooming
- `onSelectionChange(elements)`: called when user selects one or multiple elements
- `onSelectionDragStart(event, nodes)`: called when user starts to drag a selection
- `onSelectionDrag(event, nodes)`: called when user drags a selection
- `onSelectionDragStop(event, nodes)`: called when user stops to drag a selection
- `onSelectionContextMenu(event, nodes)`: called when user does a right-click on a selection
- `onPaneClick(event)`: called when user clicks directly on the canvas
- `onPaneContextMenu(event)`: called when user does a right-click on the canvas
- `onPaneScroll(event)`: called when user scrolls pane (only works when `zoomOnScroll` is set to `false)

### Interaction
- `nodesDraggable`: default: `true`. This applies to all nodes. You can also change the behavior of a specific node with the `draggable` node option
- `nodesConnectable`: default: `true`. This applies to all nodes. You can also change the behavior of a specific node with the `connectable` node option
- `elementsSelectable`: default: `true`. This applies to all elements. You can also change the behavior of a specific node with the `selectable` node option
- `zoomOnScroll`: default: `true`. Zoom the graph in and out using the mousewheel or trackpad
- `panOnScroll`: default: `false`. Move the graph while keeping the zoomlevel using mousewheel or trackpad. Overwrites `zoomOnScroll`.
- `panOnScrollSpeed`: default: `0.5`. Controls how fast the canvas is moved while using the mousewheel. Only has an effect if `panOnScroll` is enabled.
- `zoomOnDoubleClick`: default: `true`
- `selectNodesOnDrag`: default: `true`
- `paneMoveable`: default: `true` - If set to `false`, panning and zooming is disabled

### Element Customization
- `nodeTypes`: object with [node types](/docs/api/node-types/)
- `edgeTypes`: object with [edge types](/docs/api/edge-types/)
- `arrowHeadColor`: default: `#b1b1b7`

### Connection Line Options
- `connectionLineType`: connection line type = `default` (bezier), `straight`, `step`, `smoothstep`
- `connectionLineStyle`: connection style as svg attributes
- `connectionLineComponent`: [custom connection line component](/examples/custom-connectionline/)

### Keys
- `deleteKeyCode`: default: `8` (backspace)
- `selectionKeyCode`: default: `16` (shift)

**Typescript:** The interface of the ReactFlow Prop Types are exported as `ReactFlowProps`. You can use it in your code as follows:

```javascript
import { ReactFlowProps } from 'react-flow-renderer';
```
