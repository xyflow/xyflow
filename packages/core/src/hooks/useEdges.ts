import type { Edge, ReactFlowState } from '@reactflow/system';

import { useStore } from '../hooks/useStore';

const edgesSelector = (state: ReactFlowState) => state.edges;

function useEdges<EdgeData>(): Edge<EdgeData>[] {
  const edges = useStore(edgesSelector);

  return edges;
}

export default useEdges;
