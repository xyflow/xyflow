import type { EdgeBase, Position } from '@xyflow/system';
import type { Component, CSSProperties, SVGAttributes, VNode } from 'vue';
import type { EdgeComponent, EdgeTextProps } from './components';
import type { ClassValue, Styles } from './flow';

/** Edge markers */
export enum MarkerType {
  Arrow = 'arrow',
  ArrowClosed = 'arrowclosed',
}

/** Edge marker definition */
export interface EdgeMarker {
  /** Unique marker id */
  id?: string;
  /** Marker type */
  type: MarkerType;
  /** Marker color */
  color?: string;
  /** Marker width */
  width?: number;
  /** Marker height */
  height?: number;
  /** Marker units */
  markerUnits?: string;
  /** Marker orientation */
  orient?: string;
  /** Marker stroke width */
  strokeWidth?: number;
}

export interface MarkerProps {
  id: string;
  type: MarkerType | string;
  /** Marker color; `null`/unset lets the `--xy-edge-stroke` CSS variable drive the arrowhead color */
  color?: string | null;
  width?: number;
  height?: number;
  markerUnits?: string;
  orient?: string;
  strokeWidth?: number;
}

export type EdgeMarkerType = string | EdgeMarker;

export type EdgeReconnectable = boolean | 'target' | 'source';

export interface EdgeLabelOptions {
  /** Label styles (CSSProperties) */
  labelStyle?: CSSProperties;
  /** Show label bg */
  labelShowBg?: boolean;
  /** Label Bg styles (CSSProperties) */
  labelBgStyle?: CSSProperties;
  /** Label Bg padding */
  labelBgPadding?: [number, number];
  /** Label Bg border radius */
  labelBgBorderRadius?: number;
}

/**
 * User-facing edge type — reuses `@xyflow/system`'s `EdgeBase` (id, source/target(+handles), type,
 * animated, markers, data, deletable/selectable/selected, hidden, zIndex, ariaLabel, interactionWidth)
 * plus vue-flow-specific fields, mirroring how xyflow/react does `Edge = EdgeBase & EdgeLabelOptions & {…}`.
 */
export interface DefaultEdge<Data extends Record<string, unknown> = Record<string, unknown>, Type extends string = string>
  extends EdgeBase<Data, Type>,
  EdgeLabelOptions {
  /** An edge label */
  label?: string | VNode | Component<EdgeTextProps>;
  /** EdgeMarker — vue-flow's `EdgeMarkerType` (own `MarkerType` enum + `EdgeMarker`), overriding `EdgeBase`'s */
  markerStart?: EdgeMarkerType;
  /** EdgeMarker */
  markerEnd?: EdgeMarkerType;
  /** Disable/enable updating edge */
  reconnectable?: EdgeReconnectable;
  /** Disable/enable focusing edge (a11y) */
  focusable?: boolean;
  /** Additional class names */
  class?: ClassValue;
  /** Additional styles */
  style?: Styles;
  /** Overwrites current edge type */
  template?: EdgeComponent;
  /**
   * General escape hatch for adding custom attributes to the edge's DOM element.
   */
  domAttributes?: Omit<
    SVGAttributes,
    | 'id'
    | 'style'
    | 'className'
    | 'role'
    | 'aria-label'
    | 'onClick'
    | 'onMouseenter'
    | 'onMousemove'
    | 'onMouseleave'
    | 'onContextmenu'
    | 'onDblclick'
    | 'onKeyDown'
  >;
}

export interface SmoothStepPathOptions {
  offset?: number;
  borderRadius?: number;
  /** where the bend sits along the path: 0 = at source, 1 = at target, 0.5 = midpoint @default 0.5 */
  stepPosition?: number;
}

export type SmoothStepEdgeType<Data extends Record<string, unknown> = Record<string, unknown>> = DefaultEdge<Data> & {
  type: 'smoothstep';
  pathOptions?: SmoothStepPathOptions;
};

export interface BezierPathOptions {
  curvature?: number;
}

export type BezierEdgeType<Data extends Record<string, unknown> = Record<string, unknown>> = DefaultEdge<Data> & {
  type: 'default';
  pathOptions?: BezierPathOptions;
};

export type Edge<Data extends Record<string, unknown> = Record<string, unknown>, Type extends string = string>
  = | DefaultEdge<Data, Type>
    | SmoothStepEdgeType<Data>
    | BezierEdgeType<Data>;

export type DefaultEdgeOptions = Omit<Edge, 'id' | 'source' | 'target' | 'sourceHandle' | 'targetHandle' | 'selected'>;

/**
 * The computed positions an edge renders with — a render-OUTPUT type (xyflow's `EdgePosition`),
 * computed per render from the source/target `InternalNode`s. Never stored on an edge.
 */
export interface EdgePositions {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

/**
 * Props passed to edge components. No `sourceNode`/`targetNode` (resolve them with `useInternalNode`);
 * handles are exposed as `sourceHandleId`/`targetHandleId`; markers are pre-resolved to url strings.
 */
export interface EdgeProps<EdgeType extends Edge = Edge> extends EdgeLabelOptions, EdgePositions {
  id: string;
  source: string;
  target: string;
  // optional, matching the verbatim model + RF's Pick: defaults are no longer stamped onto stored edges,
  // so `type`/`data` are genuinely undefined at runtime when the user didn't set them
  type?: EdgeType['type'];
  label?: string | VNode | Component<EdgeTextProps> | object;
  style?: CSSProperties;
  selected?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  sourcePosition: Position;
  targetPosition: Position;
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
  animated?: boolean;
  reconnectable?: EdgeReconnectable;
  // optional: an edge without markers has none at runtime, and `EdgeWrapper` passes them through
  // verbatim. Typed as required, a custom edge's `defineProps<EdgeProps>()` generates required runtime
  // props and Vue warns "Invalid prop 'markerStart' … Expected String, got Undefined". (Matches `Edge`,
  // `BaseEdgeProps` and xyflow/react, which all have these optional.)
  markerStart?: string;
  markerEnd?: string;
  curvature?: number;
  interactionWidth?: number;
  data?: EdgeType['data'];
}

export interface BaseEdgeProps extends EdgeLabelOptions {
  id?: string;
  labelX?: number;
  labelY?: number;
  path: string;
  label?: any;
  markerStart?: string;
  markerEnd?: string;
  interactionWidth?: number;
}

export type BezierEdgeProps = EdgePositions
  & BezierPathOptions
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>
  & Pick<EdgeProps, 'sourcePosition' | 'targetPosition'>;

export type SimpleBezierEdgeProps = EdgePositions
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>
  & Pick<EdgeProps, 'sourcePosition' | 'targetPosition'>;

export type StraightEdgeProps = EdgePositions & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>;

export type StepEdgeProps = EdgePositions
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>
  & Pick<EdgeProps, 'sourcePosition' | 'targetPosition'>;

export type SmoothStepEdgeProps = EdgePositions
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>
  & Pick<EdgeProps, 'sourcePosition' | 'targetPosition'>
  & SmoothStepPathOptions;
