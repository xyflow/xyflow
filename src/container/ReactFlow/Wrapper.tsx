import React, { FC } from 'react';

import { Provider, createStore, useStoreApi } from '../../store';

const Wrapper: FC = ({ children }) => {
  let isWrapped = true;

  try {
    useStoreApi();
  } catch (e) {
    isWrapped = false;
  }

  if (isWrapped) {
    // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return <>{children}</>;
  }

  return <Provider createStore={createStore}>{children}</Provider>;
};

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
