import { shallow } from 'zustand/shallow';
import { ConnectionState, pointToRendererPoint } from '@xyflow/system';

import { useStore } from './useStore';
import type { InternalNode, Node, ReactFlowStore } from '../types';

const selector = (s: ReactFlowStore) => {
  return s.connection.inProgress
    ? { ...s.connection, to: pointToRendererPoint(s.connection.to, s.transform) }
    : { ...s.connection };
};
/**
 * Hook for accessing the connection state.
 *
 * @public
 * @returns ConnectionState
 */
export function useConnection<NodeType extends Node = Node>(): ConnectionState<InternalNode<NodeType>> {
  return useStore(selector, shallow) as ConnectionState<InternalNode<NodeType>>;
}
