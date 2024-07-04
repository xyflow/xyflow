import { Position } from './utils';

export type EdgeBase<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined
> = {
  /** Unique id of an edge */
  id: string;
  /** Type of an edge defined in edgeTypes */
  type?: EdgeType;
  /** Id of source node */
  source: string;
  /** Id of target node */
  target: string;
  /** Id of source handle
   * only needed if there are multiple handles per node
   */
  sourceHandle?: string | null;
  /** Id of target handle
   * only needed if there are multiple handles per node
   */
  targetHandle?: string | null;
  animated?: boolean;
  hidden?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  /** Arbitrary data passed to an edge */
  data?: EdgeData;
  selected?: boolean;
  /** Set the marker on the beginning of an edge
   * @example 'arrow', 'arrowclosed' or custom marker
   */
  markerStart?: EdgeMarkerType;
  /** Set the marker on the end of an edge
   * @example 'arrow', 'arrowclosed' or custom marker
   */
  markerEnd?: EdgeMarkerType;
  zIndex?: number;
  ariaLabel?: string;
  /** Padding around the edge where interaction is still possible */
  interactionWidth?: number;
};

export type SmoothStepPathOptions = {
  offset?: number;
  borderRadius?: number;
};

export type StepPathOptions = {
  offset?: number;
};

export type BezierPathOptions = {
  curvature?: number;
};

export type DefaultEdgeOptionsBase<EdgeType extends EdgeBase> = Omit<
  EdgeType,
  'id' | 'source' | 'target' | 'sourceHandle' | 'targetHandle' | 'selected'
>;

export enum ConnectionLineType {
  Bezier = 'default',
  Straight = 'straight',
  Step = 'step',
  SmoothStep = 'smoothstep',
  SimpleBezier = 'simplebezier',
}

export type EdgeMarker = {
  type: MarkerType;
  color?: string;
  width?: number;
  height?: number;
  markerUnits?: string;
  orient?: string;
  strokeWidth?: number;
};

export type EdgeMarkerType = string | EdgeMarker;

export enum MarkerType {
  Arrow = 'arrow',
  ArrowClosed = 'arrowclosed',
}

export type MarkerProps = EdgeMarker & {
  id: string;
};

export type EdgePosition = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
};

export type EdgeLookup<EdgeType extends EdgeBase = EdgeBase> = Map<string, EdgeType>;
