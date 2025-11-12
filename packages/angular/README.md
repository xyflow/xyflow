# @xyflow/angular

Angular Flow is a highly customizable Angular library for building node-based editors, workflow systems, diagrams, and interactive graphs.

## Features

- 🎯 **Angular 18+ Compatible** - Built for modern Angular with signals
- 🎨 **Customizable** - Full control over node and edge rendering
- 📦 **Standalone Components** - No module imports needed
- ⚡ **Performant** - Optimized with Angular signals and change detection
- 🎭 **Multiple Edge Types** - Bezier, Straight, Step, and Smooth Step edges
- 🔧 **Rich API** - Comprehensive instance methods for programmatic control
- 🎪 **Plugin Components** - Background, Controls, Minimap, and more
- 📱 **Touch Support** - Works great on mobile devices
- ♿ **Accessible** - Keyboard navigation and screen reader support
- 💪 **TypeScript** - Full type safety out of the box

## Installation

```bash
npm install @xyflow/angular @xyflow/system
```

## Quick Start

### 1. Import the component

```typescript
import { Component, signal } from '@angular/core';
import {
  AngularFlowComponent,
  BackgroundComponent,
  ControlsComponent,
  AngularNode,
  AngularEdge,
} from '@xyflow/angular';

@Component({
  selector: 'app-flow',
  standalone: true,
  imports: [AngularFlowComponent, BackgroundComponent, ControlsComponent],
  template: `
    <angular-flow
      [nodes]="nodes()"
      [edges]="edges()"
      [width]="800"
      [height]="600"
    >
      <angular-flow-background />
      <angular-flow-controls />
    </angular-flow>
  `
})
export class FlowComponent {
  nodes = signal<AngularNode[]>([
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: '2', position: { x: 200, y: 0 }, data: { label: 'Node 2' } },
  ]);

  edges = signal<AngularEdge[]>([
    { id: 'e1-2', source: '1', target: '2' },
  ]);
}
```

### 2. Import styles

In your `styles.css`:

```css
@import '@xyflow/angular/styles/base.css';
@import '@xyflow/angular/styles/style.css';
```

## Core Concepts

### Nodes

Nodes are the primary elements in a flow. They can be positioned, selected, dragged, and connected.

```typescript
interface AngularNode {
  id: string;
  position: { x: number; y: number };
  data: any;
  type?: string;
  selected?: boolean;
  draggable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  width?: number;
  height?: number;
  // ... more properties
}
```

### Edges

Edges connect nodes together. They can be animated, styled, and have different types.

```typescript
interface AngularEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  animated?: boolean;
  selected?: boolean;
  markerStart?: string;
  markerEnd?: string;
  // ... more properties
}
```

## Components

### AngularFlowComponent

The main component that renders the flow canvas.

**Inputs:**
- `nodes` - Array of nodes
- `edges` - Array of edges
- `width` - Canvas width
- `height` - Canvas height
- `fitView` - Automatically fit all nodes in view
- `minZoom` - Minimum zoom level (default: 0.5)
- `maxZoom` - Maximum zoom level (default: 2)
- `snapToGrid` - Enable grid snapping
- `snapGrid` - Grid size for snapping
- And many more...

**Outputs:**
- `onNodesChange` - Emitted when nodes change
- `onEdgesChange` - Emitted when edges change
- `onConnect` - Emitted when nodes are connected
- `onNodeClick` - Emitted when a node is clicked
- `onEdgeClick` - Emitted when an edge is clicked
- And many more...

### BackgroundComponent

Renders a background pattern (dots, lines, or cross).

```html
<angular-flow-background
  [variant]="'dots'"
  [gap]="20"
  [size]="1"
  [color]="'#81818a'"
/>
```

### ControlsComponent

Renders zoom and fit view controls.

```html
<angular-flow-controls
  [position]="'bottom-left'"
  [showZoom]="true"
  [showFitView]="true"
  (zoomIn)="flowInstance?.zoomIn()"
  (zoomOut)="flowInstance?.zoomOut()"
  (fitView)="flowInstance?.fitView()"
/>
```

### MinimapComponent

Renders a miniature overview of the flow.

```html
<angular-flow-minimap
  [position]="'bottom-right'"
  [width]="200"
  [height]="150"
/>
```

### PanelComponent

A container for positioning custom UI elements.

```html
<angular-flow-panel [position]="'top-left'">
  <div>Your custom content</div>
</angular-flow-panel>
```

## Edge Types

Angular Flow comes with four built-in edge types:

- **Bezier** (default) - Smooth curved edges
- **Straight** - Direct straight lines
- **Step** - Right-angle steps
- **SmoothStep** - Smoothed right-angle steps

```typescript
edges = signal<AngularEdge[]>([
  { id: 'e1', source: '1', target: '2', type: 'default' },
  { id: 'e2', source: '2', target: '3', type: 'straight' },
  { id: 'e3', source: '3', target: '4', type: 'step' },
  { id: 'e4', source: '4', target: '5', type: 'smoothstep' },
]);
```

## Custom Nodes

Create custom node components by implementing a component with node props:

```typescript
@Component({
  selector: 'custom-node',
  standalone: true,
  template: `
    <div class="custom-node">
      <h3>{{ data.label }}</h3>
      <p>{{ data.description }}</p>
    </div>
  `,
  styles: [`
    .custom-node {
      padding: 10px;
      border: 2px solid #1a192b;
      border-radius: 5px;
      background: white;
    }
  `]
})
export class CustomNodeComponent {
  id!: string;
  data: any;
  selected: boolean = false;
}

// Use in your flow
nodes = signal<AngularNode[]>([
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Custom', description: 'A custom node' },
    component: CustomNodeComponent,
  },
]);
```

## State Management

Angular Flow uses Angular signals for reactive state management:

```typescript
import { signal } from '@angular/core';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/angular';

export class MyComponent {
  nodes = signal<AngularNode[]>([...]);
  edges = signal<AngularEdge[]>([...]);

  onNodesChange(changes: NodeChange[]) {
    this.nodes.update(nodes => applyNodeChanges(changes, nodes));
  }

  onEdgesChange(changes: EdgeChange[]) {
    this.edges.update(edges => applyEdgeChanges(changes, edges));
  }

  addNode() {
    this.nodes.update(nodes => [...nodes, newNode]);
  }
}
```

## Flow Instance

Get access to the flow instance for programmatic control:

```typescript
flowInstance: AngularFlowInstance | null = null;

onInit(instance: AngularFlowInstance) {
  this.flowInstance = instance;

  // Zoom
  instance.zoomIn();
  instance.zoomOut();
  instance.zoomTo(1.5);

  // Viewport
  instance.setViewport({ x: 0, y: 0, zoom: 1 });
  instance.fitView();

  // Nodes
  instance.getNode('1');
  instance.getNodes();
  instance.addNodes([newNode]);
  instance.updateNode('1', { position: { x: 100, y: 100 } });

  // Edges
  instance.getEdge('e1');
  instance.getEdges();
  instance.addEdges([newEdge]);
}
```

## Utility Functions

```typescript
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  getStepPath,
} from '@xyflow/angular';
```

## Examples

Check out the `/examples/angular` directory for comprehensive examples:

- **Basic Example** - Simple flow with nodes and edges
- **Custom Nodes** - Custom node components
- **Edge Types** - Different edge rendering styles
- **Interactive** - Interactive features and controls

## API Reference

### AngularFlowComponent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| nodes | AngularNode[] | [] | Array of nodes |
| edges | AngularEdge[] | [] | Array of edges |
| width | number | - | Canvas width |
| height | number | - | Canvas height |
| fitView | boolean | false | Auto-fit nodes in view |
| minZoom | number | 0.5 | Minimum zoom level |
| maxZoom | number | 2 | Maximum zoom level |
| snapToGrid | boolean | false | Enable grid snapping |
| snapGrid | [number, number] | [15, 15] | Grid size |
| zoomOnScroll | boolean | true | Enable zoom on scroll |
| panOnDrag | boolean | true | Enable pan on drag |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| onNodesChange | NodeChange[] | Nodes have changed |
| onEdgesChange | EdgeChange[] | Edges have changed |
| onConnect | Connection | Nodes connected |
| onNodeClick | { event, node } | Node clicked |
| onEdgeClick | { event, edge } | Edge clicked |
| onPaneClick | MouseEvent | Canvas clicked |
| onInit | AngularFlowInstance | Flow initialized |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © [xyflow](https://github.com/xyflow)

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## Support

- [Documentation](https://github.com/xyflow/xyflow)
- [GitHub Issues](https://github.com/xyflow/xyflow/issues)
- [Discussions](https://github.com/xyflow/xyflow/discussions)
