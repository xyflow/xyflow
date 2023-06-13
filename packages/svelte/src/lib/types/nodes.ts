/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SvelteComponentTyped } from 'svelte';
import type { NodeBase, NodeProps } from '@xyflow/system';

// @todo: currently the helper function only like Node from '@reactflow/core'
// we need a base node type or helpes that accept Node like types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Node<
  NodeData = any,
  NodeType extends string | undefined = string | undefined
> = NodeBase<NodeData, NodeType> & {
  class?: string;
  style?: string;
};

export type NodeTypes = Record<string, typeof SvelteComponentTyped<NodeProps>>;

export type DefaultNodeOptions = Partial<Omit<Node, 'id'>>;
