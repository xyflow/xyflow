import { createContext } from 'react';

import { createRFStore } from '../store';

const StoreContext = createContext<ReturnType<typeof createRFStore> | null>(null);

export const Provider = StoreContext.Provider;
export default StoreContext;
