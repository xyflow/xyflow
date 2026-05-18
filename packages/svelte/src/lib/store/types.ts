import type {
  InternalNodeUpdate,
  XYPosition,
  ViewportHelperFunctionOptions,
  Connection,
  UpdateNodePositions,
  CoordinateExtent,
  UpdateConnection,
  Viewport,
  SetCenter
} from '@xyflow/system';

import type { getInitialStore } from './initial-store.svelte';
import type { Node, Edge, NodeTypes, EdgeTypes, FitViewOptions } from '$lib/types';
import type { SvelteFlowProps } from '$lib/container/SvelteFlow';

export type SvelteFlowStoreActions<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  setNodeTypes: (nodeTypes: NodeTypes) => void;
  setEdgeTypes: (edgeTypes: EdgeTypes) => void;
  addEdge: (edge: EdgeType | Connection) => void;
  zoomIn: (options?: ViewportHelperFunctionOptions) => Promise<boolean>;
  zoomOut: (options?: ViewportHelperFunctionOptions) => Promise<boolean>;
  setMinZoom: (minZoom: number) => void;
  setMaxZoom: (maxZoom: number) => void;
  setTranslateExtent: (extent: CoordinateExtent) => void;
  fitView: (options?: FitViewOptions) => Promise<boolean>;
  setCenter: SetCenter;
  updateNodePositions: UpdateNodePositions;
  updateNodeInternals: (updates: Map<string, InternalNodeUpdate>) => void;
  unselectNodesAndEdges: (params?: { nodes?: NodeType[]; edges?: EdgeType[] }) => void;
  addSelectedNodes: (ids: string[]) => void;
  addSelectedEdges: (ids: string[]) => void;
  handleNodeSelection: (id: string, unselect?: boolean, nodeRef?: HTMLDivElement | null) => void;
  handleEdgeSelection: (id: string) => void;
  moveSelectedNodes: (direction: XYPosition, factor: number) => void;
  panBy: (delta: XYPosition) => Promise<boolean>;
  updateConnection: UpdateConnection;
  cancelConnection: () => void;
  reset(): void;
};

export type SvelteFlowRestProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Omit<
  SvelteFlowProps<NodeType, EdgeType>,
  | 'width'
  | 'height'
  | 'class'
  | 'proOptions'
  | 'selectionKey'
  | 'deleteKey'
  | 'panActivationKey'
  | 'multiSelectionKey'
  | 'zoomActivationKey'
  | 'paneClickDistance'
  | 'nodeClickDistance'
  | 'onMoveStart'
  | 'onMoveEnd'
  | 'onMove'
  | 'onnodeclick'
  | 'onnodecontextmenu'
  | 'onnodedrag'
  | 'onnodedragstart'
  | 'onnodedragstop'
  | 'onnodepointerenter'
  | 'onnodepointermove'
  | 'onnodepointerleave'
  | 'onselectionclick'
  | 'onselectioncontextmenu'
  | 'onedgeclick'
  | 'onedgecontextmenu'
  | 'onedgepointerenter'
  | 'onedgepointerleave'
  | 'onpaneclick'
  | 'onpanecontextmenu'
  | 'panOnScrollMode'
  | 'preventScrolling'
  | 'zoomOnScroll'
  | 'zoomOnDoubleClick'
  | 'zoomOnPinch'
  | 'panOnScroll'
  | 'panOnDrag'
  | 'selectionOnDrag'
  | 'connectionLineComponent'
  | 'connectionLineStyle'
  | 'connectionLineContainerStyle'
  | 'connectionLineType'
  | 'attributionPosition'
  | 'children'
  | 'nodes'
  | 'edges'
  | 'viewport'
>;

export type StoreSignals<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  props: SvelteFlowRestProps<NodeType, EdgeType>;
  width?: number;
  height?: number;
  nodes: NodeType[];
  edges: EdgeType[];
  viewport?: Viewport;
};

export type SvelteFlowStoreState<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = ReturnType<typeof getInitialStore<NodeType, EdgeType>>;

export type SvelteFlowStore<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = SvelteFlowStoreState<NodeType, EdgeType> & SvelteFlowStoreActions<NodeType, EdgeType>;

export type StoreContext<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  getStore: () => SvelteFlowStore<NodeType, EdgeType>;
  provider: boolean;
};

export type ProviderContext<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = StoreContext<NodeType, EdgeType> & {
  setStore: (store: SvelteFlowStore<NodeType, EdgeType>) => void;
};
