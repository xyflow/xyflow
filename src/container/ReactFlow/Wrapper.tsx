import React, { FC } from 'react';
import { Provider } from 'react-redux';

import store from '../../store';
// import { useStore } from '../../store/hooks';

const Wrapper: FC = ({ children }) => {
  // const reactFlowStore = useStore();
  // const isWrapepdWithReactFlowProvider = reactFlowStore?.getState()?.reactFlowVersion;

  // console.log(isWrapepdWithReactFlowProvider);

  // if (isWrapepdWithReactFlowProvider) {
  //   // we need to wrap it with a fragment because t's not allowed for children to be a ReactNode
  //   // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
  //   return <>{children}</>;
  // }

  return <Provider store={store}>{children}</Provider>;
};

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
