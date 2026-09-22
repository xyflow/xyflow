import type { Meta, StoryObj } from '@storybook/framework';
import Example from 'NodeResizer';
const meta = {
  title: 'Components/NodeResizer',
  component: Example,
  tags: ['components'],
  parameters: { layout: 'fullscreen' },
  args: { snapToGrid: false },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SnapToGrid: Story = { args: { snapToGrid: true } };
