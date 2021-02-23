import React, { FC, useContext, useMemo } from 'react';
import { Provider, ReactReduxContext } from 'react-redux';

import store from '../../store';

const Wrapper: FC = ({ children }) => {
  const contextValue = useContext(ReactReduxContext);
  const isWrappedWithReactFlowProvider = useMemo(() => contextValue?.store?.getState()?.reactFlowVersion, [
    contextValue,
  ]);

  if (isWrappedWithReactFlowProvider) {
    // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return <>{children}</>;
  }

  return <Provider store={store}>{children}</Provider>;
};

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
