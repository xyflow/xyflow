import { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import isEqual from 'fast-deep-equal';

import { parseElement, isNode, isEdge } from '../utils/graph';

const useElementUpdater = ({ elements }) => {
  const state = useStoreState(s => ({
    nodes: s.nodes,
    edges: s.edges,
    transform: s.transform
  }));

  const setNodes = useStoreActions(a => a.setNodes);
  const setEdges = useStoreActions(a => a.setEdges);

  useEffect(() => {
    const nodes = elements.filter(isNode);
    const edges = elements.filter(isEdge).map(parseElement);

    const nextNodes = nodes.map(propNode => {
      const existingNode = state.nodes.find(n => n.id === propNode.id);

      if (existingNode) {
        const data = !isEqual(existingNode.data, propNode.data) ?
          { ...existingNode.data, ...propNode.data } : existingNode.data;

        return {
          ...existingNode,
          data
        };
      }

      return parseElement(propNode, state.transform);
    });

    const nodesChanged = !isEqual(state.nodes, nextNodes);
    const edgesChanged = !isEqual(state.edges, edges);

    if (nodesChanged) {
      setNodes(nextNodes);
    }

    if (edgesChanged) {
      setEdges(edges);
    }
  });

  return null;
};

export default useElementUpdater;
