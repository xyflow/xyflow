import type { Meta, StoryObj } from '@storybook/framework';
import Example from 'EdgeToolbar';
const meta = {
  title: 'Components/EdgeToolbar',
  component: Example,
  tags: ['components'],
  parameters: { layout: 'fullscreen' },
  args: {},
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
