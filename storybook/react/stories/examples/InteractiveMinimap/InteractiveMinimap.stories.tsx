import type { Meta, StoryObj } from '@storybook/react-vite';

import { InteractiveMinimapExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Interactive Minimap',
  component: InteractiveMinimapExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    inversePan: false,
  },
  argTypes: {
    inversePan: { control: 'boolean' },
  },
} satisfies Meta<typeof InteractiveMinimapExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
