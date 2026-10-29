import type { BezierPathOptions, DefaultEdgeOptionsBase, EdgeBase, EdgeMarkerType, EdgePosition, SmoothStepPathOptions } from '@xyflow/system';
import type { Component, CSSProperties, SVGAttributes, VNode } from 'vue';
import type { EdgeTextProps } from './components';
import type { ClassValue, Styles } from './flow';

export type EdgeReconnectable = boolean | 'target' | 'source';

export interface EdgeLabelOptions {
  /** Custom styles to apply to the label. */
  labelStyle?: CSSProperties;
  /** Render a background rectangle behind the label. */
  labelShowBg?: boolean;
  /** Inline style applied to the label background rectangle. */
  labelBgStyle?: CSSProperties;
  /** Padding around the label inside its background, as `[x, y]` in pixels. */
  labelBgPadding?: [number, number];
  /** Border radius of the label background, in pixels. */
  labelBgBorderRadius?: number;
}

/**
 * A `DefaultEdge` is the complete description with everything Vue Flow needs to know in order to
 * render it.
 */
export interface DefaultEdge<Data extends Record<string, unknown> = Record<string, unknown>, Type extends string = string>
  extends EdgeBase<Data, Type>,
  EdgeLabelOptions {
  /**
   * The label or custom element to render along the edge. This is commonly a text label or some
   * custom controls.
   */
  label?: string | VNode | Component<EdgeTextProps>;
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
  /**
   * Determines whether the edge can be updated by dragging the source or target to a new node. This
   * property overrides the default set by the `edgesReconnectable` prop on the `<VueFlow />` component.
   */
  reconnectable?: EdgeReconnectable;
  /** Disable/enable focusing edge (a11y) */
  focusable?: boolean;
  /** Additional class names */
  class?: ClassValue;
  /** Additional styles */
  style?: Styles;
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

export type SmoothStepEdgeType<Data extends Record<string, unknown> = Record<string, unknown>> = DefaultEdge<Data> & {
  type: 'smoothstep';
  pathOptions?: SmoothStepPathOptions;
};

export type BezierEdgeType<Data extends Record<string, unknown> = Record<string, unknown>> = DefaultEdge<Data> & {
  type: 'default';
  pathOptions?: BezierPathOptions;
};

export type Edge<Data extends Record<string, unknown> = Record<string, unknown>, Type extends string = string>
  = | DefaultEdge<Data, Type>
    | SmoothStepEdgeType<Data>
    | BezierEdgeType<Data>;

/**
 * Many properties on an `Edge` are optional. When a new edge is created, the properties that are not
 * provided will be filled in with the default values passed to the `defaultEdgeOptions` prop of the
 * `<VueFlow />` component.
 */
export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;

/**
 * When you implement a custom edge it is wrapped in a component that enables some basic functionality.
 * The `EdgeProps` type is the props that are passed to that component. No `sourceNode`/`targetNode`
 * (resolve them with `useInternalNode`); handles are exposed as `sourceHandleId`/`targetHandleId`;
 * markers are pre-resolved to url strings.
 */
export interface EdgeProps<EdgeType extends Edge = Edge> extends EdgeLabelOptions, EdgePosition {
  /** Unique id of an edge. */
  id: string;
  /** Id of source node. */
  source: string;
  /** Id of target node. */
  target: string;
  /** Type of edge defined in `edgeTypes`. */
  type?: EdgeType['type'];
  /**
   * The label or custom element to render along the edge. This is commonly a text label or some
   * custom controls.
   */
  label?: string | VNode | Component<EdgeTextProps>;
  /** Inline style applied to the edge path. */
  style?: CSSProperties;
  /** Whether the edge is currently selected. */
  selected?: boolean;
  /** Whether the edge can be selected. */
  selectable?: boolean;
  /** Whether the edge can be deleted. */
  deletable?: boolean;
  /** Id of source handle, only needed if there are multiple handles per node. */
  sourceHandleId?: string | null;
  /** Id of target handle, only needed if there are multiple handles per node. */
  targetHandleId?: string | null;
  /** Whether the edge path is animated. */
  animated?: boolean;
  /** Whether the edge can be reconnected by dragging an endpoint, see {@link EdgeReconnectable}. */
  reconnectable?: EdgeReconnectable;
  /**
   * Pre-resolved `url(#…)` reference for the start marker, or `undefined` when the edge has none.
   */
  markerStart?: string;
  /**
   * Pre-resolved `url(#…)` reference for the end marker, or `undefined` when the edge has none.
   */
  markerEnd?: string;
  /** Curvature of the default bezier path, between 0 and 1. */
  curvature?: number;
  /**
   * The width of the invisible area around the edge that the user can interact with. This is useful
   * for making the edge easier to click or hover over.
   */
  interactionWidth?: number;
  /** Arbitrary data passed to an edge. */
  data?: EdgeType['data'];
}

/**
 * BaseEdge component props.
 */
export interface BaseEdgeProps extends EdgeLabelOptions {
  /** Unique id of an edge. */
  id?: string;
  /** The x position of edge label. */
  labelX?: number;
  /** The y position of edge label. */
  labelY?: number;
  /**
   * The SVG path string that defines the edge. This should look something like `'M 0 0 L 100 100'`
   * for a simple line.
   */
  path: string;
  label?: string | VNode | Component<EdgeTextProps>;
  /**
   * The id of the SVG marker to use at the start of the edge. This should be defined in a `<defs>`
   * element. Use the format "url(#markerId)" where markerId is the id of your marker definition.
   */
  markerStart?: string;
  /**
   * The id of the SVG marker to use at the end of the edge. This should be defined in a `<defs>`
   * element. Use the format "url(#markerId)" where markerId is the id of your marker definition.
   */
  markerEnd?: string;
  /**
   * The width of the invisible area around the edge that the user can interact with. This is useful
   * for making the edge easier to click or hover over.
   * @default 20
   */
  interactionWidth?: number;
}

/** BezierEdge component props */
export type BezierEdgeProps = EdgePosition
  & BezierPathOptions
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>;

/** SimpleBezier component props */
export type SimpleBezierEdgeProps = EdgePosition
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>;

/** StraightEdge component props */
export type StraightEdgeProps = Omit<EdgePosition, 'sourcePosition' | 'targetPosition'>
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>;

/** StepEdge component props */
export type StepEdgeProps = EdgePosition
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>;

/** SmoothStepEdge component props */
export type SmoothStepEdgeProps = EdgePosition
  & Omit<BaseEdgeProps, 'labelX' | 'labelY' | 'path'>
  & SmoothStepPathOptions;
