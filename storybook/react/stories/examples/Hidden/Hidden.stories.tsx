import type { Meta, StoryObj } from '@storybook/react-vite';

import { HiddenExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Hidden',
  component: HiddenExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    isHidden: true,
  },
  argTypes: {
    isHidden: { control: 'boolean' },
  },
} satisfies Meta<typeof HiddenExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
