import { createContext } from 'react';

export const NodeIdContext = createContext(null);
export const Provider = NodeIdContext.Provider;
export const Consumer = NodeIdContext.Consumer;

Provider.displayName = 'NodeIdProvider';

export default NodeIdContext;
