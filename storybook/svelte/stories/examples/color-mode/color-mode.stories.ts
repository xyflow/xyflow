import type { Meta, StoryObj } from '@storybook/svelte-vite';

import Page from './+page.svelte';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Color Mode',
  component: Page,
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
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
