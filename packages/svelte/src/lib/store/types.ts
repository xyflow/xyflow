import type {
  InternalNodeUpdate,
  XYPosition,
  ViewportHelperFunctionOptions,
  Connection,
  UpdateNodePositions,
  CoordinateExtent,
  UpdateConnection,
  Viewport,
  PanZoomInstance,
  SnapGrid,
  SelectionRect,
  ConnectionMode,
  ConnectionLineType,
  IsValidConnection,
  MarkerProps,
  OnError,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  NodeOrigin,
  ConnectionLookup,
  SelectionMode,
  ColorModeClass
} from '@xyflow/system';

import type {
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  FitViewOptions,
  InternalNode,
  OnDelete,
  OnEdgeCreate,
  OnBeforeDelete,
  ConnectionData
} from '$lib/types';

import type { ConnectionProps } from './derived-connection';

export type SvelteFlowStoreActions = {
  addEdge: (edge: Edge | Connection) => void;
  addSelectedEdges: (ids: string[]) => void;
  addSelectedNodes: (ids: string[]) => void;
  cancelConnection: () => void;
  fitView: (options?: FitViewOptions) => boolean;
  handleNodeSelection: (id: string) => void;
  panBy: (delta: XYPosition) => boolean;
  reset(): void;
  setEdgeTypes: (edgeTypes: EdgeTypes) => void;
  setMaxZoom: (maxZoom: number) => void;
  setMinZoom: (minZoom: number) => void;
  setNodeTypes: (nodeTypes: NodeTypes) => void;
  setTranslateExtent: (extent: CoordinateExtent) => void;
  unselectNodesAndEdges: (params?: { nodes?: Node[]; edges?: Edge[] }) => void;
  updateConnection: UpdateConnection;
  updateNodeInternals: (updates: Map<string, InternalNodeUpdate>) => void;
  updateNodePositions: UpdateNodePositions;
  zoomIn: (options?: ViewportHelperFunctionOptions) => void;
  zoomOut: (options?: ViewportHelperFunctionOptions) => void;
};

export type SvelteFlowStoreState = {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  autoPanOnConnect: boolean;
  autoPanOnNodeDrag: boolean;
  colorModeClass: ColorModeClass;
  connection: ConnectionProps;
  connectionData: ConnectionData;
  connectionLineType: ConnectionLineType;
  connectionLookup: ConnectionLookup;
  connectionMode: ConnectionMode;
  connectionRadius: number;
  defaultMarkerColor: string;
  deleteKeyPressed: boolean;
  domNode: HTMLDivElement | null;
  dragging: boolean;
  edgeLookup: Map<string, Edge>;
  edgesInitialized: boolean;
  edgeTypes: EdgeTypes;
  elementsSelectable: boolean;
  fitViewOnInit: boolean;
  fitViewOnInitDone: boolean;
  fitViewOptions: FitViewOptions;
  flowId: string | null;
  height: number;
  initialized: boolean;
  isValidConnection: IsValidConnection;
  markers: MarkerProps[];
  maxZoom: number;
  minZoom: number;
  multiselectionKeyPressed: boolean;
  nodeDragThreshold: number;
  nodeExtent: CoordinateExtent;
  nodeLookup: Map<string, InternalNode>;
  nodeOrigin: NodeOrigin;
  nodesConnectable: boolean;
  nodesDraggable: boolean;
  nodesInitialized: boolean;
  nodeTypes: NodeTypes;
  onbeforedelete?: OnBeforeDelete;
  onconnect?: OnConnect;
  onconnectend?: OnConnectEnd;
  onconnectstart?: OnConnectStart;
  ondelete?: OnDelete;
  onedgecreate?: OnEdgeCreate;
  onerror: OnError;
  onlyRenderVisibleElements: boolean;
  panActivationKeyPressed: boolean;
  panZoom: PanZoomInstance | null;
  parentLookup: Map<string, InternalNode[]>;
  selectionKeyPressed: boolean;
  selectionMode: SelectionMode;
  selectionRect: SelectionRect | null;
  selectionRectMode: string | null;
  selectNodesOnDrag: boolean;
  snapGrid: SnapGrid | null;
  translateExtent: CoordinateExtent;
  viewportInitialized: boolean;
  visibleNodes: InternalNode[];
  width: number;
  zoomActivationKeyPressed: boolean;
};

type StoreToPropertyDefinitions<T> = {
  [K in keyof T]: { get: () => T[K]; set: (newValue: T[K]) => void };
};

export type SvelteFlowStoreProperties = StoreToPropertyDefinitions<
  Omit<SvelteFlowStoreState, 'visibleEdges' | 'connection'>
>;

export type SvelteFlowStore = SvelteFlowStoreState & SvelteFlowStoreActions;
