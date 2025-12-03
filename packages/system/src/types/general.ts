/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Selection as D3Selection } from 'd3-selection';
import type { D3DragEvent, SubjectPosition } from 'd3-drag';
import type { ZoomBehavior } from 'd3-zoom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- this is needed for the Selection type to include the transition function :/
import type { Transition } from 'd3-transition';

import type { XYPosition, Rect, Position } from './utils';
import type { InternalNodeBase, NodeBase, NodeDragItem } from './nodes';
import type { Handle, HandleType } from './handles';
import { PanZoomInstance } from './panzoom';
import { EdgeBase } from '..';

export type Project = (position: XYPosition) => XYPosition;

/**
 * This type is used to define the `onMove` handler.
 */
export type OnMove = (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
export type OnMoveStart = OnMove;
export type OnMoveEnd = OnMove;

/**
 * @inline
 */
export type ZoomInOut = (options?: ViewportHelperFunctionOptions) => Promise<boolean>;
/**
 * @inline
 */
export type ZoomTo = (zoomLevel: number, options?: ViewportHelperFunctionOptions) => Promise<boolean>;
/**
 * @inline
 */
export type GetZoom = () => number;
/**
 * @inline
 */
export type GetViewport = () => Viewport;

/**
 * The `SetViewport` function is used to set the viewport of the flow.
 *
 * @inline
 * @param viewport - The viewport to set.
 * @param options - Optional parameters to control the animation and easing of the viewport change.
 */
export type SetViewport = (viewport: Viewport, options?: ViewportHelperFunctionOptions) => Promise<boolean>;

/**
 * The `SetCenter` function is used to set the center of the flow viewport to a specific position
 *
 * @inline
 * @param x - x coordinate
 * @param y - y coordinate
 * @param options - Optional parameters to control the animation and easing of the viewport change.
 */
export type SetCenter = (x: number, y: number, options?: SetCenterOptions) => Promise<boolean>;

/**
 * The `FitBounds` function is used to fit the flow viewport to the bounds of the nodes.
 *
 * @inline
 * @param bounds - The bounds to fit the viewport to.
 * @param options - Optional parameters to control the animation and easing of the viewport change.
 */
export type FitBounds = (bounds: Rect, options?: FitBoundsOptions) => Promise<boolean>;

/**
 * The `Connection` type is the basic minimal description of an [`Edge`](/api-reference/types/edge)
 * between two nodes. The [`addEdge`](/api-reference/utils/add-edge) util can be used to upgrade
 * a `Connection` to an [`Edge`](/api-reference/types/edge).
 *
 * @public
 */
export type Connection = {
  /** The id of the node this connection originates from. */
  source: string;
  /** The id of the node this connection terminates at. */
  target: string;
  /** When not `null`, the id of the handle on the source node that this connection originates from. */
  sourceHandle: string | null;
  /** When not `null`, the id of the handle on the target node that this connection terminates at. */
  targetHandle: string | null;
};

/**
 * The `HandleConnection` type is an extension of a basic [Connection](/api-reference/types/connection) that includes the `edgeId`.
 */
export type HandleConnection = Connection & {
  edgeId: string;
};

/**
 * The `NodeConnection` type is an extension of a basic [Connection](/api-reference/types/connection) that includes the `edgeId`.
 *
 */
export type NodeConnection = Connection & {
  edgeId: string;
};

/**
 * The `ConnectionMode` is used to set the mode of connection between nodes.
 * The `Strict` mode is the default one and only allows source to target edges.
 * `Loose` mode allows source to source and target to target edges as well.
 *
 * @public
 */
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
export type OnConnectEnd = (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => void;

export type OnReconnect<EdgeType extends EdgeBase = EdgeBase> = (oldEdge: EdgeType, newConnection: Connection) => void;
export type OnReconnectStart<EdgeType extends EdgeBase = EdgeBase> = (
  event: MouseEvent | TouchEvent,
  edge: EdgeType,
  handleType: HandleType
) => void;
export type OnReconnectEnd<EdgeType extends EdgeBase = EdgeBase> = (
  event: MouseEvent | TouchEvent,
  edge: EdgeType,
  handleType: HandleType,
  connectionState: FinalConnectionState
) => void;

export type IsValidConnection = (edge: EdgeBase | Connection) => boolean;

/**
 * @inline
 */
export type FitViewParamsBase<NodeType extends NodeBase> = {
  nodes: Map<string, InternalNodeBase<NodeType>>;
  width: number;
  height: number;
  panZoom: PanZoomInstance;
  minZoom: number;
  maxZoom: number;
};

export type PaddingUnit = 'px' | '%';
export type PaddingWithUnit = `${number}${PaddingUnit}` | number;

export type Padding =
  | PaddingWithUnit
  | {
      top?: PaddingWithUnit;
      right?: PaddingWithUnit;
      bottom?: PaddingWithUnit;
      left?: PaddingWithUnit;
      x?: PaddingWithUnit;
      y?: PaddingWithUnit;
    };

/**
 * @inline
 */
export type FitViewOptionsBase<NodeType extends NodeBase = NodeBase> = {
  padding?: Padding;
  includeHiddenNodes?: boolean;
  minZoom?: number;
  maxZoom?: number;
  duration?: number;
  ease?: (t: number) => number;
  interpolate?: 'smooth' | 'linear';
  nodes?: (NodeType | { id: string })[];
};

/**
 * Internally, React Flow maintains a coordinate system that is independent of the
 * rest of the page. The `Viewport` type tells you where in that system your flow
 * is currently being display at and how zoomed in or out it is.
 *
 * @public
 * @remarks A `Transform` has the same properties as the viewport, but they represent
 * different things. Make sure you don't get them muddled up or things will start
 * to look weird!
 *
 */
export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export type KeyCode = string | Array<string>;

export type SnapGrid = [number, number];

/**
 * This enum is used to set the different modes of panning the viewport when the
 * user scrolls. The `Free` mode allows the user to pan in any direction by scrolling
 * with a device like a trackpad. The `Vertical` and `Horizontal` modes restrict
 * scroll panning to only the vertical or horizontal axis, respectively.
 *
 * @public
 */
export enum PanOnScrollMode {
  Free = 'free',
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

/**
 * @inline
 */
export type ViewportHelperFunctionOptions = {
  duration?: number;
  ease?: (t: number) => number;
  interpolate?: 'smooth' | 'linear';
};

/**
 * @inline
 */
export type SetCenterOptions = ViewportHelperFunctionOptions & {
  zoom?: number;
};

/**
 * @inline
 */
export type FitBoundsOptions = ViewportHelperFunctionOptions & {
  padding?: number;
};

export type OnViewportChange = (viewport: Viewport) => void;

export type D3ZoomInstance = ZoomBehavior<Element, unknown>;
export type D3SelectionInstance = D3Selection<Element, unknown, null, undefined>;
export type D3ZoomHandler = (this: Element, event: any, d: unknown) => void;

export type UpdateNodeInternals = (nodeId: string | string[]) => void;

/**
 * This type is mostly used to help position things on top of the flow viewport. For
 * example both the [`<MiniMap />`](/api-reference/components/minimap) and
 * [`<Controls />`](/api-reference/components/controls) components take a `position`
 * prop of this type.
 *
 * @public
 */
export type PanelPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center-left'
  | 'center-right';

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
export type PanBy = (delta: XYPosition) => Promise<boolean>;

export const initialConnection: NoConnection = {
  inProgress: false,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null,
};

export type NoConnection = {
  inProgress: false;
  isValid: null;
  from: null;
  fromHandle: null;
  fromPosition: null;
  fromNode: null;
  to: null;
  toHandle: null;
  toPosition: null;
  toNode: null;
  pointer: null;
};
export type ConnectionInProgress<NodeType extends InternalNodeBase = InternalNodeBase> = {
  /** Indicates whether a connection is currently in progress. */
  inProgress: true;
  /**
   * If an ongoing connection is above a handle or inside the connection radius, this will be `true`
   * or `false`, otherwise `null`.
   */
  isValid: boolean | null;
  /** Returns the xy start position or `null` if no connection is in progress. */
  from: XYPosition;
  /** Returns the start handle or `null` if no connection is in progress. */
  fromHandle: Handle;
  /** Returns the side (called position) of the start handle or `null` if no connection is in progress. */
  fromPosition: Position;
  /** Returns the start node or `null` if no connection is in progress. */
  fromNode: NodeType;
  /** Returns the xy end position or `null` if no connection is in progress. */
  to: XYPosition;
  /** Returns the end handle or `null` if no connection is in progress. */
  toHandle: Handle | null;
  /** Returns the side (called position) of the end handle or `null` if no connection is in progress. */
  toPosition: Position;
  /** Returns the end node or `null` if no connection is in progress. */
  toNode: NodeType | null;
  /** Returns the pointer position or `null` if no connection is in progress. */
  pointer: XYPosition;
};

/**
 * The `ConnectionState` type bundles all information about an ongoing connection.
 * It is returned by the [`useConnection`](/api-reference/hooks/use-connection) hook.
 *
 * @public
 */
export type ConnectionState<NodeType extends InternalNodeBase = InternalNodeBase> =
  | ConnectionInProgress<NodeType>
  | NoConnection;

export type FinalConnectionState<NodeType extends InternalNodeBase = InternalNodeBase> = Omit<
  ConnectionState<NodeType>,
  'inProgress'
>;

export type UpdateConnection<NodeType extends InternalNodeBase = InternalNodeBase> = (
  params: ConnectionState<NodeType>
) => void;

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

/**
 * The `ZIndexMode` type is used to define how z-indexing is calculated for nodes and edges.
 * `auto` mode will automatically manage z-indexing for selections and sub flows.
 * `basic` mode will only manage z-indexing for selections.
 * `manual` mode does not apply any automatic z-indexing.
 *
 * @public
 */
export type ZIndexMode = 'auto' | 'basic' | 'manual';
