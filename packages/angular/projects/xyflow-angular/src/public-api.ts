/*
 * Public API Surfa// Edge Components
export * from './lib/components/edges';

// Portal Components
export * from './lib/components/viewport-portal';
export * from './lib/components/edge-label-renderer';

// Additional Node Componentsf @xyflow/angular
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

// Node Components
export { NodeResizerComponent } from './lib/components/node-resizer/node-resizer.component';
export { NodeResizeControlComponent } from './lib/components/node-resizer/node-resize-control.component';
export { NodeToolbarComponent } from './lib/components/node-toolbar/node-toolbar.component';

// Edge Components
export * from './lib/components/edges';

// Additional Node Components
export { NodeToolbarComponent as NodeToolbarPortalComponent } from './lib/components/node-toolbar/node-toolbar-portal.component';
export { PortalService } from './lib/components/node-toolbar/portal.service';
export { NodeIdContext } from './lib/contexts/node-id.context';

// Directives
export { XYHandleDirective } from './lib/directives/xy-handle.directive';

// Services
export { FlowStateService } from './lib/services/flow-state.service';
export { NodeConnectionsService } from './lib/services/node-connections.service';
export { NodesDataService } from './lib/services/nodes-data.service';
export { ConnectionService } from './lib/services/connection.service';
export { HandleConnectionsService } from './lib/services/handle-connections.service';
export { NodesInitializedService } from './lib/services/nodes-initialized.service';
export { InternalNodeService } from './lib/services/internal-node.service';
export { UpdateNodeInternalsService } from './lib/services/update-node-internals.service';

// Types - export all Angular-specific types
export * from './lib/types';

// Utilities
export * from './lib/utils';

// Re-export enums and constants from our components
export { BackgroundVariant } from './lib/components/background/types';
export type { BackgroundProps } from './lib/components/background/types';

// NodeResizer types
export type { NodeResizerProps, ResizeControlProps } from './lib/components/node-resizer/types';

// NodeToolbar types
export type { NodeToolbarProps } from './lib/components/node-toolbar/types';

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
