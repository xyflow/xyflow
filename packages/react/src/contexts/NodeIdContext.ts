import { createContext, useContext } from 'react';

export const NodeIdContext = createContext<string | null>(null);
export const Provider = NodeIdContext.Provider;
export const Consumer = NodeIdContext.Consumer;

export const useNodeId = (): string | null => {
  const nodeId = useContext(NodeIdContext);
  return nodeId;
};

export default NodeIdContext;
