# Angular Flow Examples

This directory contains comprehensive examples demonstrating all features of @xyflow/angular.

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`.

## Examples

### 1. Basic Example

**Route:** `/` or `/basic`

**Features:**
- Basic node and edge rendering
- Pan and zoom interactions
- Background pattern (dots)
- Controls for zoom and fit view
- Minimap for overview
- Info panel with statistics

**Key Concepts:**
- Setting up AngularFlowComponent
- Adding Background, Controls, and Minimap
- Using signals for reactive state
- Handling node and edge changes

### 2. Custom Nodes

**Route:** `/custom-nodes`

**Features:**
- Custom styled nodes with rich content
- Custom handle positioning
- Selection states
- Different node types

**Key Concepts:**
- Creating custom node components
- Using HandleDirective for connection points
- Passing data to custom nodes
- Styling nodes based on state

### 3. Edge Types

**Route:** `/edge-types`

**Features:**
- Bezier edges (smooth curves)
- Straight edges (direct lines)
- Step edges (right angles)
- Smooth step edges (smoothed right angles)
- Edge markers (arrows)

**Key Concepts:**
- Using different edge types
- Configuring edge appearance
- Adding markers to edges
- Edge styling

### 4. Interactive

**Route:** `/interactive`

**Features:**
- Add nodes dynamically
- Delete selected nodes/edges
- Clear all elements
- Change background pattern
- Real-time statistics
- Full CRUD operations

**Key Concepts:**
- Programmatic node/edge manipulation
- Using flow instance methods
- Event handling (click, select)
- Dynamic state updates
- User interactions

## Project Structure

```
examples/angular/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # Main app with navigation
│   │   ├── app.routes.ts             # Route configuration
│   │   └── examples/                 # Example components
│   │       ├── basic-example/        # Basic features demo
│   │       ├── custom-nodes/         # Custom node components
│   │       ├── edge-types/           # Edge type demonstrations
│   │       └── interactive/          # Interactive features
│   ├── index.html
│   ├── main.ts
│   └── styles.css                    # Global styles
├── angular.json                      # Angular CLI configuration
├── package.json
└── tsconfig.json
```

## Key Files

### app.component.ts

Main application component with sidebar navigation:

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <nav class="sidebar">...</nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent { }
```

### Example Component Pattern

All examples follow this pattern:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AngularFlowComponent, ...plugins],
  template: `
    <angular-flow
      [nodes]="nodes()"
      [edges]="edges()"
      (onNodesChange)="onNodesChange($event)"
    >
      <angular-flow-background />
      <angular-flow-controls />
    </angular-flow>
  `
})
export class ExampleComponent {
  nodes = signal<AngularNode[]>([...]);
  edges = signal<AngularEdge[]>([...]);

  onNodesChange(changes: NodeChange[]) {
    this.nodes.update(nodes => applyNodeChanges(changes, nodes));
  }
}
```

## Common Patterns

### 1. State Management with Signals

```typescript
import { signal } from '@angular/core';

nodes = signal<AngularNode[]>([]);
edges = signal<AngularEdge[]>([]);

// Update state
this.nodes.update(nodes => [...nodes, newNode]);
this.edges.update(edges => edges.filter(e => e.id !== id));
```

### 2. Handling Changes

```typescript
onNodesChange(changes: NodeChange[]) {
  this.nodes.update(nodes => applyNodeChanges(changes, nodes));
}

onEdgesChange(changes: EdgeChange[]) {
  this.edges.update(edges => applyEdgeChanges(changes, edges));
}
```

### 3. Adding Connections

```typescript
onConnect(connection: Connection) {
  const newEdge: AngularEdge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source,
    target: connection.target,
  };
  this.edges.update(edges => [...edges, newEdge]);
}
```

### 4. Using Flow Instance

```typescript
flowInstance: AngularFlowInstance | null = null;

onInit(instance: AngularFlowInstance) {
  this.flowInstance = instance;
}

zoomIn() {
  this.flowInstance?.zoomIn();
}

fitView() {
  this.flowInstance?.fitView();
}
```

## Building for Production

```bash
npm run build
```

The built application will be in `dist/angular-example`.

## Development Tips

1. **Hot Reload**: Changes to components are automatically reloaded
2. **TypeScript**: Full type checking for nodes, edges, and props
3. **Signals**: Use Angular signals for reactive updates
4. **Standalone**: All components are standalone, no modules needed

## Troubleshooting

### Styles not loading

Make sure you've imported the CSS files in `styles.css`:

```css
@import '@xyflow/angular/styles/base.css';
@import '@xyflow/angular/styles/style.css';
```

### Components not rendering

Ensure you've imported all required components in your imports array.

### TypeScript errors

Check that you're using the correct types from @xyflow/angular.

## Learn More

- [Angular Flow Documentation](../../packages/angular/README.md)
- [Angular Documentation](https://angular.io)
- [xyflow GitHub](https://github.com/xyflow/xyflow)

## License

MIT
