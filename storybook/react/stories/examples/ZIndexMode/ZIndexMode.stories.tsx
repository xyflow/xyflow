import type { Meta, StoryObj } from '@storybook/react-vite';

import { ZIndexModeExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/zIndexMode',
  component: ZIndexModeExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    zIndexMode: 'auto',
  },
  argTypes: {
    zIndexMode: {
      control: 'select',
      options: ['auto', 'basic', 'manual'],
    },
  },
} satisfies Meta<typeof ZIndexModeExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
