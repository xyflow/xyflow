/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SvelteComponentTyped } from 'svelte';
import type {
  BaseEdge,
  BezierPathOptions,
  Position,
  SmoothStepPathOptions
} from '@reactflow/system';

import type { Node } from '$lib/types';

export type DefaultEdge<EdgeData = any> = BaseEdge<EdgeData> & {
  label?: string;
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

export type Edge<T = any> = DefaultEdge<T> | SmoothStepEdgeType<T> | BezierEdgeType<T>;

export type EdgeLayouted = Omit<Edge, 'sourceHandle' | 'targetHandle'> & {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  sourceHandleId?: string;
  targetHandleId?: string;
};

export type EdgeProps = Pick<
  EdgeLayouted,
  | 'id'
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
  | 'label'
  | 'interactionWidth'
>;

export type BaseEdgeProps = Pick<EdgeProps, 'interactionWidth' | 'label'> & {
  path: string;
  labelX?: number;
  labelY?: number;
};

export type EdgeTypes = Record<string, typeof SvelteComponentTyped<EdgeProps>>;
