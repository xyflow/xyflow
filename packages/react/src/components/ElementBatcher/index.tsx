import { useEffect } from 'react';

import { useStore, useStoreApi } from '../../hooks/useStore';
import type { Edge, Node, ReactFlowState } from '../../types';
import { getElementsDiffChanges } from '../../utils';
import { EdgeChange, NodeChange } from '@xyflow/system';

const selector = (s: ReactFlowState) => s.shouldFlushQueue;

export function ElementBatcher<NodeType extends Node = Node, EdgeType extends Edge = Edge>() {
  const store = useStoreApi<NodeType, EdgeType>();
  const shouldFlushQueue = useStore(selector);

  // Layout effects are guaranteed to run before the next render which means we
  // shouldn't run into any issues with stale state or weird issues that come from
  // rendering things one frame later than expected (we used to use `setTimeout`).
  useEffect(() => {
    const { setNodesQueue, setEdgesQueue } = store.getState();
    // Because we need to flip the state back to false after flushing, this should
    // trigger the hook again (!). If the hook is being run again we know that any
    // updates should have been processed by now and we can safely clear the queue
    // and bail early.

    if (!shouldFlushQueue) {
      setNodesQueue.reset();
      setEdgesQueue.reset();
      return;
    }

    const setNodesQueueItems = setNodesQueue.get();

    if (setNodesQueueItems.length) {
      const { nodes = [], setNodes, hasDefaultNodes, onNodesChange, nodeLookup } = store.getState();

      // This is essentially an `Array.reduce` in imperative clothing. Processing
      // this queue is a relatively hot path so we'd like to avoid the overhead of
      // array methods where we can.
      let next = nodes as NodeType[];
      for (const payload of setNodesQueueItems) {
        next = typeof payload === 'function' ? payload(next) : payload;
      }

      if (hasDefaultNodes) {
        setNodes(next);
      } else if (onNodesChange) {
        onNodesChange(
          getElementsDiffChanges({
            items: next,
            lookup: nodeLookup,
          }) as NodeChange<NodeType>[]
        );
      }

      setNodesQueue.reset();
    }

    const _setEdgesQueue = setEdgesQueue.get();

    if (_setEdgesQueue.length) {
      const { edges = [], setEdges, hasDefaultEdges, onEdgesChange, edgeLookup } = store.getState();

      let next = edges as EdgeType[];
      for (const payload of _setEdgesQueue) {
        next = typeof payload === 'function' ? payload(next) : payload;
      }

      if (hasDefaultEdges) {
        setEdges(next);
      } else if (onEdgesChange) {
        onEdgesChange(
          getElementsDiffChanges({
            items: next,
            lookup: edgeLookup,
          }) as EdgeChange<EdgeType>[]
        );
      }

      setEdgesQueue.reset();
    }

    // Beacuse we're using reactive state to trigger this effect, we need to flip
    // it back to false.
    store.setState({ shouldFlushQueue: false });
  }, [shouldFlushQueue]);

  return null;
}
