import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Example from './CustomConnectionLine.vue';

const meta = {
  title: 'Examples/Connections/Custom Connection Line',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
  render: () => ({ components: { Example }, template: '<Example />' }),
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
