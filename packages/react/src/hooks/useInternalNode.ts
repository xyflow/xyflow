import type { InternalNode, Node } from '../types/nodes';
import { useStore } from './useStore';

export function useInternalNode<NodeType extends Node = Node>(id: string): InternalNode<NodeType> | undefined {
  const node = useStore((s) => s.nodeLookup.get(id) as InternalNode<NodeType> | undefined);

  return node;
}
