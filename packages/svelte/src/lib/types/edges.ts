/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SvelteComponent, ComponentType } from 'svelte';
import type {
  EdgeBase,
  BezierPathOptions,
  DefaultEdgeOptionsBase,
  EdgePosition,
  SmoothStepPathOptions,
  Optional,
  StepPathOptions
} from '@xyflow/system';

import type { Node } from '$lib/types';

export type DefaultEdge<EdgeData = any> = Omit<EdgeBase<EdgeData>, 'focusable'> & {
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

export type Edge<T = any> =
  | DefaultEdge<T>
  | SmoothStepEdgeType<T>
  | BezierEdgeType<T>
  | StepEdgeType<T>;

export type EdgeProps<T = any> = Omit<Edge<T>, 'sourceHandle' | 'targetHandle' | 'type'> &
  EdgePosition & {
    markerStart?: string;
    markerEnd?: string;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };

export type EdgeComponentProps<T = any> = Optional<
  Omit<
    EdgeProps<T>,
    'source' | 'target' | 'sourceHandleId' | 'targetHandleId' | 'animated' | 'selected' | 'data'
  >,
  'id'
>;

export type BezierEdgeProps<T = any> = EdgeComponentProps<T> & {
  pathOptions?: BezierPathOptions;
};

export type SmoothStepEdgeProps<T = any> = EdgeComponentProps<T> & {
  pathOptions?: SmoothStepPathOptions;
};

export type StepEdgeProps<T = any> = EdgeComponentProps<T> & {
  pathOptions?: StepPathOptions;
};

export type StraightEdgeProps<T = any> = Omit<
  EdgeComponentProps<T>,
  'sourcePosition' | 'targetPosition'
>;

export type EdgeTypes = Record<string, ComponentType<SvelteComponent<EdgeProps>>>;

export type DefaultEdgeOptions = Omit<DefaultEdgeOptionsBase<Edge>, 'focusable'>;

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
> &
  EdgePosition & {
    sourceNode?: Node;
    targetNode?: Node;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };
