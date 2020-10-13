import React, { useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
} from 'react-flow-renderer';

import TeaserFlow from 'components/TeaserFlow';
import { baseColors } from 'themes';

const initialElements = [
  {
    id: '1',
    type: 'input',
    position: {
      x: 200,
      y: 5,
    },
    data: {
      label: 'Input',
    },
  },
  {
    id: '2',
    position: {
      x: 0,
      y: 150,
    },
    data: {
      label: 'Default',
    },
  },
  {
    id: '3',
    position: {
      x: 400,
      y: 150,
    },
    data: {
      label: 'Default',
    },
  },
  {
    id: '4',
    type: 'output',
    position: {
      x: 200,
      y: 300,
    },
    data: {
      label: 'Output',
    },
  },
  {
    id: 'e1',
    source: '1',
    target: '2',
    label: 'default edge',
  },
  {
    id: 'e2',
    source: '1',
    target: '3',
    animated: true,
    label: 'animated edge',
  },
  {
    id: 'e3',
    source: '2',
    target: '4',
    type: 'smoothstep',
  },
  {
    id: 'e4',
    source: '3',
    target: '4',
    type: 'smoothstep',
  },
];

const onLoad = (rf) => rf.fitView({ padding: 0.2 });

export default () => {
  const [elements, setElements] = useState(initialElements);
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <TeaserFlow
      title="Feature-rich"
      description="React Flow comes with seamless zooming & panning, different edge and node types, single and multi-selection, controls, several event handlers and more."
    >
      <ReactFlowProvider>
        <ReactFlow
          elements={elements}
          onLoad={onLoad}
          zoomOnScroll={false}
          onConnect={onConnect}
        >
          <Background color={baseColors.silverDarken60} gap={15} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </TeaserFlow>
  );
};
