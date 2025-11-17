---
"@xyflow/angular": major
---

# Initial Release: Complete Angular Flow Implementation

This is the first major release of `@xyflow/angular`, providing a comprehensive Angular implementation of XYFlow with full feature parity to React Flow.

## 🎉 New Features

### Core Flow System

- **AngularFlowComponent**: Main flow container with viewport management, panning, zooming, and node/edge interactions
- **FlowStateService**: Centralized state management using Angular signals for reactive updates
- **Node and Edge Rendering**: Complete rendering system with lifecycle management and type support

### Node System

- **Custom Node Types**: Full support for custom node components with type safety
- **NodeResizerComponent**: Comprehensive node resizing with resize controls and handle positioning
- **NodeToolbarComponent**: Portal-based toolbar positioning with customizable placement
- **Node Interactions**: Selection, dragging, connection handling, and multi-select support

### Edge System

- **All Edge Types**: Bezier, Step, Straight, and SimpleBezier edge implementations
- **EdgeLabelRendererComponent**: Interactive HTML-based edge labels outside SVG context
- **Connection Lines**: Real-time connection line rendering during drag operations
- **Edge Interactions**: Selection, deletion, and reconnection support

### Advanced Components

- **ViewportPortalComponent**: Render components in viewport coordinate space for advanced overlays
- **BackgroundComponent**: Customizable background with dot/line patterns and color theming
- **MiniMapComponent**: Interactive minimap with node/edge visualization and styling options
- **ControlsComponent**: Built-in controls for zoom, fit view, and interaction locking
- **PanelComponent**: Flexible panel positioning for UI overlays

### Programmatic API

Complete Angular service equivalents for all React Flow hooks:

- **NodeConnectionsService**: Access and monitor node connections with reactive updates
- **NodesDataService**: Retrieve node data by ID with type safety and generics
- **ConnectionService**: Monitor connection state during drag operations
- **HandleConnectionsService**: Access handle-specific connections with filtering
- **NodesInitializedService**: Track node initialization status and progress
- **InternalNodeService**: Access internal node representations and properties
- **UpdateNodeInternalsService**: Programmatically update node dimensions and handle bounds

## 🏗️ Technical Architecture

### Framework Integration

- Built on `@xyflow/system` for shared framework-agnostic logic
- Angular 18+ with signals for reactive state management
- TypeScript with comprehensive type safety and generic support
- Dependency injection pattern for clean service architecture

### Developer Experience

- Angular-native patterns and conventions
- Computed signals for reactive data access
- Comprehensive TypeScript API with generics
- Clean public API exports with proper module structure
- Lifecycle management and automatic cleanup

### Performance & Compatibility

- Optimized rendering with change detection strategies
- Memory efficient with proper cleanup on component destruction
- Full compatibility with Angular CLI and build tools
- Tree-shakeable exports for optimal bundle sizes

## 📦 Package Structure

The package includes:

- Complete component library for all flow elements
- Service-based hook equivalents for programmatic access
- TypeScript definitions and type exports
- Comprehensive public API with re-exports from `@xyflow/system`
- Angular-specific utilities and helpers

## 🚀 Getting Started

```bash
npm install @xyflow/angular
```

```typescript
import { AngularFlowComponent } from '@xyflow/angular';

// Use in your Angular component
@Component({
  template: `
    <xyflow-angular
      [nodes]="nodes"
      [edges]="edges"
      (nodesChange)="onNodesChange($event)"
      (edgesChange)="onEdgesChange($event)">
    </xyflow-angular>
  `
})
export class MyFlowComponent {
  // Your flow implementation
}
```

This release establishes `@xyflow/angular` as a full-featured, production-ready solution for building interactive node-based applications in Angular, with complete parity to the React Flow ecosystem.
