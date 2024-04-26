// import { createContext, useContext } from 'react';

import { createContext, useContext } from "solid-js";

export const NodeIdContext = createContext<(() => string | null) | null>(null);
export const Provider = NodeIdContext.Provider;
// export const Consumer = NodeIdContext.Consumer;

export const useNodeId = (): () => string | null => {
  const nodeId = useContext(NodeIdContext);
  if (!nodeId) { 
    throw new Error('NodeIdContext is not provided');
  }
  return nodeId;
};

export default NodeIdContext;
