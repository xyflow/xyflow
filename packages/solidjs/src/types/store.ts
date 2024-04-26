import {
  ConnectionMode,
  type ConnectionStatus,
  type CoordinateExtent,
  type InternalNodeUpdate,
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
  type OnSelectionDrag,
  type OnMoveStart,
  type OnMove,
  type OnMoveEnd,
  type UpdateConnection,
  type EdgeLookup,
  type ConnectionLookup,
  type NodeLookup,
  NodeChange,
  EdgeChange,
  EdgeBase,
  HandleConnection,
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
import { Writable } from '../store/initialState';
import { ReactiveMap } from '@solid-primitives/map'

export type ReactiveEdgeLookup<EdgeType extends EdgeBase = EdgeBase>  = ReactiveMap<string, EdgeType>;
export type ReactiveConnectionLookup = ReactiveMap<string, ReactiveMap<string, HandleConnection>>;

export type SolidFlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  rfId: Writable<string>;
  width: Writable<number>;
  height: Writable<number>;
  transform: Writable<Transform>;
  nodes: Writable<NodeType[]>;
  nodeLookup: ReactiveMap<string, InternalNode<NodeType>>;
  parentLookup: ReactiveMap<string, InternalNode<NodeType>[]>;
  edges: Writable<Edge[]>;
  edgeLookup: ReactiveEdgeLookup<EdgeType>;
  connectionLookup: ReactiveConnectionLookup;
  onNodesChange: Writable<OnNodesChange<NodeType> | null>;
  onEdgesChange: Writable<OnEdgesChange<EdgeType> | null>;
  hasDefaultNodes: Writable<boolean>;
  hasDefaultEdges: Writable<boolean>;
  domNode: Writable<HTMLDivElement | null>;
  paneDragging: Writable<boolean>;
  noPanClassName: Writable<string>;

  panZoom: Writable<PanZoomInstance | null>;
  minZoom: Writable<number>;
  maxZoom: Writable<number>;
  translateExtent: Writable<CoordinateExtent>;
  nodeExtent: Writable<CoordinateExtent>;
  nodeOrigin: Writable<NodeOrigin>;
  nodeDragThreshold: Writable<number>;

  nodesSelectionActive: Writable<boolean>;
  userSelectionActive: Writable<boolean>;
  userSelectionRect: Writable<SelectionRect | null>;

  connectionPosition: Writable<XYPosition>;
  connectionStatus: Writable<ConnectionStatus | null>;
  connectionMode: Writable<ConnectionMode>;

  snapToGrid: Writable<boolean>;
  snapGrid: Writable<SnapGrid>;

  nodesDraggable: Writable<boolean>;
  nodesConnectable: Writable<boolean>;
  nodesFocusable: Writable<boolean>;
  edgesFocusable: Writable<boolean>;
  edgesUpdatable: Writable<boolean>;
  elementsSelectable: Writable<boolean>;
  elevateNodesOnSelect: Writable<boolean>;
  elevateEdgesOnSelect: Writable<boolean>;
  selectNodesOnDrag: Writable<boolean>;

  multiSelectionActive: Writable<boolean>;

  connectionStartHandle: Writable<ConnectingHandle | null>;
  connectionEndHandle: Writable<ConnectingHandle | null>;
  connectionClickStartHandle: Writable<ConnectingHandle | null>;

  onNodeDragStart?: OnNodeDrag<NodeType>;
  onNodeDrag?: OnNodeDrag<NodeType>;
  onNodeDragStop?: OnNodeDrag<NodeType>;

  onSelectionDragStart?: OnSelectionDrag;
  onSelectionDrag?: OnSelectionDrag;
  onSelectionDragStop?: OnSelectionDrag;

  onMoveStart?: OnMoveStart;
  onMove?: OnMove;
  onMoveEnd?: OnMoveEnd;

  onConnect: Writable<OnConnect | undefined>;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;

  onClickConnectStart?: OnConnectStart;
  onClickConnectEnd?: OnConnectEnd;

  connectOnClick: Writable<boolean>;
  defaultEdgeOptions?: DefaultEdgeOptions;

  fitViewOnInit: Writable<boolean>;
  fitViewDone: Writable<boolean>;
  fitViewOnInitOptions: Writable<FitViewOptions | undefined>;

  onNodesDelete:Writable<OnNodesDelete<NodeType> | undefined>;
  onEdgesDelete: Writable<OnEdgesDelete<EdgeType> | undefined>;
  onDelete: Writable<OnDelete | undefined>;
  onError: Writable<OnError | undefined>;

  // event handlers
  onViewportChangeStart: Writable<OnViewportChange | undefined>;
  onViewportChange: Writable<OnViewportChange | undefined>;
  onViewportChangeEnd: Writable<OnViewportChange | undefined>;
  onBeforeDelete: Writable<OnBeforeDelete<NodeType, EdgeType> | undefined>;

  onSelectionChangeHandlers: Writable<OnSelectionChangeFunc[]>;

  ariaLiveMessage: Writable<string>;
  autoPanOnConnect: Writable<boolean>;
  autoPanOnNodeDrag: Writable<boolean>;
  connectionRadius: Writable<number>;

  isValidConnection?: IsValidConnection<EdgeType>;

  lib: Writable<string>;
  debug: Writable<boolean>;
};

export type ReactFlowActions<NodeType extends Node, EdgeType extends Edge> = {
  setNodes: (nodes: NodeType[]) => void;
  setEdges: (edges: EdgeType[]) => void;
  setDefaultNodesAndEdges: (nodes?: NodeType[], edges?: EdgeType[]) => void;
  updateNodeInternals: (updates: Map<string, InternalNodeUpdate>) => void;
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
  updateConnection: UpdateConnection;
  reset: () => void;
  triggerNodeChanges: (changes: NodeChange<NodeType>[]) => void;
  triggerEdgeChanges: (changes: EdgeChange<EdgeType>[]) => void;
  panBy: PanBy;
  fitView: (options?: FitViewOptions) => boolean;
};

export type SolidFlowState<NodeType extends Node = Node, EdgeType extends Edge = Edge> = SolidFlowStore<
  NodeType,
  EdgeType
> &
  ReactFlowActions<NodeType, EdgeType>;
