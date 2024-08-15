import { shallow } from 'zustand/shallow';
import { ConnectionState, pointToRendererPoint } from '@xyflow/system';

import { useStore } from './useStore';
import type { InternalNode, Node, ReactFlowStore } from '../types';

function storeSelector(s: ReactFlowStore) {
  return s.connection.inProgress
    ? { ...s.connection, to: pointToRendererPoint(s.connection.to, s.transform) }
    : { ...s.connection };
}

function getSelector<NodeType extends Node = Node, SelectorReturn = ConnectionState<InternalNode<NodeType>>>(
  connectionSelector?: (connection: ConnectionState<InternalNode<NodeType>>) => SelectorReturn
): (s: ReactFlowStore) => SelectorReturn | ConnectionState<InternalNode> {
  if (connectionSelector) {
    const combinedSelector = (s: ReactFlowStore) => {
      const connection = storeSelector(s) as ConnectionState<InternalNode<NodeType>>;
      return connectionSelector(connection);
    };
    return combinedSelector;
  }

  return storeSelector;
}
/**
 * Hook for accessing the connection state.
 *
 * @public
 * @returns ConnectionState
 */
export function useConnection<NodeType extends Node = Node, SelectorReturn = ConnectionState<InternalNode<NodeType>>>(
  connectionSelector?: (connection: ConnectionState<InternalNode<NodeType>>) => SelectorReturn
): SelectorReturn {
  const combinedSelector = getSelector<NodeType, SelectorReturn>(connectionSelector);
  return useStore(combinedSelector, shallow) as SelectorReturn;
}
