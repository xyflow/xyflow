import type { Component } from 'svelte';
import type { ClassValue, HTMLAttributes, SVGAttributes } from 'svelte/elements';
import type {
  EdgeBase,
  BezierPathOptions,
  DefaultEdgeOptionsBase,
  EdgePosition,
  SmoothStepPathOptions,
  StepPathOptions
} from '@xyflow/system';

import type { Node } from '$lib/types';

/**
 * An `Edge` is the complete description with everything Svelte Flow needs to know in order to
 * render it.
 * @public
 */
export type Edge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined
> = EdgeBase<EdgeData, EdgeType> & {
  label?: string;
  labelStyle?: string;
  style?: string;
  class?: ClassValue;
  focusable?: boolean;
  /**
   * The ARIA role attribute for the edge, used for accessibility.
   * @default "group"
   */
  ariaRole?: HTMLAttributes<HTMLElement>['role'];
  /**
   * General escape hatch for adding custom attributes to the edge's DOM element.
   */
  domAttributes?: Omit<
    SVGAttributes<SVGGElement>,
    'id' | 'style' | 'class' | 'role' | 'aria-label' | 'dangerouslySetInnerHTML'
  >;
};

export type BaseEdgeProps = Pick<
  EdgeProps,
  'interactionWidth' | 'label' | 'labelStyle' | 'style'
> & {
  id?: string;
  /** SVG path of the edge */
  path: string;
  /** The x coordinate of the label */
  labelX?: number;
  /** The y coordinate of the label */
  labelY?: number;
  /**
   * The id of the SVG marker to use at the start of the edge. This should be defined in a
   * `<defs>` element in a separate SVG document or element. Use the format "url(#markerId)" where markerId is the id of your marker definition.
   * @example 'url(#arrow)'
   */
  markerStart?: string;
  /**
   * The id of the SVG marker to use at the end of the edge. This should be defined in a `<defs>`
   * element in a separate SVG document or element. Use the format "url(#markerId)" where markerId is the id of your marker definition.
   * @example 'url(#arrow)'
   */
  markerEnd?: string;
  class?: ClassValue;
} & HTMLAttributes<SVGPathElement>;

type SmoothStepEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<
  EdgeData,
  'smoothstep'
> & {
  pathOptions?: SmoothStepPathOptions;
};

type BezierEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<
  EdgeData,
  'default'
> & {
  pathOptions?: BezierPathOptions;
};

type StepEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<
  EdgeData,
  'step'
> & {
  pathOptions?: StepPathOptions;
};

type StraightEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<
  EdgeData,
  'straight'
>;

export type BuiltInEdge = SmoothStepEdge | BezierEdge | StepEdge | StraightEdge;

/**
 * Custom edge component props.
 */
export type EdgeProps<EdgeType extends Edge = Edge> = Omit<
  EdgeType,
  'sourceHandle' | 'targetHandle'
> &
  EdgePosition & {
    type: string;
    markerStart?: string;
    markerEnd?: string;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };

/**
 * Helper type for edge components that get exported by the library.
 */
export type EdgeComponentProps = EdgePosition & {
  id?: EdgeProps['id'];
  hidden?: EdgeProps['hidden'];
  deletable?: EdgeProps['deletable'];
  selectable?: EdgeProps['selectable'];
  markerStart?: EdgeProps['markerStart'];
  markerEnd?: EdgeProps['markerEnd'];
  zIndex?: EdgeProps['zIndex'];
  ariaLabel?: EdgeProps['ariaLabel'];
  interactionWidth?: EdgeProps['interactionWidth'];
  label?: EdgeProps['label'];
  labelStyle?: EdgeProps['labelStyle'];
  style?: EdgeProps['style'];
  class?: EdgeProps['class'];
};

export type EdgeComponentWithPathOptions<PathOptions> = EdgeComponentProps & {
  pathOptions?: PathOptions;
};

/**
 * BezierEdge component props
 */
export type BezierEdgeProps = EdgeComponentWithPathOptions<BezierPathOptions>;

/**
 * SmoothStepEdge component props
 */
export type SmoothStepEdgeProps = EdgeComponentWithPathOptions<SmoothStepPathOptions>;

/**
 * StepEdge component props
 */
export type StepEdgeProps = EdgeComponentWithPathOptions<StepPathOptions>;

/**
 * StraightEdge component props
 */
export type StraightEdgeProps = Omit<EdgeComponentProps, 'sourcePosition' | 'targetPosition'>;

export type EdgeTypes = Record<
  string,
  Component<
    EdgeProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: any;
    }
  >
>;

export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;

export type EdgeLayouted<EdgeType extends Edge = Edge> = EdgeType &
  EdgePosition & {
    sourceNode?: Node;
    targetNode?: Node;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
    edge: EdgeType;
  };
