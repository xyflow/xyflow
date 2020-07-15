import { useEffect } from 'react';
import isEqual from 'fast-deep-equal';

import { useStoreState, useStoreActions } from '../store/hooks';
import { parseElement, isNode, isEdge } from '../utils/graph';
import { Elements, Node, Edge } from '../types';

const useElementUpdater = (elements: Elements): void => {
  const stateNodes = useStoreState((s) => s.nodes);
  const stateEdges = useStoreState((s) => s.edges);

  const setNodes = useStoreActions((a) => a.setNodes);
  const setEdges = useStoreActions((a) => a.setEdges);

  useEffect(() => {
    const nodes: Node[] = elements.filter(isNode);
    const edges: Edge[] = elements.filter(isEdge).map((e) => parseElement(e) as Edge);

    const nextNodes: Node[] = nodes.map((propNode) => {
      const existingNode = stateNodes.find((n) => n.id === propNode.id);

      if (existingNode) {
        const data = !isEqual(existingNode.data, propNode.data)
          ? { ...existingNode.data, ...propNode.data }
          : existingNode.data;

        const style = !isEqual(existingNode.style, propNode.style)
          ? { ...existingNode.style, ...propNode.style }
          : existingNode.style;

        const className = existingNode.className === propNode.className ? existingNode.className : propNode.className;
        const isHidden = existingNode.isHidden === propNode.isHidden ? existingNode.isHidden : propNode.isHidden;

        const positionChanged =
          existingNode.position.x !== propNode.position.x || existingNode.position.y !== propNode.position.y;

        const nodeProps = {
          ...existingNode,
          data,
        };

        if (positionChanged) {
          nodeProps.__rf = {
            ...existingNode.__rf,
            position: propNode.position,
          };
          nodeProps.position = propNode.position;
        }

        if (typeof style !== 'undefined') {
          nodeProps.style = style;
        }

        if (typeof className !== 'undefined') {
          nodeProps.className = className;
        }

        if (typeof isHidden !== 'undefined') {
          nodeProps.isHidden = isHidden;
        }

        return nodeProps;
      }

      return parseElement(propNode) as Node;
    });

    const nodesChanged: boolean = !isEqual(stateNodes, nextNodes);
    const edgesChanged: boolean = !isEqual(stateEdges, edges);

    if (nodesChanged) {
      setNodes(nextNodes);
    }

    if (edgesChanged) {
      setEdges(edges);
    }
  }, [elements, stateNodes, stateEdges]);
};

export default useElementUpdater;
