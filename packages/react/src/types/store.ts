import {
  ConnectionMode,
  withResolvers,
  type ConnectionState,
  type CoordinateExtent,
  type InternalNodeUpdate,
  type UpdateNodePositions,
  type NodeOrigin,
  type OnConnect,
  type OnError,
  type OnViewportChange,
  type SelectionRect,
  type SnapGrid,
  type Handle,
  type Transform,
  type PanZoomInstance,
  type PanBy,
  type OnConnectStart,
  type OnConnectEnd,
  type OnSelectionDrag,
  type OnMoveStart,
  type OnMove,
  type OnMoveEnd,
  type UpdateConnection,
  type EdgeLookup,
  type ConnectionLookup,
  type NodeLookup,
  type NodeChange,
  type EdgeChange,
  type ParentLookup,
  type AriaLabelConfig,
  type SetCenter,
  type ZIndexMode,
} from '@xyflow/system';

import type {
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  DefaultEdgeOptions,
  FitViewOptions,
  OnNodesDelete,
  OnEdgesDelete,
  OnSelectionChangeFunc,
  UnselectNodesAndEdgesParams,
  OnDelete,
  OnNodeDrag,
  OnBeforeDelete,
  IsValidConnection,
  InternalNode,
} from '.';

export type ReactFlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  rfId: string;
  width: number;
  height: number;
  transform: Transform;
  nodes: NodeType[];
  nodesInitialized: boolean;
  nodeLookup: NodeLookup<InternalNode<NodeType>>;
  parentLookup: ParentLookup<InternalNode<NodeType>>;
  edges: EdgeType[];
  edgeLookup: EdgeLookup<EdgeType>;
  connectionLookup: ConnectionLookup;
  onNodesChange: OnNodesChange<NodeType> | null;
  onEdgesChange: OnEdgesChange<EdgeType> | null;
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
  nodeDragThreshold: number;
  connectionDragThreshold: number;

  nodesSelectionActive: boolean;
  userSelectionActive: boolean;
  userSelectionRect: SelectionRect | null;

  connection: ConnectionState<InternalNode<NodeType>>;
  connectionMode: ConnectionMode;
  connectionClickStartHandle: (Pick<Handle, 'nodeId' | 'id'> & Required<Pick<Handle, 'type'>>) | null;

  snapToGrid: boolean;
  snapGrid: SnapGrid;

  nodesDraggable: boolean;
  autoPanOnNodeFocus: boolean;
  nodesConnectable: boolean;
  nodesFocusable: boolean;
  edgesFocusable: boolean;
  edgesReconnectable: boolean;
  elementsSelectable: boolean;
  elevateNodesOnSelect: boolean;
  elevateEdgesOnSelect: boolean;
  selectNodesOnDrag: boolean;

  multiSelectionActive: boolean;

  onNodeDragStart?: OnNodeDrag<NodeType>;
  onNodeDrag?: OnNodeDrag<NodeType>;
  onNodeDragStop?: OnNodeDrag<NodeType>;

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

  fitViewQueued: boolean;
  fitViewOptions: FitViewOptions | undefined;
  fitViewResolver: ReturnType<typeof withResolvers<boolean>> | null;

  onNodesDelete?: OnNodesDelete<NodeType>;
  onEdgesDelete?: OnEdgesDelete<EdgeType>;
  onDelete?: OnDelete;
  onError?: OnError;

  // event handlers
  onViewportChangeStart?: OnViewportChange;
  onViewportChange?: OnViewportChange;
  onViewportChangeEnd?: OnViewportChange;
  onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType>;

  onSelectionChangeHandlers: OnSelectionChangeFunc<NodeType, EdgeType>[];

  ariaLiveMessage: string;
  autoPanOnConnect: boolean;
  autoPanOnNodeDrag: boolean;
  autoPanSpeed: number;
  connectionRadius: number;

  isValidConnection?: IsValidConnection<EdgeType>;

  lib: string;
  debug: boolean;
  ariaLabelConfig: AriaLabelConfig;

  zIndexMode: ZIndexMode;
  onNodesChangeMiddlewareMap: Map<symbol, (changes: NodeChange<NodeType>[]) => NodeChange<NodeType>[]>;
  onEdgesChangeMiddlewareMap: Map<symbol, (changes: EdgeChange<EdgeType>[]) => EdgeChange<EdgeType>[]>;
};

export type ReactFlowActions<NodeType extends Node, EdgeType extends Edge> = {
  setNodes: (nodes: NodeType[]) => void;
  setEdges: (edges: EdgeType[]) => void;
  setDefaultNodesAndEdges: (nodes?: NodeType[], edges?: EdgeType[]) => void;
  updateNodeInternals: (updates: Map<string, InternalNodeUpdate>, params?: { triggerFitView: boolean }) => void;
  updateNodePositions: UpdateNodePositions;
  resetSelectedElements: () => void;
  unselectNodesAndEdges: (params?: UnselectNodesAndEdgesParams<NodeType, EdgeType>) => void;
  addSelectedNodes: (nodeIds: string[]) => void;
  addSelectedEdges: (edgeIds: string[]) => void;
  setMinZoom: (minZoom: number) => void;
  setMaxZoom: (maxZoom: number) => void;
  setTranslateExtent: (translateExtent: CoordinateExtent) => void;
  setNodeExtent: (nodeExtent: CoordinateExtent) => void;
  cancelConnection: () => void;
  updateConnection: UpdateConnection<InternalNode<NodeType>>;
  reset: () => void;
  triggerNodeChanges: (changes: NodeChange<NodeType>[]) => void;
  triggerEdgeChanges: (changes: EdgeChange<EdgeType>[]) => void;
  panBy: PanBy;
  setCenter: SetCenter;
};

export type ReactFlowState<NodeType extends Node = Node, EdgeType extends Edge = Edge> = ReactFlowStore<
  NodeType,
  EdgeType
> &
  ReactFlowActions<NodeType, EdgeType>;
