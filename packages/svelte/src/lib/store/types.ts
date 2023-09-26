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

import type { getInitialStore } from './initial-store';
import type { Node, Edge, NodeTypes, EdgeTypes, FitViewOptions } from '$lib/types';

export type SvelteFlowStoreActions = {
  syncNodeStores: (nodesStore: Writable<Node[]>) => void;
  syncEdgeStores: (edgeStore: Writable<Edge[]>) => void;
  setNodeTypes: (nodeTypes: NodeTypes) => void;
  setEdgeTypes: (edgeTypes: EdgeTypes) => void;
  addEdge: (edge: Edge | Connection) => void;
  zoomIn: (options?: ViewportHelperFunctionOptions) => void;
  zoomOut: (options?: ViewportHelperFunctionOptions) => void;
  setMinZoom: (minZoom: number) => void;
  setMaxZoom: (maxZoom: number) => void;
  setTranslateExtent: (extent: CoordinateExtent) => void;
  fitView: (nodes: Node[], options?: FitViewOptions) => boolean;
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

export type SvelteFlowStoreState = ReturnType<typeof getInitialStore>;

export type SvelteFlowStore = SvelteFlowStoreState & SvelteFlowStoreActions;
