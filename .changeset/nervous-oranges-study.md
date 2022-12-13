---
'@reactflow/core': minor
'@reactflow/minimap': minor
'@reactflow/node-toolbar': minor
'reactflow': minor
---

## New Features

New props for the ReactFlow component to customize the controls of the viewport and the selection box better:

1. `selectionOnDrag` prop: Selection box without extra button press (need to set `panOnDrag={false} or `panOnDrag="RightClick"`)
2. `panOnDrag="RightClick"` option
3. `panActivationKeyCode="Space"` key code for activating dragging (useful when using `selectionOnDrag`)
4. `selectionMode={SelectionMode.Full}`: you can chose if the selection box needs to contain a node fully (`SelectionMode.Full`) or partially (`SelectionMode.Partial`) to select it
5. `onSelectionStart` and `onSelectionEnd` events
