import type { KeyFilter } from '@vueuse/core';
import type {
  AriaLabelConfig,
  ColorMode,
  Connection,
  ConnectionMode,
  CoordinateExtent,
  FitViewOptionsBase,
  OnBeforeDeleteBase,
  OnConnectStartParams,
  PanelPosition,
  PanOnScrollMode,
  ProOptions,
  SelectionMode,
  SnapGrid,
  Viewport,
  ZIndexMode,
} from '@xyflow/system';
import type { CSSProperties } from 'vue';
import type { VueFlowError } from '../utils';
import type { EdgeChange, NodeChange } from './changes';
import type { EdgeTypesObject, NodeTypesObject } from './components';
import type { ConnectionLineOptions, ConnectionLineProps } from './connection';
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
 * cancel, `true` to delete that set, or `{ nodes, edges }` to delete only a subset.
 */
export type OnBeforeDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = OnBeforeDeleteBase<NodeType, EdgeType>;

/**
 * Called after nodes and/or edges have been removed (via the delete key or `deleteElements`), with the
 * removed elements. The `delete` event payload; mirrors xyflow/react's `OnDelete` and xyflow/svelte's `ondelete`.
 */
export type OnDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (params: {
  nodes: NodeType[];
  edges: EdgeType[];
}) => void;

export interface CustomThemeVars {
  [key: string]: string | number | undefined;
}

/**
 * The overridable `--xy-*` CSS custom properties from `@xyflow/system`. Set the un-suffixed var to
 * override; the stylesheet falls back to the shipped `--xy-*-default` value
 * (`var(--xy-x, var(--xy-x-default))`).
 */
export type CSSVars
  = | '--xy-edge-stroke'
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

/**
 * Vue Flow component props.
 */
export interface FlowProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  id?: string;
  /**
   * An array of nodes to render in a controlled flow.
   * @default []
   */
  nodes?: NodeType[];
  /**
   * An array of edges to render in a controlled flow.
   * @default []
   */
  edges?: EdgeType[];
  /** either use the edgeTypes prop to define your edge-types or use slots (<template #edge-mySpecialType="props">) */
  edgeTypes?: EdgeTypesObject<EdgeType>;
  /** either use the nodeTypes prop to define your node-types or use slots (<template #node-mySpecialType="props">) */
  nodeTypes?: NodeTypesObject<NodeType>;
  /**
   * A loose connection mode will allow you to connect handles with differing types, including
   * source-to-source connections. However, it does not support target-to-target connections. Strict
   * mode allows only connections between source handles and target handles.
   * @default 'strict'
   */
  connectionMode?: ConnectionMode;
  connectionLineOptions?: ConnectionLineOptions;
  /**
   * The radius around a handle where you drop a connection line to create a new edge.
   * @default 20
   */
  connectionRadius?: number;
  /**
   * The threshold in pixels that the pointer must move before a connection line starts to drag.
   * This is useful to prevent accidental connections when clicking on a handle.
   * @default 1
   */
  connectionDragThreshold?: number;
  /**
   * This callback can be used to validate a new connection. If you return `false`, the edge will not
   * be added to your flow. If you have custom connection logic it is preferred to use this callback
   * over the `isValidConnection` prop on the handle component for performance reasons.
   */
  isValidConnection?: ValidConnectionFunc | null;
  /**
   * This handler is called before nodes or edges are deleted, allowing the deletion to be aborted by
   * returning `false` or modified by returning updated nodes and edges.
   */
  onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType> | null;
  /**
   * If set, pressing the key or chord will delete any selected nodes and edges. Passing an array
   * represents multiple keys that can be pressed.
   * @default 'Backspace'
   */
  deleteKeyCode?: KeyFilter | null;
  /**
   * If set, holding this key will let you click and drag to draw a selection box around multiple
   * nodes and edges. Passing an array represents multiple keys that can be pressed.
   * @default 'Shift'
   */
  selectionKeyCode?: KeyFilter | null;
  /**
   * Draw a selection box on a plain pane drag (no key held). Pair it with `panOnDrag` set to a non-left
   * button (e.g. `[1, 2]`) or `false` so a left-drag selects instead of panning.
   * @default false
   */
  selectionOnDrag?: boolean;
  /**
   * Pressing down this key you can select multiple elements by clicking.
   * @default "Meta" for macOS, "Control" for other systems
   */
  multiSelectionKeyCode?: KeyFilter | null;
  /**
   * If a key is set, you can zoom the viewport while that key is held down even if `panOnScroll` is
   * set to `false`. Setting this prop to `null` disables the functionality.
   * @default "Meta" for macOS, "Control" for other systems
   */
  zoomActivationKeyCode?: KeyFilter | null;
  /**
   * If a key is set, you can pan the viewport while that key is held down even if `panOnScroll` is
   * set to `false`. Setting this prop to `null` disables the functionality.
   * @default 'Space'
   */
  panActivationKeyCode?: KeyFilter | null;
  /** When enabled, nodes will snap to the grid when dragged. */
  snapToGrid?: boolean;
  /**
   * If `snapToGrid` is enabled, this prop configures the grid that nodes will snap to.
   * @example [20, 20]
   */
  snapGrid?: SnapGrid;
  /**
   * You can enable this optimisation to instruct Vue Flow to only render nodes and edges that would be
   * visible in the viewport. This might improve performance when you have a large number of nodes and
   * edges but also adds an overhead.
   * @default false
   */
  onlyRenderVisibleElements?: boolean;
  /**
   * Whether edges can be updated once they are created. When both this prop is `true` and an
   * `onReconnect` handler is provided, the user can drag an existing edge to a new source or target.
   * Individual edges can override this value with their `reconnectable` property.
   * @default true
   */
  edgesReconnectable?: EdgeReconnectable;
  /**
   * Controls whether all nodes should be draggable or not. Individual nodes can override this setting
   * by setting their `draggable` prop.
   * @default true
   */
  nodesDraggable?: boolean;
  /**
   * Controls whether all nodes should be connectable or not. Individual nodes can override this
   * setting by setting their `connectable` prop.
   * @default true
   */
  nodesConnectable?: boolean;
  /**
   * With a threshold greater than zero you can delay node drag events. If threshold equals 1, you need
   * to drag the node 1 pixel before a drag event is fired.
   * @default 1
   */
  nodeDragThreshold?: number;
  /**
   * When `true`, elements (nodes and edges) can be selected by clicking on them. This option can be
   * overridden by individual elements by setting their `selectable` prop.
   * @default true
   */
  elementsSelectable?: boolean;
  /**
   * If `true`, nodes get selected on drag.
   * @default true
   */
  selectNodesOnDrag?: boolean;
  /**
   * Enabling this prop allows users to pan the viewport by clicking and dragging. You can also set
   * this prop to an array of numbers to limit which mouse buttons can activate panning.
   * @default true
   * @example [0, 2] // allows panning with the left and right mouse buttons
   */
  panOnDrag?: boolean | number[];
  /**
   * Minimum zoom level.
   * @default 0.5
   */
  minZoom?: number;
  /**
   * Maximum zoom level.
   * @default 2
   */
  maxZoom?: number;
  /**
   * Sets the initial position and zoom of the viewport. If a default viewport is provided but `fitView`
   * is enabled, the default viewport will be ignored.
   * @default { x: 0, y: 0, zoom: 1 }
   */
  defaultViewport?: Partial<Viewport>;
  /** controlled viewport (`v-model:viewport`) — keeps the flow's transform in sync with the bound value */
  viewport?: Viewport;
  /**
   * By default, the viewport extends infinitely. You can use this prop to set a boundary. The first
   * pair of coordinates is the top left boundary and the second pair is the bottom right.
   * @default [[-∞, -∞], [+∞, +∞]]
   */
  translateExtent?: CoordinateExtent;
  /**
   * By default, nodes can be placed on an infinite flow. You can use this prop to set a boundary. The
   * first pair of coordinates is the top left boundary and the second pair is the bottom right.
   */
  nodeExtent?: CoordinateExtent;
  /**
   * The origin of the node to use when placing it in the flow or looking up its `x` and `y` position.
   * An origin of `[0, 0]` means that a node's top left corner will be placed at the `x` and `y` position.
   * @default [0, 0]
   * @example
   * [0, 0] // top left
   * [0.5, 0.5] // center
   * [1, 1] // bottom right
   */
  nodeOrigin?: NodeOrigin;
  /**
   * Forces a color scheme on the flow container via class name, overriding the system default.
   * Page-level theming is typically done by setting `data-theme` on `<html>`.
   */
  forceColorMode?: ColorMode;
  /**
   * Color of edge markers. You can pass `null` to use the CSS variable `--xy-edge-stroke` for the
   * marker color.
   * @default '#b1b1b7'
   */
  defaultMarkerColor?: string | null;
  /**
   * By default, we render a small attribution in the corner of your flows that links back to the project.
   *
   * Anyone is free to remove this attribution whether they're a Pro subscriber or not
   * but we ask that you take a quick look at our {@link https://vueflow.dev/learn/troubleshooting/remove-attribution | removing attribution guide}
   * before doing so.
   */
  proOptions?: ProOptions;
  /**
   * Set position of the attribution
   * @default 'bottom-right'
   * @example 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
   */
  attributionPosition?: PanelPosition;
  /**
   * Controls if the viewport should zoom by scrolling inside the container.
   * @default true
   */
  zoomOnScroll?: boolean;
  /**
   * Controls if the viewport should zoom by pinching on a touch screen.
   * @default true
   */
  zoomOnPinch?: boolean;
  /**
   * Controls if the viewport should pan by scrolling inside the container. Can be limited to a
   * specific direction with `panOnScrollMode`.
   * @default false
   */
  panOnScroll?: boolean;
  /**
   * Controls how fast viewport should be panned on scroll. Use together with `panOnScroll` prop.
   * @default 0.5
   */
  panOnScrollSpeed?: number;
  /**
   * This prop is used to limit the direction of panning when `panOnScroll` is enabled. The `"free"`
   * option allows panning in any direction.
   * @default "free"
   * @example "horizontal" | "vertical"
   */
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
  /**
   * Controls if the viewport should zoom by double-clicking somewhere on the flow.
   * @default true
   */
  zoomOnDoubleClick?: boolean;
  /**
   * Disabling this prop will allow the user to scroll the page even when their pointer is over the flow.
   * @default true
   */
  preventScrolling?: boolean;
  /**
   * When set to `"partial"`, when the user creates a selection box by click and dragging nodes that
   * are only partially in the box are still selected.
   * @default 'full'
   */
  selectionMode?: SelectionMode;
  /**
   * The radius around an edge connection that can trigger an edge reconnection.
   * @default 10
   */
  reconnectRadius?: number;
  /** When `true`, the flow will be zoomed and panned to fit all the nodes initially provided. */
  fitView?: boolean;
  /**
   * When you typically call `fitView` on a `VueFlowInstance`, you can provide an object of options to
   * customize its behavior. This prop lets you do the same for the initial `fitView` call.
   */
  fitViewOptions?: FitViewOptionsBase<NodeType>;
  /**
   * The `connectOnClick` option lets you click or tap on a source handle to start a connection and then
   * click on a target handle to complete the connection. If you set this option to `false`, users will
   * need to drag the connection line to the target handle to create a connection.
   * @default true
   */
  connectOnClick?: boolean;
  /**
   * If a node is draggable, clicking and dragging that node will move it around the canvas. Adding the
   * `"nodrag"` class prevents this behavior and this prop allows you to change the name of that class.
   * @default "nodrag"
   */
  noDragClassName?: string;
  /**
   * Typically, scrolling the mouse wheel when the mouse is over the canvas will zoom the viewport.
   * Adding the `"nowheel"` class to an element in the canvas will prevent this behavior and this prop
   * allows you to change the name of that class.
   * @default "nowheel"
   */
  noWheelClassName?: string;
  /**
   * If an element in the canvas does not stop mouse events from propagating, clicking and dragging that
   * element will pan the viewport. Adding the `"nopan"` class prevents this behavior and this prop
   * allows you to change the name of that class.
   * @default "nopan"
   */
  noPanClassName?: string;
  /**
   * Defaults to be applied to all new edges that are added to the flow. Properties on a new edge will
   * override these defaults if they exist. Does not apply to the `addEdge` utility.
   */
  defaultEdgeOptions?: DefaultEdgeOptions;
  /**
   * Enabling this option will raise the z-index of edges when they are selected.
   * @default false
   */
  elevateEdgesOnSelect?: boolean;
  /**
   * Enabling this option will raise the z-index of nodes when they are selected.
   * @default true
   */
  elevateNodesOnSelect?: boolean;
  /**
   * controls how the z-index of nodes and edges is calculated.
   * - `basic` (default): z-index is derived from the element's `zIndex`, parentage and selection state
   * - `auto`: same as `basic`, but parented nodes are always lifted above their parent
   * - `manual`: the element's explicit `zIndex` is used verbatim (no elevation)
   */
  zIndexMode?: ZIndexMode;

  /**
   * You can use this prop to disable keyboard accessibility features such as selecting nodes or moving
   * selected nodes with the arrow keys.
   * @default false
   */
  disableKeyboardA11y?: boolean;
  /** customize the aria labels / a11y descriptions (node/edge descriptions, the aria-live move message, and the Controls/MiniMap/Handle labels); merged over the defaults */
  ariaLabelConfig?: Partial<AriaLabelConfig>;
  /**
   * When `true`, focus between edges can be cycled with the `Tab` key and selected with the `Enter`
   * key. This option can be overridden by individual edges by setting their `focusable` prop.
   * @default true
   */
  edgesFocusable?: boolean;
  /**
   * When `true`, focus between nodes can be cycled with the `Tab` key and selected with the `Enter`
   * key. This option can be overridden by individual nodes by setting their `focusable` prop.
   * @default true
   */
  nodesFocusable?: boolean;

  /**
   * When `true`, the viewport will pan automatically when the cursor moves to the edge of the viewport
   * while creating a connection.
   * @default true
   */
  autoPanOnConnect?: boolean;
  /**
   * When `true`, the viewport will pan automatically when the cursor moves to the edge of the viewport
   * while dragging a node.
   * @default true
   */
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
  /**
   * The speed at which the viewport pans while dragging a node or a selection box.
   * @default 15
   */
  autoPanSpeed?: number;
}

export interface FlowEmits<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  nodesChange: [changes: NodeChange<NodeType>[]];
  edgesChange: [changes: EdgeChange<EdgeType>[]];
  nodesDelete: [nodes: NodeType[]];
  edgesDelete: [edges: EdgeType[]];
  delete: [event: { nodes: NodeType[]; edges: EdgeType[] }];
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

// Slots are optional, so `Partial<Record<…>>` not a bare `Record` — a required index signature also
// makes `<VueFlow>` unassignable to Vue's `Component`, breaking Options-API `components: { VueFlow }`.
// Distributive (not `Extract`) because `type` is optional on Node/Edge: a generic type stays broad,
// a discriminated union narrows to the matching variant.
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

export type FlowSlots<NodeType extends Node = Node, EdgeType extends Edge = Edge> = NodeSlots<NodeType>
  & EdgeSlots<EdgeType> & {
    'connection-line'?: (connectionLineProps: ConnectionLineProps<NodeType>) => any;
    'zoom-pane'?: () => any;
    'default'?: () => any;
  };
