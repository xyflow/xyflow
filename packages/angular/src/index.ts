// Export types
export * from './lib/types';

// Export services
export { FlowStoreService } from './lib/services/flow-store.service';

// Export core components
export { AngularFlowComponent } from './lib/components/core/angular-flow.component';

// Export edge components
export { BaseEdgeComponent } from './lib/components/edges/base-edge.component';
export { BezierEdgeComponent } from './lib/components/edges/bezier-edge.component';
export { StraightEdgeComponent } from './lib/components/edges/straight-edge.component';
export { SmoothStepEdgeComponent } from './lib/components/edges/smooth-step-edge.component';
export { StepEdgeComponent } from './lib/components/edges/step-edge.component';

// Export plugin components
export { BackgroundComponent, BackgroundVariant } from './lib/components/plugins/background.component';
export { ControlsComponent } from './lib/components/plugins/controls.component';
export { MinimapComponent } from './lib/components/plugins/minimap.component';
export { NodeToolbarComponent } from './lib/components/plugins/node-toolbar.component';
export { PanelComponent } from './lib/components/plugins/panel.component';

// Export directives
export { HandleDirective } from './lib/directives/handle.directive';

// Re-export system utilities
export {
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
  getNodesBounds,
  getViewportForBounds,
  isNode,
  isEdge,
} from '@xyflow/system';
