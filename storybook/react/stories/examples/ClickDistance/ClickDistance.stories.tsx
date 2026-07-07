import type { Meta, StoryObj } from '@storybook/react-vite';

import { ClickDistanceExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Click Distance',
  component: ClickDistanceExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    paneClickDistance: 0,
  },
  argTypes: {
    paneClickDistance: { control: { type: 'number', min: 0, max: 50, step: 1 } },
  },
} satisfies Meta<typeof ClickDistanceExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
