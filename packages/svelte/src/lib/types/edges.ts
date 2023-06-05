/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SvelteComponentTyped } from 'svelte';
import type {
  BaseEdge,
  BezierPathOptions,
  DefaultEdgeOptionsBase,
  Position,
  SmoothStepPathOptions
} from '@xyflow/system';

import type { Node } from '$lib/types';

export type DefaultEdge<EdgeData = any> = BaseEdge<EdgeData> & {
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

export type EdgeLayouted = Omit<Edge, 'sourceHandle' | 'targetHandle'> & {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  sourceHandleId?: string;
  targetHandleId?: string;
  markerStart?: string;
  markerEnd?: string;
};

export type EdgeProps = Pick<
  EdgeLayouted,
  | 'id'
  | 'data'
  | 'style'
  | 'source'
  | 'target'
  | 'sourceX'
  | 'sourceY'
  | 'targetX'
  | 'targetY'
  | 'sourcePosition'
  | 'targetPosition'
  | 'animated'
  | 'selected'
  | 'selectable'
  | 'label'
  | 'labelStyle'
  | 'interactionWidth'
  | 'markerStart'
  | 'markerEnd'
  | 'sourceHandleId'
  | 'targetHandleId'
>;

export type EdgeTypes = Record<string, typeof SvelteComponentTyped<EdgeProps>>;

export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;
