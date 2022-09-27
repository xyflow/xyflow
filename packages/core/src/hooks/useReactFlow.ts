import { useCallback, useMemo } from 'react';

import useViewportHelper from './useViewportHelper';
import { useStore, useStoreApi } from '../hooks/useStore';
import {
  ReactFlowInstance,
  Instance,
  NodeAddChange,
  EdgeAddChange,
  NodeResetChange,
  EdgeResetChange,
  NodeRemoveChange,
  EdgeRemoveChange,
  ReactFlowState,
  EdgeChange,
  NodeChange,
  Node,
} from '../types';
import { getConnectedEdges } from '../utils/graph';
import shallow from 'zustand/shallow';

const selector = (s: ReactFlowState) => ({
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
});

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function useReactFlow<NodeData = any, EdgeData = any>(): ReactFlowInstance<NodeData, EdgeData> {
  const viewportHelper = useViewportHelper();
  const store = useStoreApi();

  const { onNodesChange, onEdgesChange } = useStore(selector, shallow);

  const getNodes = useCallback<Instance.GetNodes<NodeData>>(() => {
    const { nodeInternals } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    return nodes.map((n) => ({ ...n }));
  }, []);

  const getNode = useCallback<Instance.GetNode<NodeData>>((id) => {
    const { nodeInternals } = store.getState();
    return nodeInternals.get(id);
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
    const { nodeInternals, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
    const nodes = Array.from(nodeInternals.values());
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
    const { nodeInternals, setNodes, hasDefaultNodes, onNodesChange } = store.getState();

    if (hasDefaultNodes) {
      const currentNodes = Array.from(nodeInternals.values());
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
    const { nodeInternals, edges = [], transform } = store.getState();
    const nodes = Array.from(nodeInternals.values());
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

  const deleteSelectedElements = useCallback<Instance.DeleteSelectedElements>(() => {
    const {
      nodeInternals,
      edges,
      hasDefaultNodes,
      hasDefaultEdges,
      onNodesDelete,
      onEdgesDelete,
      onNodesChange,
      onEdgesChange,
    } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const nodesToRemove = nodes.reduce<Node[]>((res, node) => {
      const parentSelected = !node.selected && node.parentNode && res.find((n) => n.id === node.parentNode);
      const deletable = typeof node.deletable === 'boolean' ? node.deletable : true;
      if (deletable && (node.selected || parentSelected)) {
        res.push(node);
      }

      return res;
    }, []);
    const deletableEdges = edges.filter((e) => (typeof e.deletable === 'boolean' ? e.deletable : true));
    const selectedEdges = deletableEdges.filter((e) => e.selected);

    if (nodesToRemove || selectedEdges) {
      const connectedEdges = getConnectedEdges(nodesToRemove, deletableEdges);
      const edgesToRemove = [...selectedEdges, ...connectedEdges];
      const edgeIdsToRemove = edgesToRemove.reduce<string[]>((res, edge) => {
        if (!res.includes(edge.id)) {
          res.push(edge.id);
        }
        return res;
      }, []);

      if (hasDefaultEdges || hasDefaultNodes) {
        if (hasDefaultEdges) {
          store.setState({
            edges: edges.filter((e) => !edgeIdsToRemove.includes(e.id)),
          });
        }

        if (hasDefaultNodes) {
          nodesToRemove.forEach((node) => {
            nodeInternals.delete(node.id);
          });

          store.setState({
            nodeInternals: new Map(nodeInternals),
          });
        }
      }

      if (edgeIdsToRemove.length > 0) {
        onEdgesDelete?.(edgesToRemove);

        if (onEdgesChange) {
          onEdgesChange(
            edgeIdsToRemove.map((id) => ({
              id,
              type: 'remove',
            }))
          );
        }
      }

      if (nodesToRemove.length > 0) {
        onNodesDelete?.(nodesToRemove);

        if (onNodesChange) {
          const nodeChanges: NodeChange[] = nodesToRemove.map((n) => ({ id: n.id, type: 'remove' }));
          onNodesChange(nodeChanges);
        }
      }

      store.setState({ nodesSelectionActive: false });
    }
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
      deleteSelectedElements,
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
    deleteSelectedElements,
  ]);
}
