import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Example from './UnidirectionalExample.vue';

const meta = {
  title: 'Examples/Edges/Unidirectional',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
  render: () => ({ components: { Example }, template: '<Example />' }),
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
