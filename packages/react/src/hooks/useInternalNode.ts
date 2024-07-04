import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from './useStore';
import type { InternalNode, Node } from '../types';

/**
 * Hook for getting an internal node by id
 *
 * @public
 * @param id - id of the node
 * @returns array with visible node ids
 */
export function useInternalNode<NodeType extends Node = Node>(id: string): InternalNode<NodeType> | undefined {
  const node = useStore(
    useCallback((s) => s.nodeLookup.get(id) as InternalNode<NodeType> | undefined, [id]),
    shallow
  );

  return node;
}
