import type { Meta, StoryObj } from '@storybook/svelte-vite';

import Page from './+page.svelte';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/validation',
  component: Page,
  tags: ['example'],
  parameters: exampleStoryParameters,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
