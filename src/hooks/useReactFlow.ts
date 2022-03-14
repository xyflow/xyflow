import { useCallback } from 'react';

import useViewportHelper from './useViewportHelper';
import { useStoreApi } from '../store';
import { ReactFlowInstance, Instance } from '../types';

export default function useReactFlow<NodeData = any, EdgeData = any>(): ReactFlowInstance<NodeData, EdgeData> {
  const { initialized: viewportInitialized, ...viewportHelperFunctions } = useViewportHelper();
  const store = useStoreApi();

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
    const { nodeInternals, setNodes } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const nextNodes = typeof payload === 'function' ? payload(nodes) : payload;
    setNodes(nextNodes);
  }, []);

  const setEdges = useCallback<Instance.SetEdges<EdgeData>>((payload) => {
    const { edges = [], setEdges } = store.getState();
    const nextEdges = typeof payload === 'function' ? payload(edges) : payload;
    setEdges(nextEdges);
  }, []);

  const addNodes = useCallback<Instance.AddNodes<NodeData>>((payload) => {
    const nodes = Array.isArray(payload) ? payload : [payload];
    const { nodeInternals, setNodes } = store.getState();
    const currentNodes = Array.from(nodeInternals.values());
    const nextNodes = [...currentNodes, ...nodes];
    setNodes(nextNodes);
  }, []);

  const addEdges = useCallback<Instance.AddEdges<EdgeData>>((payload) => {
    const nextEdges = Array.isArray(payload) ? payload : [payload];
    const { edges = [], setEdges } = store.getState();
    setEdges([...edges, ...nextEdges]);
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

  return {
    ...viewportHelperFunctions,
    viewportInitialized,
    getNodes,
    getNode,
    getEdges,
    getEdge,
    setNodes,
    setEdges,
    addNodes,
    addEdges,
    toObject,
  };
}
