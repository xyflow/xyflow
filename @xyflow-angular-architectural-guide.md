# @xyflow/angular - Architectural & Coding Practices Guide

## Overview

This document serves as the definitive blueprint for implementing the `@xyflow/angular` package. Based on thorough analysis of the existing `@xyflow/react` and `@xyflow/svelte` implementations, it defines the architectural patterns, coding conventions, and design principles that will ensure the Angular package feels like a true, first-class member of the XYFlow ecosystem.

## A. State Management Strategy

### Core Principle: Injectable Service with RxJS Observables

The Angular implementation shall use a single, centralized `FlowStateService` as the Angular equivalent of React's Zustand store and Svelte's reactive stores.

**Key Characteristics:**
- **Single Injectable Service**: `FlowStateService` provided at component level
- **RxJS BehaviorSubjects**: For reactive state management with fine-grained subscriptions
- **Immutable Updates**: State updates follow immutable patterns like React/Svelte
- **Framework Integration**: Leverages Angular's dependency injection and reactive patterns

**Implementation Pattern:**
```typescript
@Injectable()
export class FlowStateService<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  // Core state subjects
  private nodesSubject = new BehaviorSubject<NodeType[]>([]);
  private edgesSubject = new BehaviorSubject<EdgeType[]>([]);
  private viewportSubject = new BehaviorSubject<Viewport>({ x: 0, y: 0, zoom: 1 });
  
  // Public observables
  readonly nodes$ = this.nodesSubject.asObservable();
  readonly edges$ = this.edgesSubject.asObservable();
  readonly viewport$ = this.viewportSubject.asObservable();
  
  // State update methods
  setNodes(nodes: NodeType[]): void { /* immutable update logic */ }
  setEdges(edges: EdgeType[]): void { /* immutable update logic */ }
  // ... other state management methods
}
```

## B. Data Flow Contract

### Input/Output Pattern: Angular's Reactive Forms of Props/Callbacks

Angular implementation mirrors the React props/callbacks and Svelte props/bindings pattern using Angular's `@Input()` and `@Output()` decorators.

**Data Flow Specifications:**

1. **Input Properties** (equivalent to React props):
   ```typescript
   @Input() nodes: Node[] = [];
   @Input() edges: Edge[] = [];
   @Input() nodeTypes: NodeTypes = {};
   @Input() edgeTypes: EdgeTypes = {};
   // ... other configuration inputs
   ```

2. **Output Events** (equivalent to React callbacks):
   ```typescript
   @Output() nodesChange = new EventEmitter<NodeChange[]>();
   @Output() edgesChange = new EventEmitter<EdgeChange[]>();
   @Output() onConnect = new EventEmitter<Connection>();
   @Output() onNodeClick = new EventEmitter<NodeClickEvent>();
   // ... other event emitters
   ```

3. **Two-way Binding Support** (equivalent to Svelte's `bind:`):
   ```typescript
   @Input() viewport: Viewport = { x: 0, y: 0, zoom: 1 };
   @Output() viewportChange = new EventEmitter<Viewport>();
   ```

## C. Core Abstractions Plan

### 1. Handles: Attribute Directive Pattern

**Design Decision**: Use Angular Attribute Directive `[xyHandle]` instead of component `<Handle>` for idiomatic Angular feel.

**Rationale**: 
- Angular developers expect directives for behavior modification
- Aligns with Angular Material patterns (`matTooltip`, `cdkDrag`, etc.)
- Cleaner template syntax: `<div xyHandle="source">` vs `<Handle type="source">`

**Implementation Pattern:**
```typescript
@Directive({
  selector: '[xyHandle]',
  standalone: true
})
export class XYHandleDirective implements OnInit, OnDestroy {
  @Input('xyHandle') type: HandleType = 'source';
  @Input() position: Position = Position.Top;
  @Input() id?: string;
  @Input() isConnectable: boolean = true;
  
  // Events
  @Output() onConnect = new EventEmitter<Connection>();
  
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private flowState: FlowStateService,
    @Inject('XYFLOW_NODE_ID') private nodeId: string
  ) {}
}
```

### 2. Dynamic Node/Edge Rendering: Angular's Component Outlet

**Design Decision**: Use `*ngComponentOutlet` within wrapper components for dynamic user-defined node/edge types.

**Implementation Pattern:**
```typescript
// node-wrapper.component.ts
@Component({
  template: `
    <div class="angular-flow__node" [ngClass]="nodeClasses">
      <ng-container *ngComponentOutlet="nodeComponent; injector: nodeInjector">
      </ng-container>
    </div>
  `
})
export class NodeWrapperComponent {
  @Input() node!: InternalNode;
  @Input() nodeTypes!: NodeTypes;
  
  get nodeComponent() {
    return this.nodeTypes[this.node.type] || this.nodeTypes.default;
  }
  
  get nodeInjector() {
    return Injector.create({
      providers: [
        { provide: 'XYFLOW_NODE_DATA', useValue: this.node.data },
        { provide: 'XYFLOW_NODE_ID', useValue: this.node.id }
      ],
      parent: this.parentInjector
    });
  }
}
```

### 3. Node Context: Angular's Dependency Injection

**Design Decision**: Use Angular's DI system to provide node context to child components and directives.

**Context Providers:**
```typescript
// Provide node context in NodeWrapper
providers: [
  { provide: 'XYFLOW_NODE_ID', useValue: this.node.id },
  { provide: 'XYFLOW_NODE_DATA', useValue: this.node.data },
  { provide: 'XYFLOW_NODE_CONNECTABLE', useValue: this.isConnectable }
]

// Inject in handle directive or custom node components
constructor(
  @Inject('XYFLOW_NODE_ID') private nodeId: string,
  @Inject('XYFLOW_NODE_DATA') private nodeData: any
) {}
```

## D. Public API Surface

### Exported Components
- `AngularFlowComponent` - Main flow container
- `ControlsComponent` - Zoom, fit view, lock controls
- `MiniMapComponent` - Miniature viewport overview
- `PanelComponent` - Positioned overlay container
- `BackgroundComponent` - Grid/dot background patterns

### Exported Directives
- `XYHandleDirective` - Connection handle behavior
- `ViewportPortalDirective` - Portal content to viewport layer

### Exported Services
- `FlowStateService` - Central state management
- `ReactiveFlowService` - Reactive flow instance methods (equivalent to useReactFlow)

### Exported Types
```typescript
// Re-export all system types
export * from '@xyflow/system';

// Angular-specific types
export interface AngularFlowProps<NodeType, EdgeType> { /* ... */ }
export interface NodeProps<T = any> { /* ... */ }
export interface EdgeProps<T = any> { /* ... */ }
export type NodeTypes = Record<string, Type<any>>;
export type EdgeTypes = Record<string, Type<any>>;
```

### Public API Module Structure
```typescript
// public-api.ts
export { AngularFlowComponent } from './components/angular-flow/angular-flow.component';
export { ControlsComponent } from './components/controls/controls.component';
export { MiniMapComponent } from './components/minimap/minimap.component';
export { XYHandleDirective } from './directives/xy-handle.directive';
export { FlowStateService } from './services/flow-state.service';
export { ReactiveFlowService } from './services/reactive-flow.service';

// Re-export system types and utils
export * from '@xyflow/system';
```

## E. Styling Approach

### CSS Import Strategy

**Mandatory Imports in Main Component:**
```scss
// angular-flow.component.scss
@import '@xyflow/system/dist/base.css';
@import '@xyflow/system/dist/style.css';

.angular-flow {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  // Angular-specific styling adaptations
}
```

**CSS Class Naming Convention:**
- Follow existing `react-flow__*` pattern with `angular-flow__*`
- Maintain visual consistency with React/Svelte versions
- Use Angular's ViewEncapsulation.None for global flow styles when needed

## F. File Structure and Organization

### Directory Structure
```
packages/angular/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── angular-flow/
│   │   │   ├── controls/
│   │   │   ├── minimap/
│   │   │   ├── panel/
│   │   │   └── background/
│   │   ├── directives/
│   │   │   ├── xy-handle.directive.ts
│   │   │   └── viewport-portal.directive.ts
│   │   ├── services/
│   │   │   ├── flow-state.service.ts
│   │   │   └── reactive-flow.service.ts
│   │   ├── types/
│   │   │   ├── nodes.ts
│   │   │   ├── edges.ts
│   │   │   └── general.ts
│   │   └── utils/
│   │       └── changes.ts
│   └── public-api.ts
```

## G. Framework-Specific Considerations

### 1. Change Detection Strategy
- Use `OnPush` change detection strategy for performance
- Implement immutable state updates to trigger change detection
- Use `markForCheck()` when necessary for external state changes

### 2. Lifecycle Management
- Use `OnDestroy` to clean up subscriptions and D3 instances
- Implement `OnInit` for component initialization
- Use `AfterViewInit` for DOM-dependent operations

### 3. TypeScript Configuration
- Leverage Angular's strict mode compatibility
- Use generic types extensively for type safety
- Implement proper type guards for user-defined node/edge types

### 4. Testing Strategy
- Unit tests using Angular Testing Library patterns
- Integration tests with TestBed for component testing
- E2E tests following existing Playwright patterns in the monorepo

## H. Integration with @xyflow/system

### Direct System Usage
- Import and use D3-based modules directly (XYHandle, XYPanZoom, XYDrag)
- Maintain compatibility with system's event handling patterns
- Follow existing change application patterns from React/Svelte

### Abstraction Layer
- Create Angular-specific wrappers around system functionality
- Adapt system callbacks to Angular's event emitter patterns
- Translate system state updates to RxJS observable streams

## I. Development and Build Configuration

### Build System Integration
- Follow existing Rollup configuration patterns from other packages
- Generate ESM, UMD, and Type definitions
- Maintain compatibility with Angular CLI and Nx build systems

### Peer Dependencies
```json
{
  "peerDependencies": {
    "@angular/core": "^17.0.0 || ^18.0.0",
    "@angular/common": "^17.0.0 || ^18.0.0",
    "rxjs": "^7.8.0",
    "@xyflow/system": "workspace:*"
  }
}
```

This architectural guide ensures that `@xyflow/angular` will seamlessly integrate into the XYFlow ecosystem while maintaining Angular's idiomatic patterns and developer experience expectations.