---
title: Styling
---

There are two ways how you can style the graph pane and the elements.
You can create your own CSS rules or pass style properties to the components.

## Using Class Names

Since we are rendering DOM nodes you can simply overwrite the styles with your own CSS rules.
The React Flow wrapper has the className `react-flow`. If you want to change the graph background for example you can do:

```css
.react-flow {
  background: red;
}
```

### Used Class Names

* `.react-flow` - Outer container
* `.react-flow__renderer` - Inner container
* `.react-flow__zoompane` - Zoom & pan pane
* `.react-flow__selectionpane` - Selection pane
* `.react-flow__selection` - User selection
* `.react-flow__edges` - Edges wrapper
* `.react-flow__edge` - Edge element
  * `.selected` is added when edge is selected
  * `.animated` is added when edge is animated
* `.react-flow__edge-path` - Edge element path
* `.react-flow__edge-text` - Edge text
* `.react-flow__edge-textbg` - Edge text background
* `.react-flow__connection` - Connection line
* `.react-flow__connection-path` - Connection line path
* `.react-flow__nodes` - Nodes wrapper
* `.react-flow__node` - Node element
  * `.selected` is added when edge is selected
  * `-${type}` is added (`.react-flow__node-default`, `.react-flow__node-input`, `.react-flow__node-output`)
* `.react-flow__nodesselection` - Nodes selection
* `.react-flow__nodesselection-rect ` - Nodes selection rect
* `.react-flow__handle` - Handle component
  * `.react-flow__handle-bottom` is added when position = 'bottom'
  * `.react-flow__handle-top` is added when position = 'top'
  * `.react-flow__handle-left` is added when position = 'left'
  * `.react-flow__handle-right` is added when position = 'right'
  * `.react-flow__handle-connecting` is added when connection line is above a handle
  * `.react-flow__handle-valid` is added when connection line is above a handle and the connection is valid
* `.react-flow__background` - Background component
* `.react-flow__minimap` - Mini map component
* `.react-flow__controls` - Controls component

## Using Properties

You could achieve the same effect by passing a style prop to the `ReactFlow` component:

```jsx
const style = {
  background: 'red',
  width: '100%',
  height: 300
};

const FlowWithRedBg = (
  <ReactFlow
    elements={elements}
    style={style}
  />
);
```