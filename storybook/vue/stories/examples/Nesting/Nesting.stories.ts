import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Example from './Nesting.vue';

const meta = {
  title: 'Examples/Layout/Nesting',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
  render: () => ({ components: { Example }, template: '<Example />' }),
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
