# ComponentPanel Component

The `ComponentPanel` component has been added to the core `@xyflow/react` package as an additional component (similar to `Controls`, `MiniMap`, etc.).

## Features

- **Searchable**: Built-in search input to filter components
- **Draggable**: Components can be dragged onto the canvas
- **Customizable**: Support for custom colors, positions, and styling
- **Accessible**: Proper ARIA labels and keyboard support

## Usage

```tsx
import { ReactFlow, ComponentPanel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const components = [
  { type: 'led', label: 'LED', color: '#ff0000' },
  { type: 'resistor', label: 'Resistor', color: '#d5b597' },
  { type: 'arduino', label: 'Arduino Uno', color: '#5a9fd4' },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <ComponentPanel
        components={components}
        position="top-left"
      />
      <Controls />
      <MiniMap />
      <Background />
    </ReactFlow>
  );
}
```

## Props

### `ComponentPanelProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `components` | `ComponentDefinition[]` | `[]` | Array of component definitions to display |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'top-left'` | Position of the panel on the canvas |
| `style` | `CSSProperties` | - | Custom inline styles |
| `className` | `string` | - | Custom CSS class name |
| `searchPlaceholder` | `string` | `'Search components...'` | Placeholder text for search input |
| `emptyMessage` | `string` | `'No components found'` | Message shown when no components match search |
| `onComponentDragStart` | `(event: DragEvent, component: ComponentDefinition) => void` | - | Callback when component drag starts |

### `ComponentDefinition`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `string` | ✓ | Unique identifier for the component type |
| `label` | `string` | ✓ | Display name of the component |
| `color` | `string` | - | Background color for the component item |
| `icon` | `React.ReactNode` | - | Custom icon to display (future feature) |
| `category` | `string` | - | Category for grouping (future feature) |

## Implementation Details

### File Structure

```
packages/react/src/additional-components/ComponentPanel/
├── ComponentPanel.tsx    # Main component
├── types.ts             # TypeScript definitions
└── index.tsx           # Public exports
```

### Styles

The component panel styles are located in:
- `packages/system/src/styles/component-panel.css`

And imported in both:
- `packages/react/src/styles/style.css`
- `packages/react/src/styles/base.css`

### CSS Variables

The component panel respects the following CSS variables for theming:

- `--xy-background-color`: Panel background color
- `--xy-controls-border-color`: Border color
- `--xy-controls-border-radius`: Border radius
- `--xy-controls-box-shadow`: Box shadow
- `--xy-font-family`: Font family
- `--xy-node-color`: Text color
- `--xy-edge-selected-color-default`: Focus color for search input

## Example with Hardware Components

```tsx
import { ReactFlow, ComponentPanel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import your hardware node components
import { nodeTypes } from './hardware-nodes';

const hardwareComponents = [
  { type: 'led', label: 'LED', color: '#ff8080' },
  { type: 'resistor', label: 'Resistor', color: '#d5b597' },
  { type: 'arduinoUno', label: 'Arduino Uno', color: '#5a9fd4' },
  { type: 'servo', label: 'Servo Motor', color: '#666666' },
  { type: 'sensor', label: 'Temperature Sensor', color: '#0f3661' },
];

export default function CircuitDesigner() {
  // ... ReactFlow setup

  return (
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
      <ComponentPanel
        components={hardwareComponents}
        position="top-left"
        searchPlaceholder="Search components..."
      />
      <Controls />
    </ReactFlow>
  );
}
```

## Customization

### Custom Styling

```tsx
<ComponentPanel
  components={components}
  style={{
    width: '250px',
    maxHeight: '90vh',
  }}
  className="my-custom-panel"
/>
```

### Custom CSS

```css
.my-custom-panel {
  background: linear-gradient(to bottom, #667eea 0%, #764ba2 100%);
}

.my-custom-panel .react-flow__component-panel-item {
  border: 2px solid white;
  font-weight: bold;
}
```

## Drag and Drop Integration

The ComponentPanel automatically handles drag and drop. To complete the integration, you need to set up the drop handler in your ReactFlow component:

```tsx
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

function MyFlow() {
  const { screenToFlowPosition, addNodes } = useReactFlow();

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: `${type} node` },
    };

    addNodes(newNode);
  }, [screenToFlowPosition, addNodes]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <ReactFlow
      onDrop={onDrop}
      onDragOver={onDragOver}
      // ... other props
    >
      <ComponentPanel components={components} />
    </ReactFlow>
  );
}
```

## Future Enhancements

Potential features for future versions:

1. **Categories/Groups**: Group components by category
2. **Icons**: Support for custom icons per component
3. **Collapsible**: Allow collapsing the panel
4. **Favorites**: Pin frequently used components
5. **Recently Used**: Show recently added components
6. **Tooltips**: Show additional info on hover
7. **Keyboard Navigation**: Arrow keys to navigate components
8. **Multi-select**: Drag multiple components at once

## Migration from Example Code

If you were using the custom sidebar from the example, migration is simple:

**Before:**
```tsx
<div style={{ display: 'flex' }}>
  <div className="sidebar">
    <input value={searchQuery} onChange={...} />
    {filteredComponents.map(component => (
      <div draggable onDragStart={...}>{component.label}</div>
    ))}
  </div>
  <ReactFlow ... />
</div>
```

**After:**
```tsx
<ReactFlow ...>
  <ComponentPanel components={components} />
</ReactFlow>
```

All the search functionality, drag-and-drop, and styling is now built into the component!
