import type { Meta, StoryObj } from '@storybook/react-vite';

import { UseOnSelectionChangeExample } from './index';

const meta = {
  title: 'Examples/State & API/useOnSelectionChange',
  component: UseOnSelectionChangeExample,
  tags: ['example'],
  args: {
    elementsSelectable: true,
    secondLoggerActive: true,
  },
  argTypes: {
    elementsSelectable: { control: 'boolean' },
    secondLoggerActive: { control: 'boolean' },
  },
} satisfies Meta<typeof UseOnSelectionChangeExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
