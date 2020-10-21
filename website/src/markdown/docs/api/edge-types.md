---
title: Edge Types & Custom Edges
---

React Flow comes with four edge types (`default`, `straight`, `step`, `smoothstep`). As the names indicate, the edges differ in the representation. The default type is a bezier edge.
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
There is an implementation of a custom edge in the [edges example](/examples/edges/).


## Custom Edge Props

Custom edges are wrapped. They receive the following props:

- `source`: string (node id)
- `target`: string (node id)
- `selected`: boolean
- `animated`: boolean
- `label`: string
- `labelStyle`: svg attributes
- `labelShowBg`: boolean
- `labelBgStyle`: svg attributes
- `labelBgPadding`: number
- `labelBgBorderRadius`: number
- `data`: object
- `style`: svg attributes
- `arrowHeadType`: 'arrow' | 'arrowclosed'
- `sourceX`: number
- `sourceY`: number
- `targetX`: number
- `targetY`: number
- `sourcePosition`: 'left' | 'top' | 'right' | 'bottom'
- `targetPosition`: 'left' | 'top' | 'right' | 'bottom'
- `markerEndId`: string