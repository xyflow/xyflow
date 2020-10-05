---
id: edges
title: Edges
---


React Flow comes with four [edge types](#edge-types--custom-edges) (`default`, `straight`, `step`, `smoothstep`). As the names indicate, the edges differ in the representation. The default type is a bezier edge. You create edges by adding them to your `elements` array of the `ReactFlow` component.

Edge example:

```js
{
  id: 'e1-2',
  type: 'straight',
  source: '1',
  target: '2',
  animated: true,
  label: 'edge label'
}
```

If you wanted to display this edge, you would need a node with id = 1 (source node) and another one with id = 2 (target node).

## Options

- `id`: string *(required)*
- `source`: string (an id of a node) *(required)*
- `target`: string (an id of a node) *(required)*
- `type`: 'default' (bezier), 'straight', 'step' and 'smoothedge' or a custom one depending on your implementation
- `animated`: boolean
- `style`: css properties for the edge line path
- `className`: additional class name
- `label`: string
- `labelStyle`: css properties for the text
- `labelShowBg`: boolean - default: `true`
- `labelBgStyle`: css properties for the text background
- `labelBgPadding`: [number, number] background rectangle padding - default: `[2, 4]`
- `labelBgBorderRadius`: number - default 2
- `arrowHeadType`: 'arrow' or 'arrowclosed' - defines the arrowhead of the edge
- `markerEndId`: custom marker end url - if this is used `arrowHeadType` gets ignored
- `isHidden`: if `true`, the edge will not be rendered
- `data`: {} you can use this to pass data to your custom edges.

You can find an example with different edges in the [edges example](https://reactflow.dev/edges).

## Edge Types & Custom Edges

The basic edge types are `default` (bezier), `straight`, `step` and `smoothstep`. The default `edgeTypes` object looks like this:

```javascript
{
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge
}
```

The keys represent the type names and the values are the edge components.
If you want to introduce a new edge type you can pass an `edgeTypes` object to the `ReactFlow` component:

```javascript
edgeTypes={{
  special: MyCustomEdge
}}
```

Now you could use the new type `special` for an edge.
The `straight`, `default` and `step` types would still be available unless you overwrote one of them.
There is an implementation of a custom edge in the [edges example](/example/src/Edges/index.js).

## Edge Utils

There are several utils that help you to create a custom edge. They are used in the [custom edge](/example/src/Edges/CustomEdge.js) example.

### `getBezierPath`

Returns the path of a bezier edge.

`getBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
}: GetBezierPathParams): string`

### `getSmoothStepPath`

Returns the path of a smooth step edge. You can set `borderRadius` = `0` to get a step edge path.

`getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  borderRadius = 5,
}: GetSmoothStepPathParams): string`

### `getEdgeCenter`

Returns the center poostion `[centerX, centerY]` of the edge.

`getEdgeCenter({ sourceX, sourceY, targetX, targetY }: GetCenterParams): [number, number, number, number]`

### `getMarkerEnd`

Returns the marker end url for displaying the arrow head.

`getMarkerEnd(arrowHeadType?: ArrowHeadType, markerEndId?: string): string`