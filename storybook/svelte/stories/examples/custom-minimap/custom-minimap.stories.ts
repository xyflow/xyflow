import type { Meta, StoryObj } from '@storybook/svelte-vite';

import Page from './+page.svelte';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Custom Minimap',
  component: Page,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    hideAllNodes: false,
  },
  argTypes: {
    hideAllNodes: { control: 'boolean' },
  },
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
