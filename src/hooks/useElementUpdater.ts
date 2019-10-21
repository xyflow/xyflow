import { useEffect } from 'react';
import isEqual from 'fast-deep-equal';

import { useStoreState, useStoreActions } from '../store/hooks';
import { parseElement, isNode, isEdge } from '../utils/graph';
import { Elements, Node, Edge } from '../types';

const useElementUpdater = (elements: Elements): void => {
  const state = useStoreState(s => ({
    nodes: s.nodes,
    edges: s.edges,
    transform: s.transform,
    snapToGrid: s.snapToGrid,
    snapGrid: s.snapGrid,
  }));

  const setNodes = useStoreActions(a => a.setNodes);
  const setEdges = useStoreActions(a => a.setEdges);

  useEffect(() => {
    const nodes = elements.filter(isNode) as Node[];
    const edges = elements
      .filter(isEdge)
      .map(e =>
        parseElement(e, state.transform, state.snapToGrid, state.snapGrid)
      ) as Edge[];

    const nextNodes = nodes.map(propNode => {
      const existingNode = state.nodes.find(n => n.id === propNode.id);

      if (existingNode) {
        const data = !isEqual(existingNode.data, propNode.data)
          ? { ...existingNode.data, ...propNode.data }
          : existingNode.data;

        return {
          ...existingNode,
          data,
        };
      }

      return parseElement(
        propNode,
        state.transform,
        state.snapToGrid,
        state.snapGrid
      );
    }) as Node[];

    const nodesChanged: boolean = !isEqual(state.nodes, nextNodes);
    const edgesChanged: boolean = !isEqual(state.edges, edges);

    if (nodesChanged) {
      setNodes(nextNodes);
    }

    if (edgesChanged) {
      setEdges(edges);
    }
  });
};

export default useElementUpdater;
