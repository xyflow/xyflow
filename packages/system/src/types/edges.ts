import { Position } from './utils';

export type EdgeBase<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined
> = {
  /** Unique id of an edge. */
  id: string;
  /** Type of edge defined in `edgeTypes`. */
  type?: EdgeType;
  /** Id of source node. */
  source: string;
  /** Id of target node. */
  target: string;
  /** Id of source handle, only needed if there are multiple handles per node. */
  sourceHandle?: string | null;
  /** Id of target handle, only needed if there are multiple handles per node. */
  targetHandle?: string | null;
  animated?: boolean;
  hidden?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  /** Arbitrary data passed to an edge. */
  data?: EdgeData;
  selected?: boolean;
  /**
   * Set the marker on the beginning of an edge.
   * @example 'arrow', 'arrowclosed' or custom marker
   */
  markerStart?: EdgeMarkerType;
  /**
   * Set the marker on the end of an edge.
   * @example 'arrow', 'arrowclosed' or custom marker
   */
  markerEnd?: EdgeMarkerType;
  zIndex?: number;
  ariaLabel?: string;
  /**
   * ReactFlow renders an invisible path around each edge to make them easier to click or tap on.
   * This property sets the width of that invisible path.
   */
  interactionWidth?: number;
};

export type SmoothStepPathOptions = {
  offset?: number;
  borderRadius?: number;
  stepPosition?: number;
};

export type StepPathOptions = {
  offset?: number;
};

export type BezierPathOptions = {
  curvature?: number;
};

/**
 * @inline
 */
export type DefaultEdgeOptionsBase<EdgeType extends EdgeBase> = Omit<
  EdgeType,
  'id' | 'source' | 'target' | 'sourceHandle' | 'targetHandle' | 'selected'
>;

/**
 * If you set the `connectionLineType` prop on your [`<ReactFlow />`](/api-reference/react-flow#connection-connectionLineType)
 *component, it will dictate the style of connection line rendered when creating
 *new edges.
 *
 * @public
 *
 * @remarks If you choose to render a custom connection line component, this value will be
 *passed to your component as part of its [`ConnectionLineComponentProps`](/api-reference/types/connection-line-component-props).
 */
export enum ConnectionLineType {
  Bezier = 'default',
  Straight = 'straight',
  Step = 'step',
  SmoothStep = 'smoothstep',
  SimpleBezier = 'simplebezier',
}

/**
 * Edges can optionally have markers at the start and end of an edge. The `EdgeMarker`
 *type is used to configure those markers! Check the docs for [`MarkerType`](/api-reference/types/marker-type)
 *for details on what types of edge marker are available.
 *
 * @public
 */
export type EdgeMarker = {
  type: MarkerType | `${MarkerType}`;
  color?: string | null;
  width?: number;
  height?: number;
  markerUnits?: string;
  orient?: string;
  strokeWidth?: number;
};

export type EdgeMarkerType = string | EdgeMarker;

/**
 * Edges may optionally have a marker on either end. The MarkerType type enumerates
 * the options available to you when configuring a given marker.
 *
 * @public
 */
export enum MarkerType {
  Arrow = 'arrow',
  ArrowClosed = 'arrowclosed',
}

export type MarkerProps = EdgeMarker & {
  id: string;
};

/**
 * @inline
 */
export type EdgePosition = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
};

export type EdgeLookup<EdgeType extends EdgeBase = EdgeBase> = Map<string, EdgeType>;

export type EdgeToolbarBaseProps = {
  /**
   * The `x` position of the edge toolbar.
   */
  x: number;
  /**
   * The `y` position of the edge toolbar.
   */
  y: number;
  /** If `true`, edge toolbar is visible even if edge is not selected.
   * @default false
   */
  isVisible?: boolean;
  /**
   * Align the vertical toolbar position relative to the passed x position.
   * @default "center"
   * @example 'left', 'center', 'right'
   */
  alignX?: 'left' | 'center' | 'right';
  /**
   * Align the horizontal toolbar position relative to the passed y position.
   * @default "center"
   * @example 'top', 'center', 'bottom'
   */
  alignY?: 'top' | 'center' | 'bottom';
};
