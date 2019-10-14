import { createContext } from 'react';

import { ElementId } from '../types';

type ContextProps = ElementId | null;

export const NodeIdContext = createContext<Partial<ContextProps>>(null);
export const Provider = NodeIdContext.Provider;
export const Consumer = NodeIdContext.Consumer;

export default NodeIdContext;
