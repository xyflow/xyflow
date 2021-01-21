import React, { FC, useContext } from 'react';
import { Provider, ReactReduxContext } from 'react-redux';

import store from '../../store';

const Wrapper: FC = ({ children }) => {
  const contextValue = useContext(ReactReduxContext);
  const isWrappedWithReactFlowProvider = contextValue?.store?.getState()?.reactFlowVersion;

  if (isWrappedWithReactFlowProvider) {
    // we need to wrap it with a fragment because t's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return <>{children}</>;
  }

  return <Provider store={store}>{children}</Provider>;
};

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
