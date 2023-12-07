import { useCallback } from 'react';

import useReactFlow from './useReactFlow';

export function useUpdateNodeData() {
  const { setNodes } = useReactFlow();

  const updateNodeData = useCallback((id: string, data: unknown) => {
    setNodes((prevNodes) => prevNodes.map((node) => (node.id === id ? { ...node, data } : node)));
  }, []);

  return updateNodeData;
}
