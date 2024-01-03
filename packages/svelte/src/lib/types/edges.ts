/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SvelteComponent, ComponentType } from 'svelte';
import type {
  EdgeBase,
  BezierPathOptions,
  DefaultEdgeOptionsBase,
  EdgePosition,
  SmoothStepPathOptions,
  StepPathOptions
} from '@xyflow/system';

import type { Node } from '$lib/types';

export type DefaultEdge<EdgeData = any> = EdgeBase<EdgeData> & {
  label?: string;
  labelStyle?: string;
  style?: string;
  class?: string;
};

type SmoothStepEdgeType<T> = DefaultEdge<T> & {
  type: 'smoothstep';
  pathOptions?: SmoothStepPathOptions;
};

type BezierEdgeType<T> = DefaultEdge<T> & {
  type: 'default';
  pathOptions?: BezierPathOptions;
};

type StepEdgeType<T> = DefaultEdge<T> & {
  type: 'step';
  pathOptions?: StepPathOptions;
};

/**
 * The Edge type is mainly used for the `edges` that get passed to the SvelteFlow component.
 */
export type Edge<T = any> =
  | DefaultEdge<T>
  | SmoothStepEdgeType<T>
  | BezierEdgeType<T>
  | StepEdgeType<T>;

/**
 * Custom edge component props.
 */
export type EdgeProps<T = any> = Omit<Edge<T>, 'sourceHandle' | 'targetHandle' | 'type'> &
  EdgePosition & {
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

export type EdgeTypes = Record<string, ComponentType<SvelteComponent<EdgeProps>>>;

export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;

export type EdgeLayouted = Pick<
  Edge,
  | 'type'
  | 'id'
  | 'data'
  | 'style'
  | 'source'
  | 'target'
  | 'animated'
  | 'selected'
  | 'selectable'
  | 'label'
  | 'labelStyle'
  | 'interactionWidth'
  | 'markerStart'
  | 'markerEnd'
  | 'sourceHandle'
  | 'targetHandle'
  | 'ariaLabel'
  | 'hidden'
  | 'class'
  | 'zIndex'
> &
  EdgePosition & {
    sourceNode?: Node;
    targetNode?: Node;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };
