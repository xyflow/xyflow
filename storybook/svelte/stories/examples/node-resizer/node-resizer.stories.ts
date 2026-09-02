import type { Meta, StoryObj } from '@storybook/svelte-vite';

import Page from './+page.svelte';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Node Resizer',
  component: Page,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    snapToGrid: false,
  },
  argTypes: {
    snapToGrid: { control: 'boolean' },
  },
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
