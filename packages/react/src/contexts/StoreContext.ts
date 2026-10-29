import { createContext } from 'react';

import type { ReactFlowStoreApi } from '../types';

const StoreContext = createContext<ReactFlowStoreApi | null>(null);

export const Provider = StoreContext.Provider;
export default StoreContext;
