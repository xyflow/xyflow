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
  EdgeBase,
  HandleConnection,
  InternalNodeBase,
  NodeBase,
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
import { ReactiveStore, Writable } from '../store/initialState';
import { ReactiveMap } from '@solid-primitives/map';

export type ReactiveEdgeLookup<EdgeType extends EdgeBase = EdgeBase> = ReactiveMap<string, EdgeType>;
export type ReactiveConnectionLookup = ReactiveMap<string, ReactiveMap<string, HandleConnection>>;

type ConnectionStartHandle = Writable<(Pick<Handle, 'nodeId' | 'id'> & Required<Pick<Handle, 'type'>>) | null>;

export type SolidFlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  rfId: Writable<string>;
  width: Writable<number>;
  height: Writable<number>;
  transform: Writable<Transform>;
  nodes: Writable<NodeType[]>;
  nodesInitialized: Writable<boolean>;
  nodeLookup: ReactiveMap<string, InternalNode<NodeType>>;
  parentLookup: ReactiveMap<string, ReactiveMap<string, InternalNodeBase<NodeBase>>>;
  edges: Writable<EdgeType[]>;
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

  connection: ReactiveStore<ConnectionState<InternalNode<NodeType>>>;
  connectionMode: Writable<ConnectionMode>;
  connectionClickStartHandle: ConnectionStartHandle;

  snapToGrid: Writable<boolean>;
  snapGrid: Writable<SnapGrid>;

  nodesDraggable: Writable<boolean>;
  nodesConnectable: Writable<boolean>;
  nodesFocusable: Writable<boolean>;
  edgesFocusable: Writable<boolean>;
  edgesReconnectable: Writable<boolean>;
  elementsSelectable: Writable<boolean>;
  elevateNodesOnSelect: Writable<boolean>;
  elevateEdgesOnSelect: Writable<boolean>;
  selectNodesOnDrag: Writable<boolean>;

  multiSelectionActive: Writable<boolean>;

  onNodeDragStart?: OnNodeDrag<NodeType>;
  onNodeDrag?: OnNodeDrag<NodeType>;
  onNodeDragStop?: OnNodeDrag<NodeType>;

  onSelectionDragStart?: OnSelectionDrag;
  onSelectionDrag?: OnSelectionDrag;
  onSelectionDragStop?: OnSelectionDrag;

  onMoveStart: Writable<OnMoveStart | undefined>;
  onMove: Writable<OnMove | undefined>;
  onMoveEnd: Writable<OnMoveEnd | undefined>;

  onConnect: Writable<OnConnect | undefined>;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;

  onClickConnectStart?: OnConnectStart;
  onClickConnectEnd?: OnConnectEnd;

  connectOnClick: Writable<boolean>;
  defaultEdgeOptions?: DefaultEdgeOptions;

  fitViewQueued: Writable<boolean>;
  fitViewOptions: Writable<FitViewOptions | undefined>;
  fitViewResolver: Writable<ReturnType<typeof withResolvers<boolean>> | null>;

  onNodesDelete: Writable<OnNodesDelete<NodeType> | undefined>;
  onEdgesDelete: Writable<OnEdgesDelete<EdgeType> | undefined>;
  onDelete: Writable<OnDelete | undefined>;
  onError: Writable<OnError | undefined>;

  // event handlers
  onViewportChangeStart: Writable<OnViewportChange | undefined>;
  onViewportChange: Writable<OnViewportChange | undefined>;
  onViewportChangeEnd: Writable<OnViewportChange | undefined>;
  onBeforeDelete: Writable<OnBeforeDelete<NodeType, EdgeType> | undefined>;

  onSelectionChangeHandlers: Writable<OnSelectionChangeFunc<NodeType, EdgeType>[]>;

  ariaLiveMessage: Writable<string>;
  autoPanOnConnect: Writable<boolean>;
  autoPanOnNodeDrag: Writable<boolean>;
  autoPanSpeed: Writable<number>;
  connectionRadius: Writable<number>;

  isValidConnection?: IsValidConnection<EdgeType>;

  lib: Writable<string>;
  debug: Writable<boolean>;
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
  setPaneClickDistance: (distance: number) => void;
};

export type SolidFlowState<NodeType extends Node = Node, EdgeType extends Edge = Edge> = SolidFlowStore<
  NodeType,
  EdgeType
> &
  ReactFlowActions<NodeType, EdgeType>;
