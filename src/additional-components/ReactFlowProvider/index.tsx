import React, { useMemo, FC } from 'react';
import { StoreProvider, createStore } from 'easy-peasy';

import { storeModel } from '../../store';

const ReactFlowProvider: FC = ({ children }) => {
  const store = useMemo(() => {
    return createStore(storeModel);
  }, []);

  return <StoreProvider store={store}>{children}</StoreProvider>;
};

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;
