import {
  ConnectionMode,
  ConnectionStatus,
  CoordinateExtent,
  D3SelectionInstance,
  D3ZoomInstance,
  HandleType,
  NodeDimensionUpdate,
  NodeDragItem,
  NodeOrigin,
  OnConnect,
  OnError,
  OnViewportChange,
  SelectionRect,
  SnapGrid,
  StartHandle,
  Transform,
  XYPosition,
} from '@reactflow/system';

import type {
  NodeDragHandler,
  Edge,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  NodeInternals,
  OnConnectStart,
  OnConnectEnd,
  SelectionDragHandler,
  DefaultEdgeOptions,
  FitViewOptions,
  OnNodesDelete,
  OnEdgesDelete,
  OnSelectionChangeFunc,
  UnselectNodesAndEdgesParams,
  IsValidConnection,
} from '.';

export type ReactFlowStore = {
  rfId: string;
  width: number;
  height: number;
  transform: Transform;
  nodeInternals: NodeInternals;
  edges: Edge[];
  onNodesChange: OnNodesChange | null;
  onEdgesChange: OnEdgesChange | null;
  hasDefaultNodes: boolean;
  hasDefaultEdges: boolean;
  domNode: HTMLDivElement | null;
  paneDragging: boolean;
  noPanClassName: string;

  d3Zoom: D3ZoomInstance | null;
  d3Selection: D3SelectionInstance | null;
  d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
  minZoom: number;
  maxZoom: number;
  translateExtent: CoordinateExtent;
  nodeExtent: CoordinateExtent;
  nodeOrigin: NodeOrigin;

  nodesSelectionActive: boolean;
  userSelectionActive: boolean;
  userSelectionRect: SelectionRect | null;

  connectionNodeId: string | null;
  connectionHandleId: string | null;
  connectionHandleType: HandleType | null;
  connectionPosition: XYPosition;
  connectionStatus: ConnectionStatus | null;
  connectionMode: ConnectionMode;

  snapToGrid: boolean;
  snapGrid: SnapGrid;

  nodesDraggable: boolean;
  nodesConnectable: boolean;
  nodesFocusable: boolean;
  edgesFocusable: boolean;
  elementsSelectable: boolean;
  elevateNodesOnSelect: boolean;

  multiSelectionActive: boolean;

  connectionStartHandle: StartHandle | null;

  onNodeDragStart?: NodeDragHandler;
  onNodeDrag?: NodeDragHandler;
  onNodeDragStop?: NodeDragHandler;

  onSelectionDragStart?: SelectionDragHandler;
  onSelectionDrag?: SelectionDragHandler;
  onSelectionDragStop?: SelectionDragHandler;

  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;

  onClickConnectStart?: OnConnectStart;
  onClickConnectEnd?: OnConnectEnd;

  connectOnClick: boolean;
  defaultEdgeOptions?: DefaultEdgeOptions;

  fitViewOnInit: boolean;
  fitViewOnInitDone: boolean;
  fitViewOnInitOptions: FitViewOptions | undefined;

  onNodesDelete?: OnNodesDelete;
  onEdgesDelete?: OnEdgesDelete;
  onError?: OnError;

  // event handlers
  onViewportChangeStart?: OnViewportChange;
  onViewportChange?: OnViewportChange;
  onViewportChangeEnd?: OnViewportChange;

  onSelectionChange?: OnSelectionChangeFunc;

  ariaLiveMessage: string;
  autoPanOnConnect: boolean;
  autoPanOnNodeDrag: boolean;
  connectionRadius: number;

  isValidConnection?: IsValidConnection;
};

export type ReactFlowActions = {
  setNodes: (nodes: Node[]) => void;
  getNodes: () => Node[];
  setEdges: (edges: Edge[]) => void;
  setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => void;
  updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
  updateNodePositions: (nodeDragItems: NodeDragItem[] | Node[], positionChanged: boolean, dragging: boolean) => void;
  resetSelectedElements: () => void;
  unselectNodesAndEdges: (params?: UnselectNodesAndEdgesParams) => void;
  addSelectedNodes: (nodeIds: string[]) => void;
  addSelectedEdges: (edgeIds: string[]) => void;
  setMinZoom: (minZoom: number) => void;
  setMaxZoom: (maxZoom: number) => void;
  setTranslateExtent: (translateExtent: CoordinateExtent) => void;
  setNodeExtent: (nodeExtent: CoordinateExtent) => void;
  cancelConnection: () => void;
  reset: () => void;
  triggerNodeChanges: (changes: NodeChange[]) => void;
  panBy: (delta: XYPosition) => void;
};

export type ReactFlowState = ReactFlowStore & ReactFlowActions;
