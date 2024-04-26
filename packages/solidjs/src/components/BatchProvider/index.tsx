import { EdgeChange, NodeChange } from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { getElementsDiffChanges } from '../../utils';
import { Queue, QueueItem } from './types';
import type { Edge, Node } from '../../types';
import { useQueue } from './useQueue';
import { Accessor, createContext, JSX, useContext } from 'solid-js';
import { Writable } from '../../store/initialState';

const BatchContext = createContext<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeQueue: Queue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edgeQueue: Queue<any>;
} | null>(null);

/**
 * This is a context provider that holds and processes the node and edge update queues
 * that are needed to handle setNodes, addNodes, setEdges and addEdges.
 *
 * @internal
 */
export function BatchProvider<NodeType extends Node = Node, EdgeType extends Edge = Edge>(p: {
  children: JSX.Element;
}) {
  const store = useStoreApi<NodeType, EdgeType>();

  const nodeQueueHandler = (queueItems: QueueItem<NodeType>[]) => {
    const { nodes, setNodes, hasDefaultNodes, onNodesChange: getOnNodesChange, nodeLookup, edgeLookup } = store;

    // This is essentially an `Array.reduce` in imperative clothing. Processing
    // this queue is a relatively hot path so we'd like to avoid the overhead of
    // array methods where we can.
    let next = nodes.get();
    for (const payload of queueItems) {
      next = typeof payload === 'function' ? payload(next) : payload;
    }

    const onNodesChange = getOnNodesChange.get();

    if (hasDefaultNodes.get()) {
      setNodes(next);
    } else if (onNodesChange) {
      onNodesChange(
        getElementsDiffChanges({
          items: next,
          lookup: nodeLookup,
        }) as NodeChange<NodeType>[]
      );
    }
  };
  const nodeQueue = useQueue<NodeType>(nodeQueueHandler);

  const edgeQueueHandler = (queueItems: QueueItem<EdgeType>[]) => {
    const { edges, setEdges, hasDefaultEdges, onEdgesChange: getOnEdgesChange, edgeLookup } = store;

    let next = edges.get() as EdgeType[];
    for (const payload of queueItems) {
      next = typeof payload === 'function' ? payload(next) : payload;
    }

    const onEdgesChange = getOnEdgesChange.get();

    if (hasDefaultEdges.get()) {
      setEdges(next);
    } else if (onEdgesChange) {
      onEdgesChange(
        getElementsDiffChanges({
          items: next,
          lookup: edgeLookup,
        }) as EdgeChange<EdgeType>[]
      );
    }
  };
  const edgeQueue = useQueue<EdgeType>(edgeQueueHandler);

  const value = { nodeQueue, edgeQueue };

  return <BatchContext.Provider value={value}>{p.children}</BatchContext.Provider>;
}

export function useBatchContext() {
  const batchContext = useContext(BatchContext);

  if (!batchContext) {
    throw new Error('useBatchContext must be used within a BatchProvider');
  }

  return batchContext;
}
