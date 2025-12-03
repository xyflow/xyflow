import type { CSSProperties, HTMLAttributes, MouseEvent as ReactMouseEvent, WheelEvent } from 'react';
import type {
  ConnectionMode,
  ConnectionLineType,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  CoordinateExtent,
  KeyCode,
  PanOnScrollMode,
  ProOptions,
  PanelPosition,
  OnMove,
  OnMoveStart,
  OnMoveEnd,
  Viewport,
  NodeOrigin,
  HandleType,
  SelectionMode,
  OnError,
  ColorMode,
  SnapGrid,
  OnReconnect,
  AriaLabelConfig,
  FinalConnectionState,
  ZIndexMode,
} from '@xyflow/system';

import type {
  OnSelectionChangeFunc,
  NodeTypes,
  EdgeTypes,
  Node,
  Edge,
  ConnectionLineComponent,
  OnInit,
  DefaultEdgeOptions,
  FitViewOptions,
  OnNodesDelete,
  OnEdgesDelete,
  OnDelete,
  OnNodesChange,
  OnEdgesChange,
  NodeMouseHandler,
  SelectionDragHandler,
  EdgeMouseHandler,
  OnNodeDrag,
  OnBeforeDelete,
  IsValidConnection,
} from '.';

/**
 * ReactFlow component props.
 * @public
 */
export interface ReactFlowProps<NodeType extends Node = Node, EdgeType extends Edge = Edge>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onError'> {
  /**
   * An array of nodes to render in a controlled flow.
   * @default []
   * @example
   * const nodes = [
   *  {
   *    id: 'node-1',
   *    type: 'input',
   *    data: { label: 'Node 1' },
   *    position: { x: 250, y: 50 }
   *  }
   * ];
   */
  nodes?: NodeType[];
  /**
   * An array of edges to render in a controlled flow.
   * @default []
   * @example
   * const edges = [
   *  {
   *    id: 'edge-1-2',
   *    source: 'node-1',
   *    target: 'node-2',
   *  }
   * ];
   */
  edges?: EdgeType[];
  /** The initial nodes to render in an uncontrolled flow. */
  defaultNodes?: NodeType[];
  /** The initial edges to render in an uncontrolled flow. */
  defaultEdges?: EdgeType[];
  /**
   * Defaults to be applied to all new edges that are added to the flow.
   * Properties on a new edge will override these defaults if they exist.
   * @example
   * const defaultEdgeOptions = {
   *  type: 'customEdgeType',
   *  animated: true
   * }
   */
  defaultEdgeOptions?: DefaultEdgeOptions;
  /** This event handler is called when a user clicks on a node. */
  onNodeClick?: NodeMouseHandler<NodeType>;
  /** This event handler is called when a user double-clicks on a node. */
  onNodeDoubleClick?: NodeMouseHandler<NodeType>;
  /** This event handler is called when mouse of a user enters a node. */
  onNodeMouseEnter?: NodeMouseHandler<NodeType>;
  /** This event handler is called when mouse of a user moves over a node. */
  onNodeMouseMove?: NodeMouseHandler<NodeType>;
  /** This event handler is called when mouse of a user leaves a node. */
  onNodeMouseLeave?: NodeMouseHandler<NodeType>;
  /** This event handler is called when a user right-clicks on a node. */
  onNodeContextMenu?: NodeMouseHandler<NodeType>;
  /** This event handler is called when a user starts to drag a node. */
  onNodeDragStart?: OnNodeDrag<NodeType>;
  /** This event handler is called when a user drags a node. */
  onNodeDrag?: OnNodeDrag<NodeType>;
  /** This event handler is called when a user stops dragging a node. */
  onNodeDragStop?: OnNodeDrag<NodeType>;
  /** This event handler is called when a user clicks on an edge. */
  onEdgeClick?: (event: ReactMouseEvent, edge: EdgeType) => void;
  /** This event handler is called when a user right-clicks on an edge. */
  onEdgeContextMenu?: EdgeMouseHandler<EdgeType>;
  /** This event handler is called when mouse of a user enters an edge. */
  onEdgeMouseEnter?: EdgeMouseHandler<EdgeType>;
  /** This event handler is called when mouse of a user moves over an edge. */
  onEdgeMouseMove?: EdgeMouseHandler<EdgeType>;
  /** This event handler is called when mouse of a user leaves an edge. */
  onEdgeMouseLeave?: EdgeMouseHandler<EdgeType>;
  /** This event handler is called when a user double-clicks on an edge. */
  onEdgeDoubleClick?: EdgeMouseHandler<EdgeType>;
  /**
   * This handler is called when the source or target of a reconnectable edge is dragged from the
   * current node. It will fire even if the edge's source or target do not end up changing.
   * You can use the `reconnectEdge` utility to convert the connection to a new edge.
   */
  onReconnect?: OnReconnect<EdgeType>;
  /**
   * This event fires when the user begins dragging the source or target of an editable edge.
   */
  onReconnectStart?: (event: ReactMouseEvent, edge: EdgeType, handleType: HandleType) => void;
  /**
   * This event fires when the user releases the source or target of an editable edge. It is called
   * even if an edge update does not occur.
   */
  onReconnectEnd?: (
    event: MouseEvent | TouchEvent,
    edge: EdgeType,
    handleType: HandleType,
    connectionState: FinalConnectionState
  ) => void;
  /**
   * Use this event handler to add interactivity to a controlled flow.
   * It is called on node drag, select, and move.
   * @example // Use NodesState hook to create edges and get onNodesChange handler
   * import ReactFlow, { useNodesState } from '@xyflow/react';
   * const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
   *
   * return (<ReactFlow onNodeChange={onNodeChange} {...rest} />)
   * @example // Use helper function to update node
   * import ReactFlow, { applyNodeChanges } from '@xyflow/react';
   *
   * const onNodeChange = useCallback(
   *  (changes) => setNode((nds) => applyNodeChanges(changes, nds)),
   *  [],
   * );
   *
   * return (<ReactFlow onNodeChange={onNodeChange} {...rest} />)
   */
  onNodesChange?: OnNodesChange<NodeType>;
  /**
   * Use this event handler to add interactivity to a controlled flow. It is called on edge select
   * and remove.
   * @example // Use EdgesState hook to create edges and get onEdgesChange handler
   * import ReactFlow, { useEdgesState } from '@xyflow/react';
   * const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
   *
   * return (<ReactFlow onEdgesChange={onEdgesChange} {...rest} />)
   * @example // Use helper function to update edge
   * import ReactFlow, { applyEdgeChanges } from '@xyflow/react';
   *
   * const onEdgesChange = useCallback(
   *  (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
   *  [],
   * );
   *
   * return (<ReactFlow onEdgesChange={onEdgesChange} {...rest} />)
   */
  onEdgesChange?: OnEdgesChange<EdgeType>;
  /** This event handler gets called when a node is deleted. */
  onNodesDelete?: OnNodesDelete<NodeType>;
  /** This event handler gets called when an edge is deleted. */
  onEdgesDelete?: OnEdgesDelete<EdgeType>;
  /** This event handler gets called when a node or edge is deleted. */
  onDelete?: OnDelete<NodeType, EdgeType>;
  /** This event handler gets called when a user starts to drag a selection box. */
  onSelectionDragStart?: SelectionDragHandler<NodeType>;
  /** This event handler gets called when a user drags a selection box. */
  onSelectionDrag?: SelectionDragHandler<NodeType>;
  /** This event handler gets called when a user stops dragging a selection box. */
  onSelectionDragStop?: SelectionDragHandler<NodeType>;
  onSelectionStart?: (event: ReactMouseEvent) => void;
  onSelectionEnd?: (event: ReactMouseEvent) => void;
  /**
   * This event handler is called when a user right-clicks on a node selection.
   */
  onSelectionContextMenu?: (event: ReactMouseEvent, nodes: NodeType[]) => void;
  /**
   * When a connection line is completed and two nodes are connected by the user, this event fires with the new connection.
   * You can use the `addEdge` utility to convert the connection to a complete edge.
   * @example // Use helper function to update edges onConnect
   * import ReactFlow, { addEdge } from '@xyflow/react';
   *
   * const onConnect = useCallback(
   *  (params) => setEdges((eds) => addEdge(params, eds)),
   *  [],
   * );
   *
   * return (<ReactFlow onConnect={onConnect} {...rest} />)
   */
  onConnect?: OnConnect;
  /** This event handler gets called when a user starts to drag a connection line. */
  onConnectStart?: OnConnectStart;
  /**
   * This callback will fire regardless of whether a valid connection could be made or not. You can
   * use the second `connectionState` parameter to have different behavior when a connection was
   * unsuccessful.
   */
  onConnectEnd?: OnConnectEnd;
  onClickConnectStart?: OnConnectStart;
  onClickConnectEnd?: OnConnectEnd;
  /**
   * The `onInit` callback is called when the viewport is initialized. At this point you can use the
   * instance to call methods like `fitView` or `zoomTo`.
   */
  onInit?: OnInit<NodeType, EdgeType>;
  /** This event handler is called while the user is either panning or zooming the viewport. */
  onMove?: OnMove;
  /** This event handler is called when the user begins to pan or zoom the viewport. */
  onMoveStart?: OnMoveStart;
  /**
   * This event handler is called when panning or zooming viewport movement stops.
   * If the movement is not user-initiated, the event parameter will be `null`.
   */
  onMoveEnd?: OnMoveEnd;
  /** This event handler gets called when a user changes group of selected elements in the flow. */
  onSelectionChange?: OnSelectionChangeFunc<NodeType, EdgeType>;
  /** This event handler gets called when user scroll inside the pane. */
  onPaneScroll?: (event?: WheelEvent) => void;
  /** This event handler gets called when user clicks inside the pane. */
  onPaneClick?: (event: ReactMouseEvent) => void;
  /** This event handler gets called when user right clicks inside the pane. */
  onPaneContextMenu?: (event: ReactMouseEvent | MouseEvent) => void;
  /** This event handler gets called when mouse enters the pane. */
  onPaneMouseEnter?: (event: ReactMouseEvent) => void;
  /** This event handler gets called when mouse moves over the pane. */
  onPaneMouseMove?: (event: ReactMouseEvent) => void;
  /** This event handler gets called when mouse leaves the pane. */
  onPaneMouseLeave?: (event: ReactMouseEvent) => void;
  /**
   * Distance that the mouse can move between mousedown/up that will trigger a click.
   * @default 0
   */
  paneClickDistance?: number;
  /**
   * Distance that the mouse can move between mousedown/up that will trigger a click.
   * @default 0
   */
  nodeClickDistance?: number;
  /**
   * This handler is called before nodes or edges are deleted, allowing the deletion to be aborted
   * by returning `false` or modified by returning updated nodes and edges.
   */
  onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType>;
  /**
   * Custom node types to be available in a flow.
   * React Flow matches a node's type to a component in the `nodeTypes` object.
   * @default {
   *   input: InputNode,
   *   default: DefaultNode,
   *   output: OutputNode,
   *   group: GroupNode
   * }
   * @example
   * import CustomNode from './CustomNode';
   *
   * const nodeTypes = { nameOfNodeType: CustomNode };
   */
  nodeTypes?: NodeTypes;
  /**
   * Custom edge types to be available in a flow.
   * React Flow matches an edge's type to a component in the `edgeTypes` object.
   * @default {
   *   default: BezierEdge,
   *   straight: StraightEdge,
   *   step: StepEdge,
   *   smoothstep: SmoothStepEdge,
   *   simplebezier: SimpleBezier
   * }
   * @example
   * import CustomEdge from './CustomEdge';
   *
   * const edgeTypes = { nameOfEdgeType: CustomEdge };
   */
  edgeTypes?: EdgeTypes;
  /**
   * The type of edge path to use for connection lines.
   * Although created edges can be of any type, React Flow needs to know what type of path to render for the connection line before the edge is created!
   * @default ConnectionLineType.Bezier
   */
  connectionLineType?: ConnectionLineType;
  /** Styles to be applied to the connection line. */
  connectionLineStyle?: CSSProperties;
  /** React Component to be used as a connection line. */
  connectionLineComponent?: ConnectionLineComponent<NodeType>;
  /** Styles to be applied to the container of the connection line. */
  connectionLineContainerStyle?: CSSProperties;
  /**
   * A loose connection mode will allow you to connect handles with differing types, including
   * source-to-source connections. However, it does not support target-to-target connections. Strict
   * mode allows only connections between source handles and target handles.
   * @default 'strict'
   */
  connectionMode?: ConnectionMode;
  /**
   * If set, pressing the key or chord will delete any selected nodes and edges. Passing an array
   * represents multiple keys that can be pressed.

   * For example, `["Delete", "Backspace"]` will delete selected elements when either key is pressed.
   * @default 'Backspace'
   */
  deleteKeyCode?: KeyCode | null;
  /**
   * If set, holding this key will let you click and drag to draw a selection box around multiple
   * nodes and edges. Passing an array represents multiple keys that can be pressed.
   *
   * For example, `["Shift", "Meta"]` will allow you to draw a selection box when either key is
   * pressed.
   * @default 'Shift'
   */
  selectionKeyCode?: KeyCode | null;
  /**
   * Select multiple elements with a selection box, without pressing down `selectionKey`.
   * @default false
   */
  selectionOnDrag?: boolean;
  /**
   * When set to `"partial"`, when the user creates a selection box by click and dragging nodes that
   * are only partially in the box are still selected.
   * @default 'full'
   */
  selectionMode?: SelectionMode;
  /**
   * If a key is set, you can pan the viewport while that key is held down even if `panOnScroll`
   * is set to `false`.
   *
   * By setting this prop to `null` you can disable this functionality.
   * @default 'Space'
   */
  panActivationKeyCode?: KeyCode | null;
  /**
   * Pressing down this key you can select multiple elements by clicking.
   * @default "Meta" for macOS, "Control" for other systems
   */
  multiSelectionKeyCode?: KeyCode | null;
  /**
   * If a key is set, you can zoom the viewport while that key is held down even if `panOnScroll`
   * is set to `false`.
   *
   * By setting this prop to `null` you can disable this functionality.
   * @default "Meta" for macOS, "Control" for other systems
   *
   */
  zoomActivationKeyCode?: KeyCode | null;
  /** When enabled, nodes will snap to the grid when dragged. */
  snapToGrid?: boolean;
  /**
   * If `snapToGrid` is enabled, this prop configures the grid that nodes will snap to.
   * @example [20, 20]
   */
  snapGrid?: SnapGrid;
  /**
   * You can enable this optimisation to instruct React Flow to only render nodes and edges that would be visible in the viewport.
   *
   * This might improve performance when you have a large number of nodes and edges but also adds an overhead.
   * @default false
   */
  onlyRenderVisibleElements?: boolean;
  /**
   * Controls whether all nodes should be draggable or not. Individual nodes can override this
   * setting by setting their `draggable` prop. If you want to use the mouse handlers on
   * non-draggable nodes, you need to add the `"nopan"` class to those nodes.
   * @default true
   */
  nodesDraggable?: boolean;
  /**
   * When `true`, the viewport will pan when a node is focused.
   * @default true
   */
  autoPanOnNodeFocus?: boolean;
  /**
   * Controls whether all nodes should be connectable or not. Individual nodes can override this
   * setting by setting their `connectable` prop.
   * @default true
   */
  nodesConnectable?: boolean;
  /**
   * When `true`, focus between nodes can be cycled with the `Tab` key and selected with the `Enter`
   * key. This option can be overridden by individual nodes by setting their `focusable` prop.
   * @default true
   */
  nodesFocusable?: boolean;
  /**
   * The origin of the node to use when placing it in the flow or looking up its `x` and `y`
   * position. An origin of `[0, 0]` means that a node's top left corner will be placed at the `x`
   * and `y` position.
   * @default [0, 0]
   * @example
   * [0, 0] // default, top left
   * [0.5, 0.5] // center
   * [1, 1] // bottom right
   */
  nodeOrigin?: NodeOrigin;
  /**
   * When `true`, focus between edges can be cycled with the `Tab` key and selected with the `Enter`
   * key. This option can be overridden by individual edges by setting their `focusable` prop.
   * @default true
   */
  edgesFocusable?: boolean;
  /**
   * Whether edges can be updated once they are created. When both this prop is `true` and an
   * `onReconnect` handler is provided, the user can drag an existing edge to a new source or
   * target. Individual edges can override this value with their reconnectable property.
   * @default true
   */
  edgesReconnectable?: boolean;
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
   * Enabling this prop allows users to pan the viewport by clicking and dragging.
   * You can also set this prop to an array of numbers to limit which mouse buttons can activate panning.
   * @default true
   * @example [0, 2] // allows panning with the left and right mouse buttons
   * [0, 1, 2, 3, 4] // allows panning with all mouse buttons
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
   * When you pass a `viewport` prop, it's controlled, and you also need to pass `onViewportChange`
   * to handle internal changes.
   */
  viewport?: Viewport;
  /**
   * Sets the initial position and zoom of the viewport. If a default viewport is provided but
   * `fitView` is enabled, the default viewport will be ignored.
   * @default { x: 0, y: 0, zoom: 1 }
   * @example
   * const initialViewport = {
   *  zoom: 0.5,
   *  position: { x: 0, y: 0 }
   * };
   */
  defaultViewport?: Viewport;
  /**
   * Used when working with a controlled viewport for updating the user viewport state.
   */
  onViewportChange?: (viewport: Viewport) => void;
  /**
   * By default, the viewport extends infinitely. You can use this prop to set a boundary.
   * The first pair of coordinates is the top left boundary and the second pair is the bottom right.
   * @default [[-∞, -∞], [+∞, +∞]]
   * @example [[-1000, -10000], [1000, 1000]]
   */
  translateExtent?: CoordinateExtent;
  /**
   * Disabling this prop will allow the user to scroll the page even when their pointer is over the flow.
   * @default true
   */
  preventScrolling?: boolean;
  /**
   * By default, nodes can be placed on an infinite flow. You can use this prop to set a boundary.
   * The first pair of coordinates is the top left boundary and the second pair is the bottom right.
   * @example [[-1000, -10000], [1000, 1000]]
   */
  nodeExtent?: CoordinateExtent;
  /**
   * Color of edge markers.
   * You can pass `null` to use the CSS variable `--xy-edge-stroke` for the marker color.
   * @default '#b1b1b7'
   */
  defaultMarkerColor?: string | null;
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
   * Controls if the viewport should pan by scrolling inside the container.
   * Can be limited to a specific direction with `panOnScrollMode`.
   * @default false
   */
  panOnScroll?: boolean;
  /**
   * Controls how fast viewport should be panned on scroll.
   * Use together with `panOnScroll` prop.
   * @default 0.5
   */
  panOnScrollSpeed?: number;
  /**
   * This prop is used to limit the direction of panning when `panOnScroll` is enabled.
   * The `"free"` option allows panning in any direction.
   * @default "free"
   * @example "horizontal" | "vertical"
   */
  panOnScrollMode?: PanOnScrollMode;
  /**
   * Controls if the viewport should zoom by double-clicking somewhere on the flow.
   * @default true
   */
  zoomOnDoubleClick?: boolean;
  /**
   * The radius around an edge connection that can trigger an edge reconnection.
   * @default 10
   */
  reconnectRadius?: number;
  /**
   * If a node is draggable, clicking and dragging that node will move it around the canvas. Adding
   * the `"nodrag"` class prevents this behavior and this prop allows you to change the name of that
   * class.
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
   * If an element in the canvas does not stop mouse events from propagating, clicking and dragging
   * that element will pan the viewport. Adding the `"nopan"` class prevents this behavior and this
   * prop allows you to change the name of that class.
   * @default "nopan"
   */
  noPanClassName?: string;
  /** When `true`, the flow will be zoomed and panned to fit all the nodes initially provided. */
  fitView?: boolean;
  /**
   * When you typically call `fitView` on a `ReactFlowInstance`, you can provide an object of
   * options to customize its behavior. This prop lets you do the same for the initial `fitView`
   * call.
   * @example
   * const fitViewOptions = {
   *  padding: 0.1,
   *  includeHiddenNodes: false,
   *  minZoom: 0.1,
   *  maxZoom: 1,
   *  duration: 200,
   *  nodes: [{id: 'node-1'}, {id: 'node-2'}], // nodes to fit
   * };
   */
  fitViewOptions?: FitViewOptions;
  /**
   * The `connectOnClick` option lets you click or tap on a source handle to start a connection
   * and then click on a target handle to complete the connection.
   *
   * If you set this option to `false`, users will need to drag the connection line to the target
   * handle to create a connection.
   * @default true
   */
  connectOnClick?: boolean;
  /**
   * By default, React Flow will render a small attribution in the bottom right corner of the flow.
   *
   * You can use this prop to change its position in case you want to place something else there.
   * @default 'bottom-right'
   * @example 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
   */
  attributionPosition?: PanelPosition;
  /**
   * By default, we render a small attribution in the corner of your flows that links back to the project.
   *
   * Anyone is free to remove this attribution whether they're a Pro subscriber or not
   * but we ask that you take a quick look at our {@link https://reactflow.dev/learn/troubleshooting/remove-attribution | removing attribution guide}
   * before doing so.
   */
  proOptions?: ProOptions;
  /**
   * Enabling this option will raise the z-index of nodes when they are selected.
   * @default true
   */
  elevateNodesOnSelect?: boolean;
  /**
   * Enabling this option will raise the z-index of edges when they are selected.
   * @default false
   */
  elevateEdgesOnSelect?: boolean;
  /**
   * You can use this prop to disable keyboard accessibility features such as selecting nodes or
   * moving selected nodes with the arrow keys.
   * @default false
   */
  disableKeyboardA11y?: boolean;
  /**
   * When `true`, the viewport will pan automatically when the cursor moves to the edge of the
   * viewport while dragging a node.
   * @default true
   */
  autoPanOnNodeDrag?: boolean;
  /**
   * When `true`, the viewport will pan automatically when the cursor moves to the edge of the
   * viewport while creating a connection.
   * @default true
   */
  autoPanOnConnect?: boolean;
  /**
   * The speed at which the viewport pans while dragging a node or a selection box.
   * @default 15
   */
  autoPanSpeed?: number;
  /**
   * The radius around a handle where you drop a connection line to create a new edge.
   * @default 20
   */
  connectionRadius?: number;
  /**
   * Occasionally something may happen that causes React Flow to throw an error.
   *
   * Instead of exploding your application, we log a message to the console and then call this event handler.
   * You might use it for additional logging or to show a message to the user.
   */
  onError?: OnError;
  /**
   * This callback can be used to validate a new connection
   *
   * If you return `false`, the edge will not be added to your flow.
   * If you have custom connection logic its preferred to use this callback over the
   * `isValidConnection` prop on the handle component for performance reasons.
   */
  isValidConnection?: IsValidConnection<EdgeType>;
  /**
   * With a threshold greater than zero you can delay node drag events.
   * If threshold equals 1, you need to drag the node 1 pixel before a drag event is fired.
   * 1 is the default value, so that clicks don't trigger drag events.
   * @default 1
   */
  nodeDragThreshold?: number;
  /**
   * The threshold in pixels that the mouse must move before a connection line starts to drag.
   * This is useful to prevent accidental connections when clicking on a handle.
   * @default 1
   */
  connectionDragThreshold?: number;
  /** Sets a fixed width for the flow. */
  width?: number;
  /** Sets a fixed height for the flow. */
  height?: number;
  /**
   * Controls color scheme used for styling the flow.
   * @default 'light'
   * @example 'system' | 'light' | 'dark'
   */
  colorMode?: ColorMode;
  /**
   * If set `true`, some debug information will be logged to the console like which events are fired.
   * @default false
   */
  debug?: boolean;
  /**
   * Configuration for customizable labels, descriptions, and UI text. Provided keys will override the corresponding defaults.
   * Allows localization, customization of ARIA descriptions, control labels, minimap labels, and other UI strings.
   */
  ariaLabelConfig?: Partial<AriaLabelConfig>;
  /**
   * Used to define how z-indexing is calculated for nodes and edges.
   * 'auto' is for selections and sub flows, 'basic' for selections only, and 'manual' for no auto z-indexing.
   *
   * @default 'basic'
   */
  zIndexMode?: ZIndexMode;
}
