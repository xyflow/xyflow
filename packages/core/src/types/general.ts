/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  ComponentType,
  MemoExoticComponent,
} from 'react';
import type { D3DragEvent, Selection as D3Selection, SubjectPosition, ZoomBehavior } from 'd3';

import type { XYPosition, Rect, Transform, CoordinateExtent } from './utils';
import type { NodeChange, EdgeChange } from './changes';
import type {
  Node,
  NodeInternals,
  NodeDimensionUpdate,
  NodeProps,
  WrapNodeProps,
  NodeDragItem,
  NodeDragHandler,
  SelectionDragHandler,
  NodeOrigin,
} from './nodes';
import type { Edge, EdgeProps, WrapEdgeProps } from './edges';
import type { HandleType, ConnectingHandle } from './handles';
import type { DefaultEdgeOptions } from '.';
import type { ReactFlowInstance } from './instance';

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = { [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>> };
export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };
export type EdgeTypesWrapped = { [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>> };

export type FitView = (fitViewOptions?: FitViewOptions) => boolean;

export type Project = (position: XYPosition) => XYPosition;

export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;

export type OnNodesDelete = (nodes: Node[]) => void;
export type OnEdgesDelete = (edges: Edge[]) => void;

export type OnMove = (event: MouseEvent | TouchEvent, viewport: Viewport) => void;
export type OnMoveStart = OnMove;
export type OnMoveEnd = OnMove;

export type ZoomInOut = (options?: ViewportHelperFunctionOptions) => void;
export type ZoomTo = (zoomLevel: number, options?: ViewportHelperFunctionOptions) => void;
export type GetZoom = () => number;
export type GetViewport = () => Viewport;
export type SetViewport = (viewport: Viewport, options?: ViewportHelperFunctionOptions) => void;
export type SetCenter = (x: number, y: number, options?: SetCenterOptions) => void;
export type FitBounds = (bounds: Rect, options?: FitBoundsOptions) => void;

export type OnInit<NodeData = any, EdgeData = any> = (reactFlowInstance: ReactFlowInstance<NodeData, EdgeData>) => void;

export interface Connection {
  source: string | null;
  target: string | null;
  sourceHandle: string | null;
  targetHandle: string | null;
}

export type IsValidConnection = (edge: Edge | Connection) => boolean;

export type ConnectionStatus = 'valid' | 'invalid';

export enum ConnectionMode {
  Strict = 'strict',
  Loose = 'loose',
}

export type OnConnect = (connection: Connection) => void;

export type FitViewOptions = {
  padding?: number;
  includeHiddenNodes?: boolean;
  minZoom?: number;
  maxZoom?: number;
  duration?: number;
  nodes?: (Partial<Node> & { id: Node['id'] })[];
};

export type OnConnectStartParams = {
  nodeId: string | null;
  handleId: string | null;
  handleType: HandleType | null;
};

export type OnConnectStart = (event: ReactMouseEvent | ReactTouchEvent, params: OnConnectStartParams) => void;
export type OnConnectEnd = (event: MouseEvent | TouchEvent) => void;

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export type KeyCode = string | Array<string>;

export type SnapGrid = [number, number];

export enum PanOnScrollMode {
  Free = 'free',
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export type ViewportHelperFunctionOptions = {
  duration?: number;
};

export type SetCenterOptions = ViewportHelperFunctionOptions & {
  zoom?: number;
};

export type FitBoundsOptions = ViewportHelperFunctionOptions & {
  padding?: number;
};

export type UnselectNodesAndEdgesParams = {
  nodes?: Node[];
  edges?: Edge[];
};

export type OnViewportChange = (viewport: Viewport) => void;

export type ViewportHelperFunctions = {
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  zoomTo: ZoomTo;
  getZoom: GetZoom;
  setViewport: SetViewport;
  getViewport: GetViewport;
  fitView: FitView;
  setCenter: SetCenter;
  fitBounds: FitBounds;
  project: Project;
  viewportInitialized: boolean;
};

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

  d3Zoom: ZoomBehavior<Element, unknown> | null;
  d3Selection: D3Selection<Element, unknown, null, undefined> | null;
  d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
  minZoom: number;
  maxZoom: number;
  translateExtent: CoordinateExtent;
  nodeExtent: CoordinateExtent;
  nodeOrigin: NodeOrigin;

  nodesSelectionActive: boolean;
  userSelectionActive: boolean;
  userSelectionRect: SelectionRect | null;

  // @todo remove this in next major version in favor of connectionStartHandle
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
  edgesUpdatable: boolean;
  elementsSelectable: boolean;
  elevateNodesOnSelect: boolean;

  multiSelectionActive: boolean;

  connectionStartHandle: ConnectingHandle | null;
  connectionEndHandle: ConnectingHandle | null;
  // @todo this is only used for the click connection - we might remove this in the next major version
  connectionClickStartHandle: ConnectingHandle | null;

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
  panBy: (delta: XYPosition) => boolean;
};

export type ReactFlowState = ReactFlowStore & ReactFlowActions;

export type UpdateNodeInternals = (nodeId: string | string[]) => void;

export type OnSelectionChangeParams = {
  nodes: Node[];
  edges: Edge[];
};

export type OnSelectionChangeFunc = (params: OnSelectionChangeParams) => void;

export type PanelPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type ProOptions = {
  account?: string;
  hideAttribution: boolean;
};

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export enum SelectionMode {
  Partial = 'partial',
  Full = 'full',
}

export type SelectionRect = Rect & {
  startX: number;
  startY: number;
};

export type OnError = (id: string, message: string) => void;

export interface UpdateEdgeOptions {
  shouldReplaceId?: boolean;
}
