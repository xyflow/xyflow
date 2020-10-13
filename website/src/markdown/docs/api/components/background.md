---
title: Background
---

React Flow comes with two background variants: **dots** and **lines**. You can use it by passing it as a children to the `ReactFlow` component:

### Usage

```jsx
import ReactFlow, { Background } from 'react-flow-renderer';

const FlowWithBackground = () => (
  <ReactFlow elements={elements}>
    <Background
      variant="dots"
      gap={12}
      size={4}
    />
  </ReactFlow>
);
```


### Prop Types

- `variant`: string - has to be 'dots' or 'lines' - default: `dots`
- `gap`: number - the gap between the dots or lines - default: `16`
- `size`: number - the radius of the dots or the stroke width of the lines - default: `0.5`
- `color`: string - the color of the dots or lines - default: `#81818a` for dots, `#eee` for lines
- `style`: css properties
- `className`: additional class name

**Typescript:** The interface of the Background Prop Types are exported as `BackgroundProps`.