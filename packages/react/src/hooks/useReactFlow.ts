import { useCallback, useMemo, useRef } from 'react';
import { getElementsToRemove, getOverlappingArea, isRectObject, nodeToRect, type Rect } from '@xyflow/system';

import useViewportHelper from './useViewportHelper';
import { useStoreApi } from './useStore';
import type {
  ReactFlowInstance,
  Instance,
  NodeAddChange,
  EdgeAddChange,
  NodeResetChange,
  EdgeResetChange,
  NodeRemoveChange,
  EdgeRemoveChange,
  Node,
  Edge,
} from '../types';
import { isNode } from '../utils';

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

  // this is used to handle multiple syncronous setNodes calls
  const setNodesData = useRef<Node[]>();
  const setNodesTimeout = useRef<ReturnType<typeof setTimeout>>();

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

  const setNodes = useCallback<Instance.SetNodes<NodeType>>((payload) => {
    const { nodes, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
    setNodesData.current = setNodesData.current || nodes;
    const nextNodes = typeof payload === 'function' ? payload(setNodesData.current as NodeType[]) : payload;

    setNodesData.current = nextNodes;

    if (hasDefaultNodes) {
      setNodes(nextNodes);
    } else if (onNodesChange) {
      if (setNodesTimeout.current) {
        clearTimeout(setNodesTimeout.current);
      }

      // if there are multiple synchronous setNodes calls, we only want to call onNodesChange once
      // for this, we use a timeout to wait for the last call and store updated nodes in setNodesData
      // this is not perfect, but should work in most cases
      setNodesTimeout.current = setTimeout(() => {
        const changes =
          nextNodes.length === 0
            ? nodes.map((node) => ({ type: 'remove', id: node.id } as NodeRemoveChange))
            : nextNodes.map((node) => ({ item: node, type: 'reset' } as NodeResetChange<NodeType>));
        onNodesChange(changes);

        setNodesData.current = undefined;
      }, 0);
    }
  }, []);

  const setEdges = useCallback<Instance.SetEdges<EdgeType>>((payload) => {
    const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();
    const nextEdges = typeof payload === 'function' ? payload(edges as EdgeType[]) : payload;

    if (hasDefaultEdges) {
      setEdges(nextEdges);
    } else if (onEdgesChange) {
      const changes =
        nextEdges.length === 0
          ? edges.map((edge) => ({ type: 'remove', id: edge.id } as EdgeRemoveChange))
          : nextEdges.map((edge) => ({ item: edge, type: 'reset' } as EdgeResetChange<EdgeType>));
      onEdgesChange(changes);
    }
  }, []);

  const addNodes = useCallback<Instance.AddNodes<NodeType>>((payload) => {
    const nodes = Array.isArray(payload) ? payload : [payload];
    const { nodes: currentNodes, hasDefaultNodes, onNodesChange, setNodes } = store.getState();

    if (hasDefaultNodes) {
      const nextNodes = [...currentNodes, ...nodes];
      setNodes(nextNodes);
    } else if (onNodesChange) {
      const changes = nodes.map((node) => ({ item: node, type: 'add' } as NodeAddChange<NodeType>));
      onNodesChange(changes);
    }
  }, []);

  const addEdges = useCallback<Instance.AddEdges<EdgeType>>((payload) => {
    const nextEdges = Array.isArray(payload) ? payload : [payload];
    const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();

    if (hasDefaultEdges) {
      setEdges([...edges, ...nextEdges]);
    } else if (onEdgesChange) {
      const changes = nextEdges.map((edge) => ({ item: edge, type: 'add' } as EdgeAddChange<EdgeType>));
      onEdgesChange(changes);
    }
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

  const getNodeRect = useCallback(
    (nodeOrRect: NodeType | { id: Node['id'] } | Rect): [Rect | null, NodeType | null | undefined, boolean] => {
      const isRect = isRectObject(nodeOrRect);
      const node = isRect ? null : (store.getState().nodeLookup.get(nodeOrRect.id) as NodeType);

      if (!isRect && !node) {
        [null, null, isRect];
      }

      const nodeRect = isRect ? nodeOrRect : nodeToRect(node!);

      return [nodeRect, node, isRect];
    },
    []
  );

  const getIntersectingNodes = useCallback<Instance.GetIntersectingNodes<NodeType>>(
    (nodeOrRect, partially = true, nodes) => {
      const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return [];
      }

      return (nodes || store.getState().nodes).filter((n) => {
        if (!isRect && (n.id === node!.id || !n.computed?.positionAbsolute)) {
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
      const [nodeRect] = getNodeRect(nodeOrRect);

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
