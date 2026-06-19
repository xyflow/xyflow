/**
 * Vue Flow
 * @module vue-flow
 */

export * from './components/Background';

export * from './components/Controls';

export { default as BaseEdge } from './components/Edges/BaseEdge.vue';

export { default as BezierEdge } from './components/Edges/BezierEdge';

export { default as EdgeLabelRenderer } from './components/Edges/EdgeLabelRenderer.vue';
export { default as EdgeText } from './components/Edges/EdgeText.vue';
export { default as SimpleBezierEdge } from './components/Edges/SimpleBezierEdge';
export { getSimpleBezierPath } from './components/Edges/SimpleBezierEdge';
export { default as SmoothStepEdge } from './components/Edges/SmoothStepEdge';
export { default as StepEdge } from './components/Edges/StepEdge';
export { default as StraightEdge } from './components/Edges/StraightEdge';
export { default as Handle } from './components/Handle/Handle.vue';

export * from './components/MiniMap';
export * from './components/NodeResizer';
export * from './components/NodeToolbar';
export { default as Panel } from './components/Panel/Panel.vue';
export { storeToRefs } from './composables/storeToRefs';

export { useConnection } from './composables/useConnection';
export { useEdge } from './composables/useEdge';

export { useEdgesData } from './composables/useEdgesData';

export { useHandle } from './composables/useHandle';

export { useInternalNode } from './composables/useInternalNode';

export { useKeyPress } from './composables/useKeyPress';

export { useNode } from './composables/useNode';
export { useNodeConnections } from './composables/useNodeConnections';
export { useNodeId } from './composables/useNodeId';
export { useNodesData } from './composables/useNodesData';
export { useNodesInitialized } from './composables/useNodesInitialized';

export { useStore } from './composables/useStore';
export { useVueFlow } from './composables/useVueFlow';
export { default as VueFlow } from './container/VueFlow/VueFlow.vue';
export { default as VueFlowProvider } from './container/VueFlowProvider/VueFlowProvider.vue';
export { NodeId as NodeIdInjection, VueFlow as VueFlowInjection } from './context';
export * from './types';
/**
 * @deprecated Prefer the store instance's `applyChanges`/`applyNodeChanges`/`applyEdgeChanges` (from
 * `useVueFlow`, or the instance received by `onInit`). Kept for the options API.
 */
export { applyChanges, applyEdgeChanges, applyNodeChanges } from './utils/changes';
export { defaultEdgeTypes, defaultNodeTypes } from './utils/defaultNodesEdges';
export { ErrorCode, isErrorOfType, VueFlowError } from './utils/errors';
export { connectionExists, isEdge, isInternalNode, isNode } from './utils/graph';

// re-export these utils from system
export { getBezierEdgeCenter, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/system';

// re-export graph utils
export {
  clamp,
  getBoundsOfBoxes,
  getBoundsOfRects,
  getConnectedEdges,
  getConnectionStatus,
  getIncomers,
  getMarkerId,
  getNodesBounds,
  getNodesInside,
  getOutgoers,
  getViewportForBounds,
  isEdgeBase,
  isInternalNodeBase,
  isMacOs,
  isNodeBase,
  pointToRendererPoint,
  rendererPointToPoint,
} from '@xyflow/system';

export {
  type Align,
  type AriaLabelConfig,
  type ColorMode,
  type ColorModeClass,
  type Connection,
  ConnectionLineType,
  ConnectionMode,
  type CoordinateExtent,
  type Dimensions,
  type EdgeRemoveChange,
  type EdgeSelectionChange,
  type FinalConnectionState,
  type FitViewOptionsBase as FitViewOptions,
  type GetViewport,
  type HandleType,
  type NodeConnection,
  type NodeDimensionChange,
  type NodePositionChange,
  type NodeRemoveChange,
  type NodeSelectionChange,
  type Padding,
  type PaddingUnit,
  type PaddingWithUnit,
  PanOnScrollMode,
  Position,
  type Project,
  type Rect,
  // value export (it's a runtime enum) — keeps `ResizeControlVariant.Line/.Handle` usable as a value, not
  // type-only, at the package root (mirrors xyflow/react #4947; `export *` via NodeResizer downgraded it)
  ResizeControlVariant,
  SelectionMode,
  type SelectionRect,
  type SetCenter,
  type SetCenterOptions,
  type SetViewport,
  type SnapGrid,
  type Viewport,
  type ViewportHelperFunctionOptions,
  type XYPosition,
  type ZIndexMode,
  type ZoomInOut,
  type ZoomTo,
} from '@xyflow/system';
