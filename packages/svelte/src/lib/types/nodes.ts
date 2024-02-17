import type { ComponentType, SvelteComponent } from 'svelte';
import type { NodeBase, NodeProps } from '@xyflow/system';

/**
 * The node data structure that gets used for the nodes prop.
 * @public
 */
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string | undefined = string | undefined
> = NodeBase<NodeData, NodeType> & {
  class?: string;
  style?: string;
};

export type NodeTypes = Record<string, ComponentType<SvelteComponent<NodeProps>>>;

export type DefaultNodeOptions = Partial<Omit<Node, 'id'>>;

export type BuiltInNode = Node<{ label: string }, 'input' | 'output' | 'default'>;
