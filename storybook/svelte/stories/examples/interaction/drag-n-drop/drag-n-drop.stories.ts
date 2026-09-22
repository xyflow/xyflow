import type { Meta, StoryObj } from '@storybook/svelte-vite';

import Example from './Example.svelte';

const meta = {
  title: 'Examples/Interaction/Drag and Drop',
  component: Example,
  tags: ['example'],
} satisfies Meta<typeof Example>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
