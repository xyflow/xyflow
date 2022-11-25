import { useContext } from 'react';
import type { FC, PropsWithChildren } from 'react';

import StoreContext from '../../contexts/RFStoreContext';
import ReactFlowProvider from '../../components/ReactFlowProvider';

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const isWrapped = useContext(StoreContext);

  if (isWrapped) {
    // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return <>{children}</>;
  }

  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
