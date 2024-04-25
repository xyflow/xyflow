import { useCallback, useMemo } from 'react';
import {
  evaluateAbsolutePosition,
  getElementsToRemove,
  getOverlappingArea,
  isRectObject,
  nodeToRect,
  type Rect,
} from '@xyflow/system';

import useViewportHelper from './useViewportHelper';
import { useStoreApi } from './useStore';
import { useBatchContext } from '../components/BatchProvider';
import { isNode } from '../utils';
import type { ReactFlowInstance, Instance, Node, Edge, InternalNode } from '../types';

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
  const batchContext = useBatchContext();

  const getNodes = useCallback<Instance.GetNodes<NodeType>>(
    () => store.getState().nodes.map((n) => ({ ...n })) as NodeType[],
    []
  );

  const getInternalNode = useCallback<Instance.GetInternalNode<NodeType>>(
    (id) => store.getState().nodeLookup.get(id) as InternalNode<NodeType>,
    []
  );

  const getNode = useCallback<Instance.GetNode<NodeType>>(
    (id) => getInternalNode(id)?.internals.userNode as NodeType,
    [getInternalNode]
  );

  const getEdges = useCallback<Instance.GetEdges<EdgeType>>(() => {
    const { edges = [] } = store.getState();
    return edges.map((e) => ({ ...e })) as EdgeType[];
  }, []);

  const getEdge = useCallback<Instance.GetEdge<EdgeType>>((id) => store.getState().edgeLookup.get(id) as EdgeType, []);

  const setNodes = useCallback<Instance.SetNodes<NodeType>>((payload) => {
    batchContext.nodeQueue.push(payload as NodeType[]);
  }, []);

  const setEdges = useCallback<Instance.SetEdges<EdgeType>>((payload) => {
    batchContext.edgeQueue.push(payload as EdgeType[]);
  }, []);

  const addNodes = useCallback<Instance.AddNodes<NodeType>>((payload) => {
    const newNodes = Array.isArray(payload) ? payload : [payload];
    batchContext.nodeQueue.push((nodes) => [...nodes, ...newNodes]);
  }, []);

  const addEdges = useCallback<Instance.AddEdges<EdgeType>>((payload) => {
    const newEdges = Array.isArray(payload) ? payload : [payload];
    batchContext.edgeQueue.push((edges) => [...edges, ...newEdges]);
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

  const getNodeRect = useCallback((node: NodeType | { id: string }): Rect | null => {
    const { nodeLookup, nodeOrigin } = store.getState();

    const nodeToUse = isNode<NodeType>(node) ? node : nodeLookup.get(node.id)!;
    const position = nodeToUse.parentId
      ? evaluateAbsolutePosition(nodeToUse.position, nodeToUse.parentId, nodeLookup, nodeOrigin)
      : nodeToUse.position;

    const nodeWithPosition = {
      id: nodeToUse.id,
      position,
      width: nodeToUse.measured?.width ?? nodeToUse.width,
      height: nodeToUse.measured?.height ?? nodeToUse.height,
      data: nodeToUse.data,
    };

    return nodeToRect(nodeWithPosition);
  }, []);

  const getIntersectingNodes = useCallback<Instance.GetIntersectingNodes<NodeType>>(
    (nodeOrRect, partially = true, nodes) => {
      const isRect = isRectObject(nodeOrRect);
      const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
      const hasNodesOption = nodes !== undefined;

      if (!nodeRect) {
        return [];
      }

      return (nodes || store.getState().nodes).filter((n) => {
        const internalNode = store.getState().nodeLookup.get(n.id);

        if (internalNode && !isRect && (n.id === nodeOrRect!.id || !internalNode.internals.positionAbsolute)) {
          return false;
        }

        const currNodeRect = nodeToRect(hasNodesOption ? n : internalNode!);
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
    (id, nodeUpdate, options = { replace: false }) => {
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
      getInternalNode,
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
    getInternalNode,
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
