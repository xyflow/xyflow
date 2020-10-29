---
title: Edge Options
---

You create edges by adding them to your `elements` array of the `ReactFlow` component.

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
- `sourceHandle`: string (an id of a handle - you only need this when you have multiple handles)
- `targetHandle`: string (an id of a handle - you only need this when you have multiple handles)
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

You can find an example with different edges in the [edges example](/examples/edges/).
