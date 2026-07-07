import type { Meta, StoryObj } from '@storybook/react-vite';

import { UseOnSelectionChangeExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/useOnSelectionChange',
  component: UseOnSelectionChangeExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
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
