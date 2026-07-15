import type { BezierPathOptions, EdgeBase, EdgeMarkerType, EdgePosition, SmoothStepPathOptions } from '@xyflow/system';
import type { Component, CSSProperties, SVGAttributes, VNode } from 'vue';
import type { EdgeComponent, EdgeTextProps } from './components';
import type { ClassValue, Styles } from './flow';

export type EdgeReconnectable = boolean | 'target' | 'source';

export interface EdgeLabelOptions {
  /** Custom styles to apply to the label. */
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
export type DefaultEdgeOptions = Omit<Edge, 'id' | 'source' | 'target' | 'sourceHandle' | 'targetHandle' | 'selected'>;

/**
 * When you implement a custom edge it is wrapped in a component that enables some basic functionality.
 * The `EdgeProps` type is the props that are passed to that component. No `sourceNode`/`targetNode`
 * (resolve them with `useInternalNode`); handles are exposed as `sourceHandleId`/`targetHandleId`;
 * markers are pre-resolved to url strings.
 */
export interface EdgeProps<EdgeType extends Edge = Edge> extends EdgeLabelOptions, EdgePosition {
  id: string;
  source: string;
  target: string;
  // optional: defaults are no longer stamped onto stored edges, so `type`/`data` are genuinely
  // undefined at runtime when the user didn't set them
  type?: EdgeType['type'];
  label?: string | VNode | Component<EdgeTextProps> | object;
  style?: CSSProperties;
  selected?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
  animated?: boolean;
  reconnectable?: EdgeReconnectable;
  // optional: an edge without markers has none at runtime; typed as required, a custom edge's
  // `defineProps<EdgeProps>()` would emit required runtime props and Vue would warn on undefined
  markerStart?: string;
  markerEnd?: string;
  curvature?: number;
  interactionWidth?: number;
  data?: EdgeType['data'];
}

/**
 * BaseEdge component props.
 */
export interface BaseEdgeProps extends EdgeLabelOptions {
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
  label?: any;
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
