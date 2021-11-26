import { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { Selection as D3Selection, ZoomBehavior } from 'd3';

import { XYPosition, Rect, Transform, CoordinateExtent, Dimensions } from './utils';
import { NodeChange, EdgeChange } from './changes';
import { Node, NodeInternals, NodeDimensionUpdate, NodeDiffUpdate } from './nodes';
import { Edge } from './edges';
import { HandleType } from './handles';

export type FlowElement<T = any> = Node<T> | Edge<T>;

export type Elements<T = any> = Array<FlowElement<T>>;

export type NodeTypesType = { [key: string]: ReactNode };
export type EdgeTypesType = NodeTypesType;

export type FitView = (fitViewOptions?: FitViewParams) => void;

export type Project = (position: XYPosition) => XYPosition;

export type ToObject<T = any> = () => FlowExportObject<T>;

export type OnNodesChange = (nodes: NodeChange[]) => void;

export type OnEdgesChange = (nodes: EdgeChange[]) => void;

export type OnLoadParams<T = any> = {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (zoomLevel: number) => void;
  fitView: FitView;
  project: Project;
  getNodes: () => Node<T>[];
  getEdges: () => Edge<T>[];
  setTransform: (transform: FlowTransform) => void;
  toObject: ToObject<T>;
};

export type OnLoad<T = any> = (params: OnLoadParams<T>) => void;

export interface Connection {
  source: string | null;
  target: string | null;
  sourceHandle: string | null;
  targetHandle: string | null;
}

export enum ConnectionMode {
  Strict = 'strict',
  Loose = 'loose',
}

export type FlowExportObject<T = any> = {
  nodes: Node<T>[];
  edges: Edge<T>[];
  position: [number, number];
  zoom: number;
};

export type OnConnect = (connection: Connection) => void;

export type FitViewParams = {
  padding?: number;
  includeHiddenNodes?: boolean;
  minZoom?: number;
  maxZoom?: number;
};

export type OnConnectStartParams = {
  nodeId: string | null;
  handleId: string | null;
  handleType: HandleType | null;
};

export type OnConnectStart = (event: ReactMouseEvent, params: OnConnectStartParams) => void;

export type OnConnectStop = (event: MouseEvent) => void;

export type OnConnectEnd = (event: MouseEvent) => void;

export type SetConnectionId = {
  connectionNodeId: string | null;
  connectionHandleId: string | null;
  connectionHandleType: HandleType | null;
};

export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
}

export type FlowTransform = {
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

export interface ZoomPanHelperFunctions {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (zoomLevel: number) => void;
  transform: (transform: FlowTransform) => void;
  fitView: FitView;
  setCenter: (x: number, y: number, zoom?: number) => void;
  fitBounds: (bounds: Rect, padding?: number) => void;
  project: (position: XYPosition) => XYPosition;
  initialized: boolean;
}

export type InitD3ZoomPayload = {
  d3Zoom: ZoomBehavior<Element, unknown>;
  d3Selection: D3Selection<Element, unknown, null, undefined>;
  d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
  transform: Transform;
};

export type ReactFlowStore = {
  width: number;
  height: number;
  transform: Transform;
  nodeInternals: NodeInternals;
  edges: Edge[];
  selectedNodesBbox: Rect;
  onNodesChange: OnNodesChange | null;
  onEdgesChange: OnEdgesChange | null;

  d3Zoom: ZoomBehavior<Element, unknown> | null;
  d3Selection: D3Selection<Element, unknown, null, undefined> | null;
  d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
  minZoom: number;
  maxZoom: number;
  translateExtent: CoordinateExtent;
  nodeExtent: CoordinateExtent;

  nodesSelectionActive: boolean;
  userSelectionActive: boolean;

  connectionNodeId: string | null;
  connectionHandleId: string | null;
  connectionHandleType: HandleType | null;
  connectionPosition: XYPosition;
  connectionMode: ConnectionMode;

  snapToGrid: boolean;
  snapGrid: SnapGrid;

  nodesDraggable: boolean;
  nodesConnectable: boolean;
  elementsSelectable: boolean;

  multiSelectionActive: boolean;

  reactFlowVersion: string;
};

export type ReactFlowActions = {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
  updateNodePosition: (update: NodeDiffUpdate) => void;
  setNodesSelectionActive: (isActive: boolean) => void;
  setUserSelectionActive: (isActive: boolean) => void;
  resetSelectedElements: () => void;
  unselectNodesAndEdges: () => void;
  addSelectedNodes: (nodeIds: string[]) => void;
  addSelectedEdges: (edgeIds: string[]) => void;
  updateTransform: (transform: Transform) => void;
  updateSize: (size: Dimensions) => void;
  initD3Zoom: (payload: InitD3ZoomPayload) => void;
  setMinZoom: (minZoom: number) => void;
  setMaxZoom: (maxZoom: number) => void;
  setTranslateExtent: (translateExtent: CoordinateExtent) => void;
  setNodeExtent: (nodeExtent: CoordinateExtent) => void;
  setOnConnect: (onConnectFunction: OnConnect) => void;
  setOnConnectStart: (onConnectFunction: OnConnectStart) => void;
  setOnConnectStop: (onConnectFunction: OnConnectStop) => void;
  setOnConnectEnd: (onConnectFunction: OnConnectEnd) => void;
  setConnectionPosition: (connectionPosition: XYPosition) => void;
  setConnectionNodeId: (payload: SetConnectionId) => void;
  setSnapToGrid: (snapToGrid: boolean) => void;
  setSnapGrid: (snapGrid: SnapGrid) => void;
  setInteractive: (isInteractive: boolean) => void;
  setNodesDraggable: (nodesDraggable: boolean) => void;
  setNodesConnectable: (nodesConnectable: boolean) => void;
  setElementsSelectable: (elementsSelectable: boolean) => void;
  setMultiSelectionActive: (multiSelectionActive: boolean) => void;
  setConnectionMode: (connectionMode: ConnectionMode) => void;
  setOnNodesChange: (onNodesChange: OnNodesChange) => void;
  setOnEdgesChange: (onEdgesChange: OnEdgesChange) => void;

  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectStop?: OnConnectStop;
  onConnectEnd?: OnConnectEnd;

  reset: () => void;
};

export type ReactFlowState = ReactFlowStore & ReactFlowActions;

export type UpdateNodeInternals = (nodeId: string) => void;

export type OnSelectionChangeFunc = (params: { nodes: Node[]; edges: Edge[] }) => void;
