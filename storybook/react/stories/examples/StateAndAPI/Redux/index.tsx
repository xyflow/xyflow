import { useState } from 'react';
import { ReactFlow, Background, addEdge } from '@xyflow/react';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { action } from 'storybook/actions';
import { defaultFlowProps } from '@shared/defaultFlow';
import { createFlowStore, setNodes, setEdges, type FlowState } from './state';
import InteractionPanel from '@shared/InteractionPanel/InteractionPanel';
function Flow() {
  const dispatch = useDispatch();
  const nodes = useSelector((state: FlowState) => state.nodes);
  const edges = useSelector((state: FlowState) => state.edges);
  return (
    <ReactFlow
      {...defaultFlowProps}
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes) => dispatch(setNodes(changes.applyTo(nodes)))}
      onEdgesChange={(changes) => dispatch(setEdges(changes.applyTo(edges)))}
      onConnect={(connection) => dispatch(setEdges(addEdge(connection, edges)))}
      onSelectionChange={action('onSelectionChange')}
    >
      <Background />
      <InteractionPanel />
    </ReactFlow>
  );
}
export default function ReduxExample() {
  const [store] = useState(createFlowStore);
  return (
    <Provider store={store}>
      <Flow />
    </Provider>
  );
}
