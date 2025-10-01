import type { Meta, StoryObj } from '@storybook/react-vite';
import NodeEvents from './NodeEvents';

const meta: Meta<typeof NodeEvents> = {
  title: 'React Flow/ReactFlow/Node Events',
  component: NodeEvents,
  parameters: { renderer: 'react' },
  argTypes: {
    onNodeClick: { action: 'onNodeClick' },
    onNodeDoubleClick: { action: 'onNodeDoubleClick' },
    onNodeDragStart: { action: 'onNodeDragStart' },
    onNodeDrag: { action: 'onNodeDrag' },
    onNodeDragStop: { action: 'onNodeDragStop' },
    onNodeMouseEnter: { action: 'onNodeMouseEnter' },
    onNodeMouseMove: { action: 'onNodeMouseMove' },
    onNodeMouseLeave: { action: 'onNodeMouseLeave' },
    onNodeContextMenu: { action: 'onNodeContextMenu' },
    onNodesDelete: { action: 'onNodesDelete' },
    onNodesChange: { action: 'onNodesChange' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
