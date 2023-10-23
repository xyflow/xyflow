import { useCallback, useMemo } from 'react';
import {
  getElementsToRemove,
  getIncomersBase,
  getOutgoersBase,
  getOverlappingArea,
  isRectObject,
  nodeToRect,
  type Rect,
} from '@xyflow/system';

import useViewportHelper from './useViewportHelper';
import { useStoreApi } from '../hooks/useStore';
import type {
  ReactFlowInstance,
  Instance,
  NodeAddChange,
  EdgeAddChange,
  NodeResetChange,
  EdgeResetChange,
  NodeRemoveChange,
  EdgeRemoveChange,
  NodeChange,
  Node,
  Edge,
} from '../types';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function useReactFlow<NodeData = any, EdgeData = any>(): ReactFlowInstance<NodeData, EdgeData> {
  const viewportHelper = useViewportHelper();
  const store = useStoreApi();

  const getNodes = useCallback<Instance.GetNodes<NodeData>>(() => {
    return store.getState().nodes.map((n) => ({ ...n }));
  }, []);

  const getNode = useCallback<Instance.GetNode<NodeData>>((id) => {
    return store.getState().nodes.find((n) => n.id === id);
  }, []);

  const getEdges = useCallback<Instance.GetEdges<EdgeData>>(() => {
    const { edges = [] } = store.getState();
    return edges.map((e) => ({ ...e }));
  }, []);

  const getEdge = useCallback<Instance.GetEdge<EdgeData>>((id) => {
    const { edges = [] } = store.getState();
    return edges.find((e) => e.id === id);
  }, []);

  const setNodes = useCallback<Instance.SetNodes<NodeData>>((payload) => {
    const { nodes, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
    const nextNodes = typeof payload === 'function' ? payload(nodes) : payload;

    if (hasDefaultNodes) {
      setNodes(nextNodes);
    } else if (onNodesChange) {
      const changes =
        nextNodes.length === 0
          ? nodes.map((node) => ({ type: 'remove', id: node.id } as NodeRemoveChange))
          : nextNodes.map((node) => ({ item: node, type: 'reset' } as NodeResetChange<NodeData>));
      onNodesChange(changes);
    }
  }, []);

  const setEdges = useCallback<Instance.SetEdges<EdgeData>>((payload) => {
    const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();
    const nextEdges = typeof payload === 'function' ? payload(edges) : payload;

    if (hasDefaultEdges) {
      setEdges(nextEdges);
    } else if (onEdgesChange) {
      const changes =
        nextEdges.length === 0
          ? edges.map((edge) => ({ type: 'remove', id: edge.id } as EdgeRemoveChange))
          : nextEdges.map((edge) => ({ item: edge, type: 'reset' } as EdgeResetChange<EdgeData>));
      onEdgesChange(changes);
    }
  }, []);

  const addNodes = useCallback<Instance.AddNodes<NodeData>>((payload) => {
    const nodes = Array.isArray(payload) ? payload : [payload];
    const { nodes: currentNodes, hasDefaultNodes, onNodesChange, setNodes } = store.getState();

    if (hasDefaultNodes) {
      const nextNodes = [...currentNodes, ...nodes];
      setNodes(nextNodes);
    } else if (onNodesChange) {
      const changes = nodes.map((node) => ({ item: node, type: 'add' } as NodeAddChange<NodeData>));
      onNodesChange(changes);
    }
  }, []);

  const addEdges = useCallback<Instance.AddEdges<EdgeData>>((payload) => {
    const nextEdges = Array.isArray(payload) ? payload : [payload];
    const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();

    if (hasDefaultEdges) {
      setEdges([...edges, ...nextEdges]);
    } else if (onEdgesChange) {
      const changes = nextEdges.map((edge) => ({ item: edge, type: 'add' } as EdgeAddChange<EdgeData>));
      onEdgesChange(changes);
    }
  }, []);

  const toObject = useCallback<Instance.ToObject<NodeData, EdgeData>>(() => {
    const { nodes = [], edges = [], transform } = store.getState();
    const [x, y, zoom] = transform;
    return {
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      viewport: {
        x,
        y,
        zoom,
      },
    };
  }, []);

  const deleteElements = useCallback<Instance.DeleteElements>(({ nodes: nodesDeleted, edges: edgesDeleted }) => {
    const {
      nodes,
      edges,
      hasDefaultNodes,
      hasDefaultEdges,
      onNodesDelete,
      onEdgesDelete,
      onNodesChange,
      onEdgesChange,
    } = store.getState();
    const { matchingNodes, matchingEdges } = getElementsToRemove<Node, Edge>({
      nodesToRemove: nodesDeleted || [],
      edgesToRemove: edgesDeleted || [],
      nodes,
      edges,
    });

    if (matchingNodes.length || matchingEdges.length) {
      if (hasDefaultEdges || hasDefaultNodes) {
        if (hasDefaultEdges) {
          store.setState({
            edges: edges.filter((e) => !matchingEdges.some((mE) => mE.id === e.id)),
          });
        }

        if (hasDefaultNodes) {
          store.setState({
            nodes: nodes.filter((n) => !matchingNodes.some((mN) => mN.id === n.id)),
          });
        }
      }

      if (matchingEdges.length > 0) {
        onEdgesDelete?.(matchingEdges);

        if (onEdgesChange) {
          onEdgesChange(
            matchingEdges.map((edge) => ({
              id: edge.id,
              type: 'remove',
            }))
          );
        }
      }

      if (matchingNodes.length > 0) {
        onNodesDelete?.(matchingNodes as Node[]);

        if (onNodesChange) {
          const nodeChanges: NodeChange[] = matchingNodes.map((node) => ({ id: node.id, type: 'remove' }));
          onNodesChange(nodeChanges);
        }
      }
    }

    return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
  }, []);

  const getNodeRect = useCallback(
    (
      nodeOrRect: Node<NodeData> | { id: Node['id'] } | Rect
    ): [Rect | null, Node<NodeData> | null | undefined, boolean] => {
      const isRect = isRectObject(nodeOrRect);
      const node = isRect ? null : store.getState().nodes.find((n) => n.id === nodeOrRect.id);

      if (!isRect && !node) {
        [null, null, isRect];
      }

      const nodeRect = isRect ? nodeOrRect : nodeToRect(node!);

      return [nodeRect, node, isRect];
    },
    []
  );

  const getIntersectingNodes = useCallback<Instance.GetIntersectingNodes<NodeData>>(
    (nodeOrRect, partially = true, nodes) => {
      const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return [];
      }

      return (nodes || store.getState().nodes).filter((n) => {
        if (!isRect && (n.id === node!.id || !n.positionAbsolute)) {
          return false;
        }

        const currNodeRect = nodeToRect(n);
        const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
        const partiallyVisible = partially && overlappingArea > 0;

        return partiallyVisible || overlappingArea >= nodeOrRect.width! * nodeOrRect.height!;
      });
    },
    []
  );

  const isNodeIntersecting = useCallback<Instance.IsNodeIntersecting<NodeData>>(
    (nodeOrRect, area, partially = true) => {
      const [nodeRect] = getNodeRect(nodeOrRect);

      if (!nodeRect) {
        return false;
      }

      const overlappingArea = getOverlappingArea(nodeRect, area);
      const partiallyVisible = partially && overlappingArea > 0;

      return partiallyVisible || overlappingArea >= nodeOrRect.width! * nodeOrRect.height!;
    },
    []
  );

  const getConnectedEdges = useCallback<Instance.getConnectedEdges>((node) => {
    const { edges } = store.getState();

    const nodeIds = new Set();
    if (typeof node === 'string') {
      nodeIds.add(node);
    } else if (node.length >= 1) {
      node.forEach((n) => {
        nodeIds.add(n.id);
      });
    }

    return edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
  }, []);

  const getIncomers = useCallback<Instance.getIncomers>((node) => {
    const { nodes, edges } = store.getState();

    if (typeof node === 'string') {
      return getIncomersBase({ id: node }, nodes, edges);
    }

    return getIncomersBase(node, nodes, edges);
  }, []);

  const getOutgoers = useCallback<Instance.getOutgoers>((node) => {
    const { nodes, edges } = store.getState();

    if (typeof node == 'string') {
      return getOutgoersBase({ id: node }, nodes, edges);
    }

    return getOutgoersBase(node, nodes, edges);
  }, []);

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
      getConnectedEdges,
      getIncomers,
      getOutgoers,
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
    getConnectedEdges,
    getIncomers,
    getOutgoers,
  ]);
}
