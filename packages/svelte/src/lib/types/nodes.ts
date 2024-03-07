import type { ComponentType, SvelteComponent } from 'svelte';
import type { NodeBase, NodeProps as NodePropsBase } from '@xyflow/system';

/**
 * The node data structure that gets used for the nodes prop.
 * @public
 */
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string
> = NodeBase<NodeData, NodeType> & {
  class?: string;
  style?: string;
};

// @todo: currently generics for nodes are not really supported
// let's fix `type: any` when we migrate to Svelte 5
export type NodeProps<NodeType extends Node = Node> = NodePropsBase<NodeType> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
};

export type NodeTypes = Record<
  string,
  ComponentType<
    SvelteComponent<
      NodeProps & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: any;
      }
    >
  >
>;

export type DefaultNodeOptions = Partial<Omit<Node, 'id'>>;

export type BuiltInNode = Node<{ label: string }, 'input' | 'output' | 'default'>;
