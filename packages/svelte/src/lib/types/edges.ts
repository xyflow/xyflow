/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SvelteComponentTyped } from 'svelte';
import type {
  EdgeBase,
  BezierPathOptions,
  DefaultEdgeOptionsBase,
  EdgePosition,
  SmoothStepPathOptions
} from '@xyflow/system';

import type { Node } from '$lib/types';

export type DefaultEdge<EdgeData = any> = EdgeBase<EdgeData> & {
  label?: string;
  labelStyle?: string;
  style?: string;
  class?: string;
  sourceNode?: Node;
  targetNode?: Node;
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
};

export type Edge<T = any> =
  | DefaultEdge<T>
  | SmoothStepEdgeType<T>
  | BezierEdgeType<T>
  | StepEdgeType<T>;

export type EdgeProps = Omit<Edge, 'sourceHandle' | 'targetHandle'> &
  EdgePosition & {
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };

export type EdgeTypes = Record<string, typeof SvelteComponentTyped<EdgeProps>>;

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
> &
  EdgePosition & {
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };
