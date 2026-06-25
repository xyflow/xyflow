import type { KeyFilter } from '@vueuse/core';
import type {
  AriaLabelConfig,
  ColorMode,
  Connection,
  ConnectionMode,
  CoordinateExtent,
  FitViewOptionsBase,
  PanOnScrollMode,
  SelectionMode,
  SnapGrid,
  Viewport,
  ZIndexMode,
} from '@xyflow/system';
import type { CSSProperties } from 'vue';
import type { VueFlowError } from '../utils';
import type { EdgeChange, NodeChange } from './changes';
import type { EdgeTypesObject, NodeTypesObject } from './components';
import type { ConnectionLineOptions, ConnectionLineProps, Connector, OnConnectStartParams } from './connection';
import type { DefaultEdgeOptions, Edge, EdgeProps, EdgeReconnectable } from './edge';
import type { ValidConnectionFunc } from './handle';
import type {
  ConnectEndEvent,
  EdgeMouseEvent,
  EdgeReconnectEndEvent,
  EdgeReconnectEvent,
  EdgeReconnectStartEvent,
  MouseTouchEvent,
  NodeDragEvent,
  NodeMouseEvent,
  SelectionChangeEvent,
} from './hooks';
import type { Node, NodeOrigin, NodeProps } from './node';
import type { VueFlowInstance } from './store';

/**
 * Consulted before nodes/edges are deleted (via the delete key or `deleteElements`). Receives the full set
 * about to be removed (the targeted nodes/edges plus connected edges and child nodes). Return `false` to
 * cancel, `true` to delete that set, or `{ nodes, edges }` to delete only a subset. Mirrors xyflow/react.
 */
export type OnBeforeDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (params: {
  nodes: NodeType[];
  edges: EdgeType[];
}) => Promise<boolean | { nodes: NodeType[]; edges: EdgeType[] }>;

export interface CustomThemeVars {
  [key: string]: string | number | undefined;
}

/**
 * The overridable `--xy-*` CSS custom properties, mirroring `@xyflow/system` (shared with
 * `@xyflow/react`/`@xyflow/svelte`). Set the un-suffixed var to override; the stylesheet falls back to
 * the shipped `--xy-*-default` value (`var(--xy-x, var(--xy-x-default))`).
 */
export type CSSVars =
  | '--xy-edge-stroke'
  | '--xy-edge-stroke-width'
  | '--xy-edge-stroke-selected'
  | '--xy-connectionline-stroke'
  | '--xy-connectionline-stroke-width'
  | '--xy-attribution-background-color'
  | '--xy-minimap-background-color'
  | '--xy-minimap-mask-background-color'
  | '--xy-minimap-mask-stroke-color'
  | '--xy-minimap-mask-stroke-width'
  | '--xy-minimap-node-background-color'
  | '--xy-minimap-node-stroke-color'
  | '--xy-minimap-node-stroke-width'
  | '--xy-background-color'
  | '--xy-background-pattern-color'
  | '--xy-resize-background-color'
  | '--xy-node-color'
  | '--xy-node-border'
  | '--xy-node-border-selected'
  | '--xy-node-background-color'
  | '--xy-node-boxshadow-hover'
  | '--xy-node-boxshadow-selected'
  | '--xy-node-border-radius'
  | '--xy-handle-background-color'
  | '--xy-handle-border-color'
  | '--xy-selection-background-color'
  | '--xy-selection-border'
  | '--xy-controls-button-background-color'
  | '--xy-controls-button-background-color-hover'
  | '--xy-controls-button-color'
  | '--xy-controls-button-color-hover'
  | '--xy-controls-button-border-color'
  | '--xy-controls-box-shadow'
  | '--xy-edge-label-background-color'
  | '--xy-edge-label-color';

export type ThemeVars = { [key in CSSVars]?: CSSProperties['color'] };
export type Styles = CSSProperties & ThemeVars & CustomThemeVars;

// Vue does not publicly export ClassValue, so we define it here to match its class binding type
export type ClassValue = string | Record<string, boolean> | ClassValue[];

export interface FlowExportObject {
  /** exported nodes */
  nodes: Node[];
  /** exported edges */
  edges: Edge[];
  /** exported viewport (position + zoom) */
  viewport: Viewport;
}

export type FlowOptions<NodeType extends Node = Node, EdgeType extends Edge = Edge> = FlowProps<NodeType, EdgeType>;

export interface FlowProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  id?: string;
  nodes?: NodeType[];
  edges?: EdgeType[];
  /** either use the edgeTypes prop to define your edge-types or use slots (<template #edge-mySpecialType="props">) */
  edgeTypes?: EdgeTypesObject<EdgeType>;
  /** either use the nodeTypes prop to define your node-types or use slots (<template #node-mySpecialType="props">) */
  nodeTypes?: NodeTypesObject<NodeType>;
  connectionMode?: ConnectionMode;
  connectionLineOptions?: ConnectionLineOptions;
  connectionRadius?: number;
  /**
   * The threshold in pixels that the pointer must move before a connection line starts to drag.
   * Useful to prevent accidental connections when clicking on a handle.
   * @default 1
   */
  connectionDragThreshold?: number;
  isValidConnection?: ValidConnectionFunc | null;
  /** consulted before delete-key/`deleteElements` removals — cancel, confirm, or filter the set */
  onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType> | null;
  deleteKeyCode?: KeyFilter | null;
  /** hold this key (default `'Shift'`) and drag to draw a selection box. For dragging without a key, see `selectionOnDrag` */
  selectionKeyCode?: KeyFilter | null;
  /**
   * Draw a selection box on a plain pane drag (no key held). Pair it with `panOnDrag` set to a non-left
   * button (e.g. `[1, 2]`) or `false` so a left-drag selects instead of panning. Mirrors xyflow/react.
   * @default false
   */
  selectionOnDrag?: boolean;
  multiSelectionKeyCode?: KeyFilter | null;
  zoomActivationKeyCode?: KeyFilter | null;
  panActivationKeyCode?: KeyFilter | null;
  snapToGrid?: boolean;
  snapGrid?: SnapGrid;
  onlyRenderVisibleElements?: boolean;
  edgesReconnectable?: EdgeReconnectable;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  nodeDragThreshold?: number;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  /** move pane on drag, replaced prop `paneMovable` */
  panOnDrag?: boolean | number[];
  minZoom?: number;
  maxZoom?: number;
  /** initial viewport for an uncontrolled flow; ignored once the user pans/zooms */
  defaultViewport?: Partial<Viewport>;
  /** controlled viewport (`v-model:viewport`) — keeps the flow's transform in sync with the bound value */
  viewport?: Viewport;
  translateExtent?: CoordinateExtent;
  nodeExtent?: CoordinateExtent;
  /** origin of all nodes relative to their position — `[0, 0]` top-left, `[0.5, 0.5]` center, `[1, 1]` bottom-right */
  nodeOrigin?: NodeOrigin;
  /** Forces a color scheme on the flow container via class name. Page-level theming is typically done by setting `data-theme` on `<html>`. */
  forceColorMode?: ColorMode;
  /** color of edge markers; pass `null` to drive the arrowhead color from the `--xy-edge-stroke` CSS variable @default '#b1b1b7' */
  defaultMarkerColor?: string | null;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  panOnScrollMode?: PanOnScrollMode;
  /**
   * Distance that the mouse can move between mousedown/up that will trigger a click
   * @default 0
   */
  paneClickDistance?: number;
  /**
   * Distance that the mouse can move between mousedown/up on a node that will trigger a click
   * @default 0
   */
  nodeClickDistance?: number;
  zoomOnDoubleClick?: boolean;
  /** If set to false, scrolling inside the viewport will be disabled and instead the page scroll will be used */
  preventScrolling?: boolean;
  selectionMode?: SelectionMode;
  reconnectRadius?: number;
  /** fit the view to the nodes once they're measured on init (xyflow/react's `fitView` prop) */
  fitView?: boolean;
  /** options for the initial `fitView` (padding, includeHiddenNodes, etc.) */
  fitViewOptions?: FitViewOptionsBase<NodeType>;
  /** allow connection with click handlers, i.e. support touch devices */
  connectOnClick?: boolean;
  /**
   * Automatically apply node/edge changes (position, dimensions, add/remove, select) back to `nodes`/`edges`.
   * Set to `false` to handle the `nodes-change` / `edges-change` events and apply the changes yourself.
   */
  autoApplyChanges?: boolean;
  /**
   * automatically create an edge when connection is triggered
   */
  autoConnect?: boolean | Connector;
  noDragClassName?: string;
  noWheelClassName?: string;
  noPanClassName?: string;
  /** does not work for the `addEdge` utility! */
  defaultEdgeOptions?: DefaultEdgeOptions;
  /** elevates edges when selected and applies z-Index to put them above their nodes */
  elevateEdgesOnSelect?: boolean;
  /** elevates nodes when selected and applies z-Index + 1000 */
  elevateNodesOnSelect?: boolean;
  /**
   * controls how the z-index of nodes and edges is calculated.
   * - `basic` (default): z-index is derived from the element's `zIndex`, parentage and selection state
   * - `auto`: same as `basic`, but parented nodes are always lifted above their parent
   * - `manual`: the element's explicit `zIndex` is used verbatim (no elevation)
   */
  zIndexMode?: ZIndexMode;

  disableKeyboardA11y?: boolean;
  /** customize the aria labels / a11y descriptions (node/edge descriptions, the aria-live move message, and the Controls/MiniMap/Handle labels); merged over the defaults */
  ariaLabelConfig?: Partial<AriaLabelConfig>;
  edgesFocusable?: boolean;
  nodesFocusable?: boolean;

  autoPanOnConnect?: boolean;
  autoPanOnNodeDrag?: boolean;
  /**
   * Pan the viewport to a node when it receives keyboard focus (Tab) and isn't currently within the
   * viewport — keeps keyboard navigation from landing on off-screen nodes.
   * @default true
   */
  autoPanOnNodeFocus?: boolean;
  /**
   * Pan the viewport automatically when the cursor reaches the edge of the viewport while dragging a
   * selection box.
   * @default true
   */
  autoPanOnSelection?: boolean;
  autoPanSpeed?: number;
}

export interface FlowEmits<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  nodesChange: [changes: NodeChange<NodeType>[]];
  edgesChange: [changes: EdgeChange<EdgeType>[]];
  nodesInitialized: [nodes: NodeType[]];
  miniMapNodeClick: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  miniMapNodeDoubleClick: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  miniMapNodeMouseEnter: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  miniMapNodeMouseMove: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  miniMapNodeMouseLeave: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  connect: [connectionEvent: Connection];
  connectStart: [connectionEvent: { event?: MouseEvent } & OnConnectStartParams];
  connectEnd: [connectionEvent: ConnectEndEvent<NodeType>];
  clickConnectStart: [connectionEvent: { event?: MouseEvent } & OnConnectStartParams];
  clickConnectEnd: [connectionEvent: ConnectEndEvent<NodeType>];
  moveStart: [moveEvent: { event: MouseTouchEvent | null; viewport: Viewport }];
  move: [moveEvent: { event: MouseTouchEvent | null; viewport: Viewport }];
  moveEnd: [moveEvent: { event: MouseTouchEvent | null; viewport: Viewport }];
  selectionDragStart: [selectionEvent: NodeDragEvent<NodeType>];
  selectionDrag: [selectionEvent: NodeDragEvent<NodeType>];
  selectionDragStop: [selectionEvent: NodeDragEvent<NodeType>];
  selectionContextMenu: [selectionEvent: { event: MouseEvent; nodes: NodeType[] }];
  selectionStart: [selectionEvent: MouseEvent];
  selectionEnd: [selectionEvent: MouseEvent];
  selectionChange: [selectionEvent: SelectionChangeEvent<NodeType, EdgeType>];
  viewportChangeStart: [viewport: Viewport];
  viewportChange: [viewport: Viewport];
  viewportChangeEnd: [viewport: Viewport];
  init: [paneEvent: VueFlowInstance<NodeType, EdgeType>];
  paneScroll: [paneEvent: WheelEvent | undefined];
  paneClick: [paneEvent: MouseEvent];
  paneContextMenu: [paneEvent: MouseEvent];
  paneMouseEnter: [paneEvent: MouseEvent];
  paneMouseMove: [paneEvent: MouseEvent];
  paneMouseLeave: [paneEvent: MouseEvent];
  updateNodeInternals: [];
  error: [error: VueFlowError];

  edgeContextMenu: [edgeMouseEvent: EdgeMouseEvent<EdgeType>];
  edgeMouseEnter: [edgeMouseEvent: EdgeMouseEvent<EdgeType>];
  edgeMouseMove: [edgeMouseEvent: EdgeMouseEvent<EdgeType>];
  edgeMouseLeave: [edgeMouseEvent: EdgeMouseEvent<EdgeType>];
  edgeDoubleClick: [edgeMouseEvent: EdgeMouseEvent<EdgeType>];
  edgeClick: [edgeMouseEvent: EdgeMouseEvent<EdgeType>];
  reconnectStart: [edgeReconnectEvent: EdgeReconnectStartEvent<EdgeType>];
  reconnect: [reconnectEvent: EdgeReconnectEvent<EdgeType>];
  reconnectEnd: [edgeReconnectEvent: EdgeReconnectEndEvent<NodeType, EdgeType>];

  nodeDoubleClick: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  nodeClick: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  nodeMouseEnter: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  nodeMouseMove: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  nodeMouseLeave: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  nodeContextMenu: [nodeMouseEvent: NodeMouseEvent<NodeType>];
  nodeDragStart: [nodeDragEvent: NodeDragEvent<NodeType>];
  nodeDrag: [nodeDragEvent: NodeDragEvent<NodeType>];
  nodeDragStop: [nodeDragEvent: NodeDragEvent<NodeType>];

  // `update:nodes` / `update:edges` / `update:viewport` are auto-declared by the `defineModel` calls in <VueFlow>.
}

// Slots are optional (a flow needn't define every node-/edge-type slot), so use `Partial<Record<…>>`
// rather than a bare `Record`. Beyond correctness, a required index signature makes `<VueFlow>`
// unassignable to Vue's `Component` (whose `InternalSlots` are optional), which breaks Options-API
// `components: { VueFlow }` registration.
// Pick the union member(s) whose `type` matches the slot's type tag. Distributive (not `Extract<…, {type:T}>`)
// because `type` is OPTIONAL on Node/Edge (`type?:`), so an `Extract` against a required `{ type: T }` is
// always `never`. For a generic `Node`/`Edge` (`type: string`) every member matches, so the slot stays broad;
// for a discriminated union it narrows to the matching variant.
type NodeByType<NodeType extends Node, T extends string> = NodeType extends any
  ? T extends NonNullable<NodeType['type']>
    ? NodeType
    : never
  : never;
type EdgeByType<EdgeType extends Edge, T extends string> = EdgeType extends any
  ? T extends NonNullable<EdgeType['type']>
    ? EdgeType
    : never
  : never;

export type NodeSlots<NodeType extends Node = Node> = Partial<
  {
    [T in NonNullable<NodeType['type']> as `node-${T}`]: (nodeProps: NodeProps<NodeByType<NodeType, T>>) => any;
  } & Record<`node-${string}`, (nodeProps: NodeProps<NodeType>) => any>
>;

export type EdgeSlots<EdgeType extends Edge = Edge> = Partial<
  {
    [T in NonNullable<EdgeType['type']> as `edge-${T}`]: (edgeProps: EdgeProps<EdgeByType<EdgeType, T>>) => any;
  } & Record<`edge-${string}`, (edgeProps: EdgeProps<EdgeType>) => any>
>;

export type FlowSlots<NodeType extends Node = Node, EdgeType extends Edge = Edge> = NodeSlots<NodeType> &
  EdgeSlots<EdgeType> & {
    'connection-line'?: (connectionLineProps: ConnectionLineProps<NodeType>) => any;
    'zoom-pane'?: () => any;
    default?: () => any;
  };
