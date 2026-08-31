import { createContext } from 'react';

import { type createStore } from '../store';

const StoreContext = createContext<ReturnType<typeof createStore> | null>(null);

export const Provider = StoreContext.Provider;
export default StoreContext;
