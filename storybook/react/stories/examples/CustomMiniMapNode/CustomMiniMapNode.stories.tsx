import type { Meta, StoryObj } from '@storybook/react-vite';

import { CustomMiniMapNodeExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Custom Minimap Node',
  component: CustomMiniMapNodeExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    hideAllNodes: false,
  },
  argTypes: {
    hideAllNodes: { control: 'boolean' },
  },
} satisfies Meta<typeof CustomMiniMapNodeExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
