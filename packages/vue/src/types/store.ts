import type { KeyFilter } from '@vueuse/core';
import type {
  AriaLabelConfig,
  ColorMode,
  Connection,
  ConnectionMode,
  CoordinateExtent,
  Dimensions,
  HandleType,
  NodeConnection,
  PanOnScrollMode,
  PanZoomInstance,
  Rect,
  SelectionMode,
  SelectionRect,
  SnapGrid,
  Transform,
  Viewport,
  XYPosition,
  ZIndexMode,
} from '@xyflow/system';
import type { ComputedRef } from 'vue';
import type { ViewportHelper } from '../composables';
import type { EdgeChange, NodeChange, NodeDragItem } from './changes';
import type { DefaultEdgeTypes, DefaultNodeTypes, EdgeComponent, NodeComponent } from './components';
import type { ConnectionLineOptions, ConnectionLookup, ConnectionStatus, Connector } from './connection';
import type { DefaultEdgeOptions, Edge, EdgeReconnectable } from './edge';
import type { FlowExportObject, FlowProps, OnBeforeDelete } from './flow';
import type { ConnectingHandle, ValidConnectionFunc } from './handle';
import type { FlowHooks, FlowHooksEmit, FlowHooksOn } from './hooks';
import type { BuiltInNode, InternalNode, Node, NodeOrigin } from './node';

export type NodeLookup<NodeType extends Node = Node> = Map<string, InternalNode<NodeType>>;

export type EdgeLookup<EdgeType extends Edge = Edge> = Map<string, EdgeType>;

export interface UpdateNodeDimensionsParams {
  id: string;
  nodeElement: HTMLDivElement;
  forceUpdate?: boolean;
}

export interface State<NodeType extends Node = Node, EdgeType extends Edge = Edge>
  // `fitView` is omitted: the prop maps to the internal `fitViewOnInit` flag (below), keeping the store's
  // `fitView()` action from colliding with a `fitView` state ref (state spreads after actions).
  extends Omit<FlowProps<NodeType, EdgeType>, 'id' | 'nodes' | 'edges' | 'fitView'> {
  /** Vue flow element ref */
  vueFlowRef: HTMLDivElement | null;
  /** Vue flow viewport element */
  viewportRef: HTMLDivElement | null;

  /** Event hooks, you can manipulate the triggers at your own peril */
  readonly hooks: FlowHooks<NodeType, EdgeType>;

  /** all stored nodes (the user-facing `Node`s; enriched `InternalNode`s live in `nodeLookup`) */
  nodes: NodeType[];
  /** all stored edges — the user-facing `Edge`s, stored verbatim (no enriched edge representation) */
  edges: EdgeType[];

  /** id → enriched `InternalNode` (`internals`/`measured`); the canonical source for node-derived data */
  readonly nodeLookup: NodeLookup<NodeType>;
  /** parentId → map of child id → child `InternalNode`. Matches `@xyflow/system`'s `ParentLookup`. */
  readonly parentLookup: Map<string, Map<string, InternalNode<NodeType>>>;
  /** id → user-facing `Edge` */
  readonly edgeLookup: EdgeLookup<EdgeType>;
  connectionLookup: ConnectionLookup;

  /** The panzoom instance */
  panZoom: PanZoomInstance | null;

  /** use setMinZoom action to change minZoom */
  minZoom: number;
  /** use setMaxZoom action to change maxZoom */
  maxZoom: number;
  defaultViewport: Partial<Viewport>;
  /** use setTranslateExtent action to change translateExtent */
  translateExtent: CoordinateExtent;
  nodeExtent: CoordinateExtent;
  nodeOrigin: NodeOrigin;
  colorMode: ColorMode;

  /** viewport dimensions - do not change! */
  readonly dimensions: Dimensions;
  /** canonical viewport transform `[x, y, zoom]` (the `@xyflow/system` representation) - do not change! Read `viewport` for the `{ x, y, zoom }` shape. */
  readonly transform: Transform;
  /** if true will skip rendering any elements currently not inside viewport until they become visible */
  onlyRenderVisibleElements: boolean;
  nodesSelectionActive: boolean;
  userSelectionActive: boolean;
  multiSelectionActive: boolean;

  deleteKeyCode: KeyFilter | null;
  selectionKeyCode: KeyFilter | null;
  selectionOnDrag: boolean;
  multiSelectionKeyCode: KeyFilter | null;
  zoomActivationKeyCode: KeyFilter | null;
  panActivationKeyCode: KeyFilter | null;

  connectionMode: ConnectionMode;
  connectionLineOptions: ConnectionLineOptions;
  connectionStartHandle: ConnectingHandle | null;
  connectionEndHandle: ConnectingHandle | null;
  connectionClickStartHandle: ConnectingHandle | null;
  /** the raw pointer position during a connection drag (screen coords); the snapped end is `connectionEndHandle` */
  connectionPosition: XYPosition;
  connectionRadius: number;
  connectionDragThreshold: number;
  connectionStatus: ConnectionStatus | null;
  isValidConnection: ValidConnectionFunc | null;
  onBeforeDelete: OnBeforeDelete<NodeType, EdgeType> | null;

  connectOnClick: boolean;
  reconnectRadius: number;

  snapToGrid: boolean;
  snapGrid: SnapGrid;
  defaultMarkerColor: string | null;

  edgesReconnectable: EdgeReconnectable;
  edgesFocusable: boolean;

  nodesFocusable: boolean;
  nodesDraggable: boolean;
  nodesConnectable: boolean;
  nodeDragThreshold: number;

  elementsSelectable: boolean;
  selectNodesOnDrag: boolean;

  userSelectionRect: SelectionRect | null;
  selectionMode: SelectionMode;
  panOnDrag: boolean | number[];
  zoomOnScroll: boolean;
  zoomOnPinch: boolean;
  panOnScroll: boolean;
  panOnScrollSpeed: number;
  panOnScrollMode: PanOnScrollMode;
  paneClickDistance: number;
  nodeClickDistance: number;
  zoomOnDoubleClick: boolean;
  preventScrolling: boolean;
  paneDragging: boolean;

  initialized: boolean;
  autoApplyChanges: boolean;
  autoConnect: boolean | Connector;

  fitViewOnInit: boolean;
  fitViewOnInitDone: boolean;

  noDragClassName: 'nodrag' | string;
  noWheelClassName: 'nowheel' | string;
  noPanClassName: 'nopan' | string;

  defaultEdgeOptions: DefaultEdgeOptions | undefined;

  elevateEdgesOnSelect: boolean;
  elevateNodesOnSelect: boolean;
  zIndexMode: ZIndexMode;

  autoPanOnConnect: boolean;
  autoPanOnNodeDrag: boolean;
  autoPanOnNodeFocus: boolean;
  autoPanOnSelection: boolean;
  /**
   * The speed at which the viewport pans while dragging a node or a selection box.
   * @default 15
   */
  autoPanSpeed: number;

  disableKeyboardA11y: boolean;
  /** the merged aria-label / a11y text config (defaults overlaid with the `ariaLabelConfig` prop) */
  ariaLabelConfig: AriaLabelConfig;

  ariaLiveMessage: string;
}

export type SetNodes<NodeType extends Node = Node> = (nodes: NodeType[] | ((nodes: NodeType[]) => NodeType[])) => void;

export type SetEdges<EdgeType extends Edge = Edge> = (edges: EdgeType[] | ((edges: EdgeType[]) => EdgeType[])) => void;

export type AddNodes<NodeType extends Node = Node> = (
  nodes: NodeType | NodeType[] | ((nodes: NodeType[]) => NodeType | NodeType[]),
) => void;

export type RemoveNodes<NodeType extends Node = Node> = (
  nodes: (string | NodeType) | (NodeType | string)[] | ((nodes: NodeType[]) => (string | NodeType) | (NodeType | string)[]),
  removeConnectedEdges?: boolean,
  removeChildren?: boolean,
) => void;

export type RemoveEdges<EdgeType extends Edge = Edge> = (
  edges: (string | EdgeType) | (EdgeType | string)[] | ((edges: EdgeType[]) => (string | EdgeType) | (EdgeType | string)[]),
) => void;

/**
 * Delete the given nodes/edges along with their connected edges and child nodes, gated by `onBeforeDelete`.
 * Resolves to the elements actually removed. Mirrors xyflow/react's `deleteElements`.
 */
export type DeleteElements<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (elements: {
  nodes?: (Partial<NodeType> & { id: string })[];
  edges?: (Partial<EdgeType> & { id: string })[];
}) => Promise<{ deletedNodes: NodeType[]; deletedEdges: EdgeType[] }>;

export type AddEdges<EdgeType extends Edge = Edge> = (
  edgesOrConnections:
    | (EdgeType | Connection)
    | (EdgeType | Connection)[]
    | ((edges: EdgeType[]) => (EdgeType | Connection) | (EdgeType | Connection)[]),
) => void;

export type ReconnectEdge<EdgeType extends Edge = Edge> = (
  oldEdge: EdgeType,
  newConnection: Connection,
  shouldReplaceId?: boolean,
) => EdgeType | false;

export type UpdateEdge<EdgeType extends Edge = Edge> = (
  id: string,
  edgeUpdate: Partial<EdgeType> | ((edge: EdgeType) => Partial<EdgeType>),
  options?: { replace: boolean },
) => void;

export type UpdateEdgeData<EdgeType extends Edge = Edge> = (
  id: string,
  dataUpdate: Partial<EdgeType['data']> | ((edge: EdgeType) => Partial<EdgeType['data']>),
  options?: { replace: boolean },
) => void;

// `fitView` lives on `FlowProps`, not `State` (the state keeps a separate `fitViewOnInit` flag so the
// `fitView()` action isn't clobbered), but it's still a settable prop — accept it on the bridge.
export type SetStateOptions<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Partial<State<NodeType, EdgeType>>
  & Partial<Pick<FlowProps<NodeType, EdgeType>, 'fitView'>>;

export type SetState<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (
  state: SetStateOptions<NodeType, EdgeType> | ((state: State<NodeType, EdgeType>) => SetStateOptions<NodeType, EdgeType>),
) => void;

export type UpdateNodePosition = (dragItems: NodeDragItem[], changed: boolean, dragging: boolean) => void;

export type UpdateNodeDimensions = (updates: UpdateNodeDimensionsParams[]) => void;

export type UpdateNodeInternals = (nodeIds?: string[]) => void;

export type GetNode<NodeType extends Node = Node> = (id: string | undefined | null) => NodeType | undefined;

/**
 * Returns the enriched {@link InternalNode} (`internals.{positionAbsolute, z, handleBounds, userNode}` +
 * authoritative `measured`) for an id, mirroring xyflow/react's `getInternalNode`. This is the accessor
 * for store-computed data; `getNode` exposes the user-facing node.
 */
export type GetInternalNode<NodeType extends Node = Node> = (id: string | undefined | null) => InternalNode<NodeType> | undefined;

export type GetEdge<EdgeType extends Edge = Edge> = (id: string | undefined | null) => EdgeType | undefined;

export type GetIntersectingNodes<NodeType extends Node = Node> = (
  node: (Partial<NodeType> & { id: NodeType['id'] }) | Rect,
  partially?: boolean,
  nodes?: InternalNode<NodeType>[],
) => InternalNode<NodeType>[];

export type UpdateNode<NodeType extends Node = Node> = (
  id: string,
  nodeUpdate: Partial<NodeType> | ((node: InternalNode<NodeType>) => Partial<NodeType>),
  options?: { replace: boolean },
) => void;

export type UpdateNodeData<NodeType extends Node = Node> = (
  id: string,
  dataUpdate: Partial<NodeType['data']> | ((node: InternalNode<NodeType>) => Partial<NodeType['data']>),
  options?: { replace: boolean },
) => void;

export type IsNodeIntersecting<NodeType extends Node = Node> = (node: (Partial<NodeType> & { id: NodeType['id'] }) | Rect, area: Rect, partially?: boolean) => boolean;

export interface Actions<NodeType extends Node = Node, EdgeType extends Edge = Edge>
  extends Omit<ViewportHelper<NodeType>, 'viewportInitialized'> {
  /** parses nodes and re-sets the state */
  setNodes: SetNodes<NodeType>;
  /** parses edges and re-sets the state */
  setEdges: SetEdges<EdgeType>;
  /** parses nodes and adds to state */
  addNodes: AddNodes<NodeType>;
  /** parses edges and adds to state */
  addEdges: AddEdges<EdgeType>;
  /** remove nodes (and possibly connected edges and children) from state */
  removeNodes: RemoveNodes<NodeType>;
  /** remove edges from state */
  removeEdges: RemoveEdges<EdgeType>;
  /** delete nodes/edges (with connected edges + children), gated by `onBeforeDelete`; mirrors xyflow/react */
  deleteElements: DeleteElements<NodeType, EdgeType>;
  /** find a node by id */
  getNode: GetNode<NodeType>;
  /** get the enriched internal node (store-computed `internals` + `measured`) by id */
  getInternalNode: GetInternalNode<NodeType>;
  /** find an edge by id */
  getEdge: GetEdge<EdgeType>;
  /** reconnects an edge to a new source/target (connection) */
  reconnectEdge: ReconnectEdge<EdgeType>;
  /** partially updates an edge */
  updateEdge: UpdateEdge<EdgeType>;
  /** updates the data of an edge */
  updateEdgeData: UpdateEdgeData<EdgeType>;
  /** updates a node */
  updateNode: UpdateNode<NodeType>;
  /** updates the data of a node */
  updateNodeData: UpdateNodeData<NodeType>;
  /** applies default edge change handler */
  applyEdgeChanges: (changes: EdgeChange<EdgeType>[]) => EdgeType[];
  /** applies default node change handler; returns the resulting user nodes */
  applyNodeChanges: (changes: NodeChange<NodeType>[]) => NodeType[];
  /** manually select edges and add to state */
  addSelectedEdges: (edges: EdgeType[]) => void;
  /** manually select nodes and add to state */
  addSelectedNodes: (nodes: NodeType[]) => void;
  /** manually unselect edges and remove from state */
  removeSelectedEdges: (edges?: EdgeType[]) => void;
  /** manually unselect nodes and remove from state */
  removeSelectedNodes: (nodes?: NodeType[]) => void;
  /**
   * Clear the selection the way a pane click does — but only while `elementsSelectable` is `true`; otherwise
   * it's a no-op, so a selection set before selection was disabled survives. Use `removeSelectedNodes`/
   * `removeSelectedEdges` to clear unconditionally.
   */
  resetSelectedElements: () => void;
  /** apply min zoom value to panzoom */
  setMinZoom: (zoom: number) => void;
  /** apply max zoom value to panzoom */
  setMaxZoom: (zoom: number) => void;
  /** apply translate extent to panzoom */
  setTranslateExtent: (translateExtent: CoordinateExtent) => void;
  /** apply extent to nodes */
  setNodeExtent: (nodeExtent: CoordinateExtent) => void;
  setPaneClickDistance: (distance: number) => void;
  /** enable/disable node interaction (dragging, selecting etc) */
  setInteractive: (isInteractive: boolean) => void;
  /** set new state */
  setState: SetState<NodeType, EdgeType>;
  /** return an object of graph values (elements, viewport transform) for storage and re-loading a graph */
  toObject: () => FlowExportObject;
  /** force update node internal data, if handle bounds are incorrect, you might want to use this */
  updateNodeInternals: UpdateNodeInternals;
  /** start a connection */
  startConnection: (startHandle: ConnectingHandle, position?: XYPosition, isClick?: boolean) => void;
  /** update connection position */
  updateConnection: (position: XYPosition, result?: ConnectingHandle | null, status?: ConnectionStatus | null) => void;
  /** end (or cancel) a connection */
  endConnection: (event?: MouseEvent | TouchEvent, isClick?: boolean) => void;

  /** internal position updater, you probably don't want to use this */
  updateNodePositions: UpdateNodePosition;
  /** internal dimensions' updater, you probably don't want to use this */
  updateNodeDimensions: UpdateNodeDimensions;

  /** returns all node intersections */
  getIntersectingNodes: GetIntersectingNodes<NodeType>;
  /** check if a node is intersecting with a defined area */
  isNodeIntersecting: IsNodeIntersecting<NodeType>;
  /** get a node's connected edges (accepts any nodes — it matches by id; output is the flow's `EdgeType`) */
  getConnectedEdges: (nodes: Node[]) => EdgeType[];
  /** get all connections of a handle belonging to a node */
  getHandleConnections: ({ id, type, nodeId }: { id?: string | null; type: HandleType; nodeId: string }) => NodeConnection[];
  /** pan the viewport; return indicates if a transform has happened or not */
  panBy: (delta: XYPosition) => Promise<boolean>;
  /** whether the viewport (panzoom) is initialized — `true` once `<ZoomPane>` has mounted and measured */
  viewportInitialized: ComputedRef<boolean>;

  /** reset state to defaults */
  $reset: () => void;

  /** destroy the store instance (invalidates its effect scopes); runs the `onDestroy` hook if one was set */
  $destroy: () => void;
}

export interface Getters<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  /** returns object containing current edge types */
  getEdgeTypes: Record<keyof DefaultEdgeTypes | string, EdgeComponent<EdgeType>>;
  /** returns object containing current node types */
  getNodeTypes: Record<keyof DefaultNodeTypes | string, NodeComponent<NodeType | BuiltInNode>>;
  /** all visible nodes (user-facing `Node`s; use `getInternalNode`/`nodeLookup` for enriched data) */
  getNodes: readonly NodeType[];
  // the returned list is `readonly` — change nodes via setNodes/updateNode/applyNodeChanges (an in-place
  // mutation to a node read here won't propagate). NOTE: shallow `readonly`, not `DeepReadonly`: the latter
  // recurses into `Edge.label`'s VNode/Component types and trips TS2589 on a plain `.filter()` (#1886).
  /** all visible edges (user-facing `Edge`s) */
  getEdges: readonly EdgeType[];
  /** returns all currently selected nodes (user-facing `Node`s) */
  getSelectedNodes: readonly NodeType[];
  /** returns all currently selected edges */
  getSelectedEdges: readonly EdgeType[];
  /** the viewport as `{ x, y, zoom }`, derived from the canonical `transform` — read-only; set via `setViewport`/`zoom*`/`fitView` */
  viewport: Viewport;
}

export type ComputedGetters<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  [key in keyof Getters<NodeType, EdgeType>]: ComputedRef<Getters<NodeType, EdgeType>[key]>
};

/**
 * The reactive state object returned by {@link useStore} — every {@link State} field plus the lookups,
 * read directly (`store.nodes`, no `.value`, like `xyflow/svelte`'s store / a Pinia store). Use
 * `storeToRefs(useStore())` to destructure scalar/array fields as refs.
 */
export type VueFlowState<NodeType extends Node = Node, EdgeType extends Edge = Edge> = State<NodeType, EdgeType>;

/**
 * The curated instance returned by {@link useVueFlow} — actions, computed getters, and event hooks
 * (mirrors `useReactFlow` / `useSvelteFlow`). Raw reactive state lives on {@link useStore} instead.
 */
export type VueFlowInstance<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  readonly id: string;
  readonly emits: FlowHooksEmit<NodeType, EdgeType>;
  /** tear the store down (internal) */
  $destroy: () => void;
} & FlowHooksOn<NodeType, EdgeType>
& Readonly<ComputedGetters<NodeType, EdgeType>>
& Readonly<Actions<NodeType, EdgeType>>;

/** Internal handle bundling the two views a created store exposes; provided to descendants. */
export interface VueFlowStoreHandle<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  instance: VueFlowInstance<NodeType, EdgeType>;
  state: VueFlowState<NodeType, EdgeType>;
}
