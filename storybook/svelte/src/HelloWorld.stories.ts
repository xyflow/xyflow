import type { Meta, StoryObj } from '@storybook/svelte-vite';
import HelloWorld from './HelloWorld.svelte';

const meta = {
  title: 'Svelte Examples/Hello World',
  component: HelloWorld,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof HelloWorld>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
