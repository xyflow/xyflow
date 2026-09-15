import type { Meta, StoryObj } from '@storybook/framework';
import Example from 'Validation';
const meta = {
  title: 'Examples/Connections/Validation',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
  args: {},
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
