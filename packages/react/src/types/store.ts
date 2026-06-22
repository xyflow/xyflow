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
  /** Opt-in keyed write: patch nodes by id (O(changed) + cascaded children) straight to the internal
   *  node store, waking only the changed nodes. Position / data / style only: bypasses the nodes
   *  array, onNodesChange, z-index / selection, culling and the controlled `nodes` prop. Pair with
   *  useInternalNode / useNode for reads; drive re-parenting / selection / structural changes through
   *  setNodes. `id` and `parentId` are not patchable. */
  patchNodes: (patches: ({ id: string } & Partial<Omit<NodeType, 'id' | 'parentId'>>)[]) => void;
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
  /** @internal Per-node subscription used by the node renderer; bypasses the
   *  global notify-all fan-out. Paired with getNodeVersion for useSyncExternalStore. */
  subscribeNode: (id: string, listener: () => void) => () => void;
  /** @internal Version counter for a subscribed node; bumps when the node's
   *  internalNode reference or parent status changes. */
  getNodeVersion: (id: string) => number;
  /** @internal Per-edge subscription used by the edge renderer; fires on edge-data
   *  or endpoint-node changes. Paired with getEdgeVersion for useSyncExternalStore. */
  subscribeEdge: (id: string, listener: () => void) => () => void;
  /** @internal Version counter for a subscribed edge. */
  getEdgeVersion: (id: string) => number;
  /** @internal Node-list signal: notifies when the node id set or order changes (not on a position
   *  drag). The node renderer recomputes its visible id list from it. */
  subscribeNodesList: (listener: () => void) => () => void;
  /** @internal Edge-list signal: notifies when the edge id set or order (paint order) changes.
   *  The edge renderer recomputes its visible id list from it. */
  subscribeEdgesList: (listener: () => void) => () => void;
  /** @internal Selection signal: notifies when the set of selected nodes or edges changes.
   *  SelectionListener recomputes the selection from it. */
  subscribeSelection: (listener: () => void) => () => void;
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
