import type { Writable } from 'svelte/store';
import type {
  NodeDimensionUpdate,
  XYPosition,
  ViewportHelperFunctionOptions,
  Connection,
  UpdateNodePositions,
  CoordinateExtent,
  UpdateConnection
} from '@xyflow/system';

import type { initialStoreState } from './initial-store';
import type { Node, Edge, NodeTypes, EdgeTypes, FitViewOptions } from '$lib/types';

export type SvelteFlowStoreActions = {
  setNodeTypes: (nodeTypes: NodeTypes) => void;
  setEdgeTypes: (edgeTypes: EdgeTypes) => void;
  addEdge: (edge: Edge | Connection) => void;
  zoomIn: (options?: ViewportHelperFunctionOptions) => void;
  zoomOut: (options?: ViewportHelperFunctionOptions) => void;
  setMinZoom: (minZoom: number) => void;
  setMaxZoom: (maxZoom: number) => void;
  setTranslateExtent: (extent: CoordinateExtent) => void;
  fitView: (options?: FitViewOptions) => boolean;
  updateNodePositions: UpdateNodePositions;
  updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
  unselectNodesAndEdges: () => void;
  addSelectedNodes: (ids: string[]) => void;
  addSelectedEdges: (ids: string[]) => void;
  panBy: (delta: XYPosition) => boolean;
  updateConnection: UpdateConnection;
  cancelConnection: () => void;
  reset(): void;
};

export type SvelteFlowStoreState = typeof initialStoreState & {
  nodes: Writable<Node[]>;
  edges: Writable<Edge[]>;
};

export type SvelteFlowStore = SvelteFlowStoreState & SvelteFlowStoreActions;
