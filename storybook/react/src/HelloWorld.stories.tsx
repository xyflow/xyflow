import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Simple nodes for our Hello World example
const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Hello' },
  },
  {
    id: '2',
    position: { x: 300, y: 100 },
    data: { label: 'World!' },
  },
];

// Simple edge connecting the nodes
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

const HelloWorldFlow = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const meta: Meta<typeof HelloWorldFlow> = {
  title: 'React Flow/Hello World',
  component: HelloWorldFlow,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithAnimatedEdge: Story = {
  render: () => {
    const animatedEdges: Edge[] = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
      },
    ];

    return (
      <div style={{ width: '100%', height: '400px' }}>
        <ReactFlow nodes={initialNodes} edges={animatedEdges} fitView>
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    );
  },
};
