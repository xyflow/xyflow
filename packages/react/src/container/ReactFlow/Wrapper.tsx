import { useContext, type ReactNode } from 'react';

import StoreContext from '../../contexts/RFStoreContext';
import ReactFlowProvider from '../../components/ReactFlowProvider';
import type { Node, Edge } from '../../types';

function Wrapper({
  children,
  nodes,
  edges,
  width,
  height,
}: {
  children: ReactNode;
  nodes?: Node[];
  edges?: Edge[];
  width?: number;
  height?: number;
}) {
  const isWrapped = useContext(StoreContext);

  if (isWrapped) {
    // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return <>{children}</>;
  }

  return (
    <ReactFlowProvider initialNodes={nodes} initialEdges={edges} initialWidth={width} initialHeight={height}>
      {children}
    </ReactFlowProvider>
  );
}

Wrapper.displayName = 'ReactFlowWrapper';

export default Wrapper;
