import type { Meta, StoryObj } from '@storybook/react-vite';

import { NodeTypesObjectChangeExample } from './index';

const meta = {
  title: 'Examples/Nodes/nodeTypes Object Change',
  component: NodeTypesObjectChangeExample,
  tags: ['example'],
  args: {
    nodeTypesId: 'a',
  },
  argTypes: {
    nodeTypesId: {
      control: 'select',
      options: ['a', 'b'],
    },
  },
} satisfies Meta<typeof NodeTypesObjectChangeExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
