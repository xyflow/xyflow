import type { Meta, StoryObj } from '@storybook/react-vite';

import { BasicExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Basic',
  component: BasicExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    isHidden: false,
  },
  argTypes: {
    isHidden: { control: 'boolean' },
  },
} satisfies Meta<typeof BasicExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
