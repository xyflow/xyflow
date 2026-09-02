import type { Meta, StoryObj } from '@storybook/react-vite';

import Example from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Custom Node',
  tags: ['example'],
  parameters: exampleStoryParameters,
  render: () => <Example />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
