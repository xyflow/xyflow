import type { Meta, StoryObj } from '@storybook/react-vite';

import { NodeResizerExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/NodeResizer',
  component: NodeResizerExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    snapToGrid: false,
  },
  argTypes: {
    snapToGrid: { control: 'boolean' },
  },
} satisfies Meta<typeof NodeResizerExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
