import { useCallback, useMemo, useRef, useState } from 'react';
import {
  getElementsToRemove,
  getOverlappingArea,
  isRectObject,
  nodeHasDimensions,
  nodeToRect,
  type Rect,
} from '@xyflow/system';

import useViewportHelper from './useViewportHelper';
import { useStoreApi } from './useStore';
import type { ReactFlowInstance, Instance, Node, Edge } from '../types';
import { getElementsDiffChanges, isNode } from '../utils';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Hook for accessing the ReactFlow instance.
 *
 * @public
 * @returns ReactFlowInstance
 */
export function useReactFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): ReactFlowInstance<
  NodeType,
  EdgeType
> {
  const viewportHelper = useViewportHelper();
  const store = useStoreApi();

  const getNodes = useCallback<Instance.GetNodes<NodeType>>(() => {
    return store.getState().nodes.map((n) => ({ ...n })) as NodeType[];
  }, []);

  const getNode = useCallback<Instance.GetNode<NodeType>>((id) => {
    return store.getState().nodeLookup.get(id) as NodeType;
  }, []);

  const getEdges = useCallback<Instance.GetEdges<EdgeType>>(() => {
    const { edges = [] } = store.getState();
    return edges.map((e) => ({ ...e })) as EdgeType[];
  }, []);

  const getEdge = useCallback<Instance.GetEdge<EdgeType>>((id) => {
    const { edges = [] } = store.getState();
    return edges.find((e) => e.id === id) as EdgeType;
  }, []);

  type SetElementsQueue = {
    nodes: (NodeType[] | ((nodes: NodeType[]) => NodeType[]))[];
    edges: (EdgeType[] | ((edges: EdgeType[]) => EdgeType[]))[];
  };

  // A reference of all the batched updates to process before the next render. We
  // want a mutable reference here so multiple synchronous calls to `setNodes` etc
  // can be batched together.
  const setElementsQueue = useRef<SetElementsQueue>({ nodes: [], edges: [] });
  // Because we're using a ref above, we need some way to let React know when to
  // actually process the queue. We flip this bit of state to `true` any time we
  // mutate the queue and then flip it back to `false` after flushing the queue.
  const [shouldFlushQueue, setShouldFlushQueue] = useState(false);

  // Layout effects are guaranteed to run before the next render which means we
  // shouldn't run into any issues with stale state or weird issues that come from
  // rendering things one frame later than expected (we used to use `setTimeout`).
  useIsomorphicLayoutEffect(() => {
    // Because we need to flip the state back to false after flushing, this should
    // trigger the hook again (!). If the hook is being run again we know that any
    // updates should have been processed by now and we can safely clear the queue
    // and bail early.
    if (!shouldFlushQueue) {
      setElementsQueue.current = { nodes: [], edges: [] };
      return;
    }

    if (setElementsQueue.current.nodes.length) {
      const { nodes = [], setNodes, hasDefaultNodes, onNodesChange, nodeLookup } = store.getState();

      // This is essentially an `Array.reduce` in imperative clothing. Processing
      // this queue is a relatively hot path so we'd like to avoid the overhead of
      // array methods where we can.
      let next = nodes as NodeType[];
      for (const payload of setElementsQueue.current.nodes) {
        next = typeof payload === 'function' ? payload(next) : payload;
      }

      if (hasDefaultNodes) {
        setNodes(next);
      } else if (onNodesChange) {
        onNodesChange(
          getElementsDiffChanges({
            items: next,
            lookup: nodeLookup,
          })
        );
      }

      setElementsQueue.current.nodes = [];
    }

    if (setElementsQueue.current.edges.length) {
      const { edges = [], setEdges, hasDefaultEdges, onEdgesChange, edgeLookup } = store.getState();

      let next = edges as EdgeType[];
      for (const payload of setElementsQueue.current.edges) {
        next = typeof payload === 'function' ? payload(next) : payload;
      }

      if (hasDefaultEdges) {
        setEdges(next);
      } else if (onEdgesChange) {
        onEdgesChange(
          getElementsDiffChanges({
            items: next,
            lookup: edgeLookup,
          })
        );
      }

      setElementsQueue.current.edges = [];
    }

    // Beacuse we're using reactive state to trigger this effect, we need to flip
    // it back to false.
    setShouldFlushQueue(false);
  }, [shouldFlushQueue]);

  const setNodes = useCallback<Instance.SetNodes<NodeType>>((payload) => {
    setElementsQueue.current.nodes.push(payload);
    setShouldFlushQueue(true);
  }, []);

  const setEdges = useCallback<Instance.SetEdges<EdgeType>>((payload) => {
    setElementsQueue.current.edges.push(payload);
    setShouldFlushQueue(true);
  }, []);

  const addNodes = useCallback<Instance.AddNodes<NodeType>>((payload) => {
    const newNodes = Array.isArray(payload) ? payload : [payload];

    // Queueing a functional update means that we won't worry about other calls
    // to `setNodes` that might happen elsewhere.
    setElementsQueue.current.nodes.push((nodes) => [...nodes, ...newNodes]);
    setShouldFlushQueue(true);
  }, []);

  const addEdges = useCallback<Instance.AddEdges<EdgeType>>((payload) => {
    const newEdges = Array.isArray(payload) ? payload : [payload];

    setElementsQueue.current.edges.push((edges) => [...edges, ...newEdges]);
    setShouldFlushQueue(true);
  }, []);

  const toObject = useCallback<Instance.ToObject<NodeType, EdgeType>>(() => {
    const { nodes = [], edges = [], transform } = store.getState();
    const [x, y, zoom] = transform;
    return {
      nodes: nodes.map((n) => ({ ...n })) as NodeType[],
      edges: edges.map((e) => ({ ...e })) as EdgeType[],
      viewport: {
        x,
        y,
        zoom,
      },
    };
  }, []);

  const deleteElements = useCallback<Instance.DeleteElements>(
    async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
      const {
        nodes,
        edges,
        hasDefaultNodes,
        hasDefaultEdges,
        onNodesDelete,
        onEdgesDelete,
        onNodesChange,
        onEdgesChange,
        onDelete,
        onBeforeDelete,
      } = store.getState();
      const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
        nodesToRemove,
        edgesToRemove,
        nodes,
        edges,
        onBeforeDelete,
      });

      const hasMatchingEdges = matchingEdges.length > 0;
      const hasMatchingNodes = matchingNodes.length > 0;

      if (hasMatchingEdges) {
        if (hasDefaultEdges) {
          const nextEdges = edges.filter((e) => !matchingEdges.some((mE) => mE.id === e.id));
          store.getState().setEdges(nextEdges);
        }

        onEdgesDelete?.(matchingEdges);
        onEdgesChange?.(
          matchingEdges.map((edge) => ({
            id: edge.id,
            type: 'remove',
          }))
        );
      }

      if (hasMatchingNodes) {
        if (hasDefaultNodes) {
          const nextNodes = nodes.filter((n) => !matchingNodes.some((mN) => mN.id === n.id));
          store.getState().setNodes(nextNodes);
        }

        onNodesDelete?.(matchingNodes);
        onNodesChange?.(matchingNodes.map((node) => ({ id: node.id, type: 'remove' })));
      }

      if (hasMatchingNodes || hasMatchingEdges) {
        onDelete?.({ nodes: matchingNodes, edges: matchingEdges });
      }

      return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
    },
    []
  );

  const getNodeRect = useCallback((nodeOrRect: NodeType | { id: NodeType['id'] }): Rect | null => {
    const node =
      isNode(nodeOrRect) && nodeHasDimensions(nodeOrRect)
        ? nodeOrRect
        : (store.getState().nodeLookup.get(nodeOrRect.id) as NodeType);

    return node ? nodeToRect(node) : null;
  }, []);

  const getIntersectingNodes = useCallback<Instance.GetIntersectingNodes<NodeType>>(
    (nodeOrRect, partially = true, nodes) => {
      const isRect = isRectObject(nodeOrRect);
      const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return [];
      }

      return (nodes || store.getState().nodes).filter((n) => {
        if (!isRect && (n.id === nodeOrRect!.id || !n.computed?.positionAbsolute)) {
          return false;
        }

        const currNodeRect = nodeToRect(n);
        const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
        const partiallyVisible = partially && overlappingArea > 0;

        return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
      }) as NodeType[];
    },
    []
  );

  const isNodeIntersecting = useCallback<Instance.IsNodeIntersecting<NodeType>>(
    (nodeOrRect, area, partially = true) => {
      const isRect = isRectObject(nodeOrRect);
      const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return false;
      }

      const overlappingArea = getOverlappingArea(nodeRect, area);
      const partiallyVisible = partially && overlappingArea > 0;

      return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
    },
    []
  );

  const updateNode = useCallback<Instance.UpdateNode<NodeType>>(
    (id, nodeUpdate, options = { replace: true }) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            const nextNode = typeof nodeUpdate === 'function' ? nodeUpdate(node as NodeType) : nodeUpdate;
            return options.replace && isNode(nextNode) ? (nextNode as NodeType) : { ...node, ...nextNode };
          }

          return node;
        })
      );
    },
    [setNodes]
  );

  const updateNodeData = useCallback<Instance.UpdateNodeData<NodeType>>(
    (id, dataUpdate, options = { replace: false }) => {
      updateNode(
        id,
        (node) => {
          const nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;
          return options.replace ? { ...node, data: nextData } : { ...node, data: { ...node.data, ...nextData } };
        },
        options
      );
    },
    [updateNode]
  );

  return useMemo(() => {
    return {
      ...viewportHelper,
      getNodes,
      getNode,
      getEdges,
      getEdge,
      setNodes,
      setEdges,
      addNodes,
      addEdges,
      toObject,
      deleteElements,
      getIntersectingNodes,
      isNodeIntersecting,
      updateNode,
      updateNodeData,
    };
  }, [
    viewportHelper,
    getNodes,
    getNode,
    getEdges,
    getEdge,
    setNodes,
    setEdges,
    addNodes,
    addEdges,
    toObject,
    deleteElements,
    getIntersectingNodes,
    isNodeIntersecting,
    updateNode,
    updateNodeData,
  ]);
}
