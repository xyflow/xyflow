import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelloWorld, AnimatedHelloWorld } from './HelloWorld';
import { within, waitFor } from '@storybook/test';
import { waitForDragging } from './waitForDragging';

const meta: Meta<typeof HelloWorld> = {
  title: 'React Flow/Hello World',
  component: HelloWorld,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: { test: { timeout: 15000 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Canvas ready
    await waitFor(() => {
      const label = canvas.queryByText(/Hello/i);
      if (!label) throw new Error('[Canvas] Hello label not found yet');
    });
  },
};

export const UserDragAddsDraggingClass: Story = {
  name: 'User drag adds .dragging',
  parameters: { test: { timeout: 15000 } },
  play: async ({ canvasElement }) => {
    await waitForDragging(canvasElement, { findByLabelText: /Hello/i });
  },
};

export const WithAnimatedEdge: Story = {
  render: () => <AnimatedHelloWorld />,
};
