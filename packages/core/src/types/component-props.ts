import React, {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  WheelEvent,
} from 'react';

import {
  OnSelectionChangeFunc,
  NodeTypes,
  EdgeTypes,
  Node,
  Edge,
  ConnectionMode,
  ConnectionLineType,
  ConnectionLineComponent,
  OnConnectStart,
  OnConnectStop,
  OnConnectEnd,
  OnConnect,
  CoordinateExtent,
  KeyCode,
  PanOnScrollMode,
  OnEdgeUpdateFunc,
  OnInit,
  ProOptions,
  AttributionPosition,
  DefaultEdgeOptions,
  FitViewOptions,
  OnNodesDelete,
  OnEdgesDelete,
  OnNodesChange,
  OnEdgesChange,
  OnMove,
  OnMoveStart,
  OnMoveEnd,
  NodeDragHandler,
  NodeMouseHandler,
  SelectionDragHandler,
} from '.';
import { HandleType } from './handles';

export interface ReactFlowProps extends HTMLAttributes<HTMLDivElement> {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  defaultEdgeOptions?: DefaultEdgeOptions;
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onNodeClick?: NodeMouseHandler;
  onEdgeClick?: (event: React.MouseEvent, node: Edge) => void;
  onNodeDoubleClick?: NodeMouseHandler;
  onNodeMouseEnter?: NodeMouseHandler;
  onNodeMouseMove?: NodeMouseHandler;
  onNodeMouseLeave?: NodeMouseHandler;
  onNodeContextMenu?: NodeMouseHandler;
  onNodeDragStart?: NodeDragHandler;
  onNodeDrag?: NodeDragHandler;
  onNodeDragStop?: NodeDragHandler;
  onNodesDelete?: OnNodesDelete;
  onEdgesDelete?: OnEdgesDelete;
  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectStop?: OnConnectStop;
  onConnectEnd?: OnConnectEnd;
  onClickConnectStart?: OnConnectStart;
  onClickConnectStop?: OnConnectStop;
  onClickConnectEnd?: OnConnectEnd;
  onInit?: OnInit;
  onMove?: OnMove;
  onMoveStart?: OnMoveStart;
  onMoveEnd?: OnMoveEnd;
  onSelectionChange?: OnSelectionChangeFunc;
  onSelectionDragStart?: SelectionDragHandler;
  onSelectionDrag?: SelectionDragHandler;
  onSelectionDragStop?: SelectionDragHandler;
  onSelectionContextMenu?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onPaneScroll?: (event?: WheelEvent) => void;
  onPaneClick?: (event: ReactMouseEvent) => void;
  onPaneContextMenu?: (event: ReactMouseEvent) => void;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  connectionMode?: ConnectionMode;
  connectionLineType?: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  connectionLineComponent?: ConnectionLineComponent;
  connectionLineContainerStyle?: CSSProperties;
  deleteKeyCode?: KeyCode | null;
  selectionKeyCode?: KeyCode | null;
  multiSelectionKeyCode?: KeyCode | null;
  zoomActivationKeyCode?: KeyCode | null;
  snapToGrid?: boolean;
  snapGrid?: [number, number];
  onlyRenderVisibleElements?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  panOnDrag?: boolean;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  defaultPosition?: [number, number];
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
  onEdgeUpdate?: OnEdgeUpdateFunc;
  onEdgeContextMenu?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseEnter?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseMove?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseLeave?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeDoubleClick?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeUpdateStart?: (event: ReactMouseEvent, edge: Edge, handleType: HandleType) => void;
  onEdgeUpdateEnd?: (event: MouseEvent, edge: Edge, handleType: HandleType) => void;
  edgeUpdaterRadius?: number;
  noDragClassName?: string;
  noWheelClassName?: string;
  noPanClassName?: string;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  connectOnClick?: boolean;
  attributionPosition?: AttributionPosition;
  proOptions?: ProOptions;
  elevateEdgesOnSelect?: boolean;
}

export type ReactFlowRefType = HTMLDivElement;

export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptions;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
}

export interface ControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
