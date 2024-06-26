/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Selection as D3Selection } from 'd3-selection';
import type { D3DragEvent, SubjectPosition } from 'd3-drag';
import type { ZoomBehavior } from 'd3-zoom';
// this is needed for the Selection type to include the transition function :/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Transition } from 'd3-transition';

import type { XYPosition, Rect } from './utils';
import type { InternalNodeBase, NodeBase, NodeDragItem, NodeOrigin } from './nodes';
import type { ConnectingHandle, HandleType } from './handles';
import { PanZoomInstance } from './panzoom';
import { EdgeBase } from '..';

export type Project = (position: XYPosition) => XYPosition;

export type OnMove = (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
export type OnMoveStart = OnMove;
export type OnMoveEnd = OnMove;

export type ZoomInOut = (options?: ViewportHelperFunctionOptions) => void;
export type ZoomTo = (zoomLevel: number, options?: ViewportHelperFunctionOptions) => void;
export type GetZoom = () => number;
export type GetViewport = () => Viewport;
export type SetViewport = (viewport: Viewport, options?: ViewportHelperFunctionOptions) => void;
export type SetCenter = (x: number, y: number, options?: SetCenterOptions) => void;
export type FitBounds = (bounds: Rect, options?: FitBoundsOptions) => void;

export type Connection = {
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
};

export type HandleConnection = Connection & {
  edgeId: string;
};

export enum ConnectionMode {
  Strict = 'strict',
  Loose = 'loose',
}

export type OnConnectStartParams = {
  nodeId: string | null;
  handleId: string | null;
  handleType: HandleType | null;
};

export type OnConnectStart = (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => void;
export type OnConnect = (connection: Connection) => void;
export type OnConnectEnd = (event: MouseEvent | TouchEvent) => void;

export type IsValidConnection = (edge: EdgeBase | Connection) => boolean;

export type FitViewParamsBase<NodeType extends NodeBase> = {
  nodeLookup: Map<string, InternalNodeBase<NodeType>>;
  width: number;
  height: number;
  panZoom: PanZoomInstance;
  minZoom: number;
  maxZoom: number;
  nodeOrigin?: NodeOrigin;
};

export type FitViewOptionsBase<NodeType extends NodeBase = NodeBase> = {
  padding?: number;
  includeHiddenNodes?: boolean;
  minZoom?: number;
  maxZoom?: number;
  duration?: number;
  nodes?: (NodeType | { id: string })[];
};

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

export type OnViewportChange = (viewport: Viewport) => void;

export type D3ZoomInstance = ZoomBehavior<Element, unknown>;
export type D3SelectionInstance = D3Selection<Element, unknown, null, undefined>;
export type D3ZoomHandler = (this: Element, event: any, d: unknown) => void;

export type UpdateNodeInternals = (nodeId: string | string[]) => void;

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

export type UpdateNodePositions = (dragItems: Map<string, NodeDragItem | InternalNodeBase>, dragging?: boolean) => void;
export type PanBy = (delta: XYPosition) => boolean;

export type NoConnectionInProgress = {
  position: XYPosition;
  isValid: null;
  fromHandle: null;
  toHandle: null;
};

export type ConnectionInProgress = {
  position: XYPosition;
  isValid: boolean | null;
  fromHandle: ConnectingHandle;
  toHandle: ConnectingHandle | null;
};

export type ConnectionState = ConnectionInProgress | NoConnectionInProgress;

export type UpdateConnection = (params: ConnectionState) => void;

export type ColorModeClass = 'light' | 'dark';
export type ColorMode = ColorModeClass | 'system';

export type ConnectionLookup = Map<string, Map<string, HandleConnection>>;

export type OnBeforeDeleteBase<NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase> = ({
  nodes,
  edges,
}: {
  nodes: NodeType[];
  edges: EdgeType[];
}) => Promise<boolean | { nodes: NodeType[]; edges: EdgeType[] }>;
