import type { Meta, StoryObj } from '@storybook/framework';
import Example from 'CustomNode';
const meta = {
  title: 'Examples/Nodes/Custom Node',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Example>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
