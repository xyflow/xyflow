import React, { FC } from 'react';
import { StoreProvider } from 'easy-peasy';

import store from '../../store';
import { useStore } from '../../store/hooks';

const Wrapper: FC = ({ children }) => {
  const easyPeasyStore = useStore();
  const isWrapepdWithReactFlowProvider = easyPeasyStore?.getState()?.reactFlowVersion;

  if (isWrapepdWithReactFlowProvider) {
    // we need to wrap it with a fragment because t's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return <>{children}</>;
  }

  return <StoreProvider store={store}>{children}</StoreProvider>;
};

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
