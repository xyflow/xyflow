import { ReactFlow } from '@xyflow/react';

import { useDispatch, useSelector, Provider } from 'react-redux';

import { onNodesChange, onEdgesChange, setSelectedNodesAndEdges, store } from './state';

const OverviewFlow = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.myApplication.nodes);
  const edges = useSelector((state) => state.myApplication.edges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={(e) => dispatch(onNodesChange(e))}
      onEdgesChange={(e) => dispatch(onEdgesChange(e))}
      onSelectionChange={(e) => dispatch(setSelectedNodesAndEdges(e))}
      fitView
      attributionPosition="top-right"
    />
  );
};

export default () => (
  <Provider store={store}>
    <OverviewFlow />
  </Provider>
);
