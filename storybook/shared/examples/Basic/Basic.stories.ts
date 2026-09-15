import type { Meta, StoryObj } from '@storybook/framework';
import Example from 'Basic';
const meta = {
  title: 'Examples/Basic',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
  args: { isHidden: false },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Figma: Story = { args: { figma: true } };
