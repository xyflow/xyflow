import React, { FC } from 'react';

import { Provider, createStore } from '../../store';
// import { ReactFlowState } from '../../types';

// const reactFlowVersionSelector = (s: ReactFlowState) => s.reactFlowVersion;

const Wrapper: FC = ({ children }) => {
  // let isWrapped = useRef<boolean>(true);

  // try {
  //   useStoreApi();
  // } catch {
  //   isWrapped.current = false;
  // }

  // if (isWrapped) {
  //   // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
  //   // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
  //   return <>{children}</>;
  // }

  return <Provider createStore={createStore}>{children}</Provider>;
};

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
