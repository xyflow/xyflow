import { useEffect } from 'react';

import { useStoreActions } from '../../store/hooks';
import { Node, Edge } from '../../types';

interface ElementUpdaterProps {
  nodes: Node[];
  edges: Edge[];
}

const ElementUpdater = ({ nodes, edges }: ElementUpdaterProps) => {
  const setNodes = useStoreActions((actions) => actions.setNodes);
  const setEdges = useStoreActions((actions) => actions.setEdges);

  useEffect(() => {
    setNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges]);

  return null;
};

export default ElementUpdater;
