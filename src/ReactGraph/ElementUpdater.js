import { useEffect, memo } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import isEqual from 'fast-deep-equal';

import { parseElement, isNode, isEdge } from '../graph-utils';

const ElementUpdater = (props) => {
  const state = useStoreState(s => ({
    nodes: s.nodes,
    edges: s.edges,
    transform: s.transform
  }));

  const setNodes = useStoreActions(a => a.setNodes);
  const setEdges = useStoreActions(a => a.setEdges);
  const setOnConnect = useStoreActions(a => a.setOnConnect);

  useEffect(() => {
    const nodes = props.elements.filter(isNode);
    const edges = props.elements.filter(isEdge).map(parseElement);

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

  useEffect(() => {
    setOnConnect(props.onConnect);
  }, []);

  return null;
};

ElementUpdater.displayName = 'ElementUpdater';

export default memo(ElementUpdater);
