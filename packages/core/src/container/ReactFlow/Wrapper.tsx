import { FC, PropsWithChildren, useContext } from 'react';

import StoreContext from '../../contexts/RFStoreContext';
import ReactFlowProvider from '../../components/ReactFlowProvider';

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  if (useContext(StoreContext)) {
    // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return <>{children}</>;
  }

  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
