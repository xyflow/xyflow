import { createContext } from 'react';

type ContextProps = string | null;

export const NodeIdContext = createContext<Partial<ContextProps>>(null);
export const Provider = NodeIdContext.Provider;
export const Consumer = NodeIdContext.Consumer;

export default NodeIdContext;
