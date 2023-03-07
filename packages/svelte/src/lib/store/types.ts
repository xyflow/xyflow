import type {
  NodeDimensionUpdate,
  XYPosition,
  ViewportHelperFunctionOptions,
  Connection,
  NodeDragItem
} from '@reactflow/system';

import type { initialStoreState } from './initial-store';
import type { Node, Edge, ConnectionData, NodeTypes, EdgeTypes } from '$lib/types';
import type { Writable } from 'svelte/store';

export type SvelteFlowStoreActions = {
  setNodeTypes: (nodeTypes: NodeTypes) => void;
  setEdgeTypes: (edgeTypes: EdgeTypes) => void;
  addEdge: (edge: Edge | Connection) => void;
  zoomIn: (options?: ViewportHelperFunctionOptions) => void;
  zoomOut: (options?: ViewportHelperFunctionOptions) => void;
  setMinZoom: (minZoom: number) => void;
  setMaxZoom: (maxZoom: number) => void;
  fitView: (options?: ViewportHelperFunctionOptions) => boolean;
  updateNodePositions: (
    nodeDragItems: NodeDragItem[],
    positionChanged?: boolean,
    dragging?: boolean
  ) => void;
  updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
  resetSelectedElements: () => void;
  addSelectedNodes: (ids: string[]) => void;
  panBy: (delta: XYPosition) => void;
  updateConnection: (connection: Partial<ConnectionData>) => void;
  cancelConnection: () => void;
};

export type SvelteFlowStoreState = typeof initialStoreState & {
  nodes: Writable<Node[]>;
  edges: Writable<Edge[]>;
};

export type SvelteFlowStore = SvelteFlowStoreState & SvelteFlowStoreActions;
