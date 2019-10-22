# :ocean: React Flow

React library for building node-based flow editors.

# Installation

```
npm install github:wbkd/react-flow
```

# Props

- `elements`: array with nodes and edges
- `onElementClick`: element click handler
- `onElementsRemove`: element remove handler
- `onNodeDragStop`: node drag stop handler
- `onConnect`: connect handler
- `onLoad`: editor load handler
- `onMove`: move handler
- `nodeTypes`: object with node types
- `edgeTypes`: object with node types
- `connectionLineType`: connection line type = `straight` or `bezier`
- `connectionLineStyle`: connection style as svg attributes
- `deleteKeyCode`: delete key code
- `selectionKeyCode`: selection key code
- `showBackground`: boolean
- `backgroundGap`: gap size
- `backgroundColor`: color of dots or lines
- `backgroundType`: background type = `dots` or `lines`
- `snapToGrid`: boolean
- `snapGrid`: [x, y] array

# Plugins

- Mini map
- Controls: zoom & fit view
