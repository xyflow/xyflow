import { Position } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EdgeBase<EdgeData = any> = {
  /** unique id of an edge */
  id: string;
  /** type of an edge defined in edgeTypes */
  type?: string;
  /** id of source node */
  source: string;
  /** id of target node */
  target: string;
  /** id of source handle
   * only needed if there are multiple handles per node
   */
  sourceHandle?: string | null;
  /** id of target handle
   * only needed if there are multiple handles per node
   */
  targetHandle?: string | null;
  animated?: boolean;
  hidden?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  /** arbitrary data passed to an edge */
  data?: EdgeData;
  selected?: boolean;
  /** set the marker on the beginning of an edge
   * @example 'arrow', 'arrowclosed' or custom marker
   */
  markerStart?: EdgeMarkerType;
  /** set the marker on the end of an edge
   * @example 'arrow', 'arrowclosed' or custom marker
   */
  markerEnd?: EdgeMarkerType;
  zIndex?: number;
  ariaLabel?: string;
  /** padding around the edge where interaction is still possible */
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
