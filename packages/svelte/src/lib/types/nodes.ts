/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SvelteComponentTyped } from 'svelte';
import type { BaseNode } from '@reactflow/system';

// @todo: currently the helper function only like Node from '@reactflow/core'
// we need a base node type or helpes that accept Node like types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Node<
  NodeData = any,
  NodeType extends string | undefined = string | undefined
> = BaseNode<NodeData, NodeType> & {
  class?: string;
  style?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodeProps<NodeData = any> = Pick<
  Node<NodeData>,
  'id' | 'data' | 'selected' | 'sourcePosition' | 'targetPosition'
> & {
  xPos: number;
  yPos: number;
  isConnectable?: boolean;
};

export type NodeTypes = Record<string, typeof SvelteComponentTyped<Partial<NodeProps>>>;

export type DefaultNodeOptions = Omit<Node, 'id'>;
