import type { Meta, StoryObj } from '@storybook/react-vite';

import { HiddenExample } from './index';

const meta = {
  title: 'Examples/Nodes/Hidden',
  component: HiddenExample,
  tags: ['example'],
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
