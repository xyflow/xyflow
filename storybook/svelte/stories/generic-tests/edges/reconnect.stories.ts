import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Flow from '../Flow.svelte';
import flowConfig from './reconnect';

const meta = {
  title: 'Generic Tests/Edges/reconnect',
  component: Flow,
  args: { flowConfig },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Flow>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
