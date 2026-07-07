import type { Meta, StoryObj } from '@storybook/react-vite';

import { ColorModeExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Color Mode',
  component: ColorModeExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    pageTheme: 'system',
    forceColorMode: 'none',
  },
  argTypes: {
    pageTheme: {
      control: 'select',
      options: ['system', 'light', 'dark'],
    },
    forceColorMode: {
      control: 'select',
      options: ['none', 'light', 'dark'],
    },
  },
} satisfies Meta<typeof ColorModeExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
