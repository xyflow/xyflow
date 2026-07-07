import type { Meta, StoryObj } from '@storybook/react-vite';

import { NodeTypesObjectChangeExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/nodeTypes Object Change',
  component: NodeTypesObjectChangeExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
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
