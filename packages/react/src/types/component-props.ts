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
  IsValidConnection,
  ColorMode,
  SnapGrid,
} from '@xyflow/system';

import type {
  OnSelectionChangeFunc,
  NodeTypes,
  EdgeTypes,
  Node,
  Edge,
  ConnectionLineComponent,
  OnEdgeUpdateFunc,
  OnInit,
  DefaultEdgeOptions,
  FitViewOptions,
  OnNodesDelete,
  OnEdgesDelete,
  OnDelete,
  OnNodesChange,
  OnEdgesChange,
  NodeDragHandler,
  NodeMouseHandler,
  SelectionDragHandler,
  EdgeMouseHandler,
} from '.';

export type ReactFlowProps = Omit<HTMLAttributes<HTMLDivElement>, 'onError'> & {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  defaultEdgeOptions?: DefaultEdgeOptions;
  onNodeClick?: NodeMouseHandler;
  onNodeDoubleClick?: NodeMouseHandler;
  onNodeMouseEnter?: NodeMouseHandler;
  onNodeMouseMove?: NodeMouseHandler;
  onNodeMouseLeave?: NodeMouseHandler;
  onNodeContextMenu?: NodeMouseHandler;
  onNodeDragStart?: NodeDragHandler;
  onNodeDrag?: NodeDragHandler;
  onNodeDragStop?: NodeDragHandler;
  onEdgeClick?: (event: ReactMouseEvent, node: Edge) => void;
  onEdgeUpdate?: OnEdgeUpdateFunc;
  onEdgeContextMenu?: EdgeMouseHandler;
  onEdgeMouseEnter?: EdgeMouseHandler;
  onEdgeMouseMove?: EdgeMouseHandler;
  onEdgeMouseLeave?: EdgeMouseHandler;
  onEdgeDoubleClick?: EdgeMouseHandler;
  onEdgeUpdateStart?: (event: ReactMouseEvent, edge: Edge, handleType: HandleType) => void;
  onEdgeUpdateEnd?: (event: MouseEvent | TouchEvent, edge: Edge, handleType: HandleType) => void;
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onNodesDelete?: OnNodesDelete;
  onEdgesDelete?: OnEdgesDelete;
  onDelete?: OnDelete;
  onSelectionDragStart?: SelectionDragHandler;
  onSelectionDrag?: SelectionDragHandler;
  onSelectionDragStop?: SelectionDragHandler;
  onSelectionStart?: (event: ReactMouseEvent) => void;
  onSelectionEnd?: (event: ReactMouseEvent) => void;
  onSelectionContextMenu?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;
  onClickConnectStart?: OnConnectStart;
  onClickConnectEnd?: OnConnectEnd;
  onInit?: OnInit;
  onMove?: OnMove;
  onMoveStart?: OnMoveStart;
  onMoveEnd?: OnMoveEnd;
  onSelectionChange?: OnSelectionChangeFunc;
  onPaneScroll?: (event?: WheelEvent) => void;
  onPaneClick?: (event: ReactMouseEvent) => void;
  onPaneContextMenu?: (event: ReactMouseEvent | MouseEvent) => void;
  onPaneMouseEnter?: (event: ReactMouseEvent) => void;
  onPaneMouseMove?: (event: ReactMouseEvent) => void;
  onPaneMouseLeave?: (event: ReactMouseEvent) => void;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  connectionLineType?: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  connectionLineComponent?: ConnectionLineComponent;
  connectionLineContainerStyle?: CSSProperties;
  connectionMode?: ConnectionMode;
  deleteKeyCode?: KeyCode | null;
  selectionKeyCode?: KeyCode | null;
  selectionOnDrag?: boolean;
  selectionMode?: SelectionMode;
  panActivationKeyCode?: KeyCode | null;
  multiSelectionKeyCode?: KeyCode | null;
  zoomActivationKeyCode?: KeyCode | null;
  snapToGrid?: boolean;
  snapGrid?: SnapGrid;
  onlyRenderVisibleElements?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  nodesFocusable?: boolean;
  nodeOrigin?: NodeOrigin;
  edgesFocusable?: boolean;
  edgesUpdatable?: boolean;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  panOnDrag?: boolean | number[];
  minZoom?: number;
  maxZoom?: number;
  viewport?: Viewport;
  defaultViewport?: Viewport;
  onViewportChange?: (viewport: Viewport) => void;
  translateExtent?: CoordinateExtent;
  preventScrolling?: boolean;
  nodeExtent?: CoordinateExtent;
  defaultMarkerColor?: string;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  panOnScrollMode?: PanOnScrollMode;
  zoomOnDoubleClick?: boolean;
  edgeUpdaterRadius?: number;
  noDragClassName?: string;
  noWheelClassName?: string;
  noPanClassName?: string;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  connectOnClick?: boolean;
  attributionPosition?: PanelPosition;
  proOptions?: ProOptions;
  elevateNodesOnSelect?: boolean;
  elevateEdgesOnSelect?: boolean;
  disableKeyboardA11y?: boolean;
  autoPanOnNodeDrag?: boolean;
  autoPanOnConnect?: boolean;
  connectionRadius?: number;
  onError?: OnError;
  isValidConnection?: IsValidConnection;
  nodeDragThreshold?: number;
  width?: number;
  height?: number;
  colorMode?: ColorMode;
};

export type ReactFlowRefType = HTMLDivElement;
