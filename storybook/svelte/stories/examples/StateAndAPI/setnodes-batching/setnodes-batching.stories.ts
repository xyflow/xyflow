import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Example from './Example.svelte';

const meta = {
  title: 'Examples/State & API/SetNodesBatching',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Example>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
