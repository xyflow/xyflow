/*
 * Public API Surface of @xyflow/angular
 */

// Main flow component
export { AngularFlowComponent } from './lib/components/angular-flow/angular-flow.component';

// UI Components
export { BackgroundComponent } from './lib/components/background/background.component';
export { ControlsComponent } from './lib/components/controls/controls.component';
export { MiniMapComponent } from './lib/components/minimap/minimap.component';
export { PanelComponent } from './lib/components/panel/panel.component';
export { NodeWrapperComponent } from './lib/components/node-wrapper/node-wrapper.component';
export { EdgeWrapperComponent } from './lib/components/edge-wrapper/edge-wrapper.component';
export { ConnectionLineComponent } from './lib/components/connection-line/connection-line.component';
export { SelectionBoxComponent } from './lib/components/selection-box/selection-box.component';

// Directives
export { XYHandleDirective } from './lib/directives/xy-handle.directive';

// Services
export { FlowStateService } from './lib/services/flow-state.service';

// Types - export all Angular-specific types
export * from './lib/types';

// Utilities
export * from './lib/utils';

// Re-export enums and constants from our components
export { BackgroundVariant } from './lib/components/background/types';
export type { BackgroundProps } from './lib/components/background/types';

// Re-export core types from @xyflow/system for convenience
export type {
  NodeBase,
  EdgeBase,
  Connection,
  Viewport,
  Transform,
  XYPosition,
  NodeChange,
  EdgeChange,
  Position,
} from '@xyflow/system';
