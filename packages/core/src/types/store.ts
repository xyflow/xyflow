import {
  ConnectionMode,
  type ConnectionStatus,
  type CoordinateExtent,
  type NodeDimensionUpdate,
  type UpdateNodePositions,
  type NodeOrigin,
  type OnConnect,
  type OnError,
  type OnViewportChange,
  type SelectionRect,
  type SnapGrid,
  type ConnectingHandle,
  type Transform,
  type XYPosition,
  type PanZoomInstance,
  type PanBy,
  type OnConnectStart,
  type OnConnectEnd,
  type OnNodeDrag,
  type OnSelectionDrag,
  type OnMoveStart,
  type OnMove,
  type OnMoveEnd,
  type IsValidConnection,
  type UpdateConnection,
} from '@reactflow/system';

import type {
  Edge,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  NodeInternals,
  DefaultEdgeOptions,
  FitViewOptions,
  OnNodesDelete,
  OnEdgesDelete,
  OnSelectionChangeFunc,
  UnselectNodesAndEdgesParams,
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

  panZoom: PanZoomInstance | null;
  minZoom: number;
  maxZoom: number;
  translateExtent: CoordinateExtent;
  nodeExtent: CoordinateExtent;
  nodeOrigin: NodeOrigin;

  nodesSelectionActive: boolean;
  userSelectionActive: boolean;
  userSelectionRect: SelectionRect | null;

  connectionPosition: XYPosition;
  connectionStatus: ConnectionStatus | null;
  connectionMode: ConnectionMode;

  snapToGrid: boolean;
  snapGrid: SnapGrid;

  nodesDraggable: boolean;
  nodesConnectable: boolean;
  nodesFocusable: boolean;
  edgesFocusable: boolean;
  edgesUpdatable: boolean;
  elementsSelectable: boolean;
  elevateNodesOnSelect: boolean;
  selectNodesOnDrag: boolean;

  multiSelectionActive: boolean;

  connectionStartHandle: ConnectingHandle | null;
  connectionEndHandle: ConnectingHandle | null;
  connectionClickStartHandle: ConnectingHandle | null;

  onNodeDragStart?: OnNodeDrag;
  onNodeDrag?: OnNodeDrag;
  onNodeDragStop?: OnNodeDrag;

  onSelectionDragStart?: OnSelectionDrag;
  onSelectionDrag?: OnSelectionDrag;
  onSelectionDragStop?: OnSelectionDrag;

  onMoveStart?: OnMoveStart;
  onMove?: OnMove;
  onMoveEnd?: OnMoveEnd;

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

  lib: string;
};

export type ReactFlowActions = {
  setNodes: (nodes: Node[]) => void;
  getNodes: () => Node[];
  setEdges: (edges: Edge[]) => void;
  setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => void;
  updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
  updateNodePositions: UpdateNodePositions;
  resetSelectedElements: () => void;
  unselectNodesAndEdges: (params?: UnselectNodesAndEdgesParams) => void;
  addSelectedNodes: (nodeIds: string[]) => void;
  addSelectedEdges: (edgeIds: string[]) => void;
  setMinZoom: (minZoom: number) => void;
  setMaxZoom: (maxZoom: number) => void;
  setTranslateExtent: (translateExtent: CoordinateExtent) => void;
  setNodeExtent: (nodeExtent: CoordinateExtent) => void;
  cancelConnection: () => void;
  // @todo can this be reused by system?
  updateConnection: UpdateConnection;
  reset: () => void;
  triggerNodeChanges: (changes: NodeChange[]) => void;
  panBy: PanBy;
};

export type ReactFlowState = ReactFlowStore & ReactFlowActions;
