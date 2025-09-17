import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelloWorld, AnimatedHelloWorld } from './HelloWorld';
import { within, waitFor, expect } from '@storybook/test';

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

    // await step('Wait for user drag -> .dragging', async () => {
    //   const node = (window as any).__node__ as HTMLElement;
    //   await waitFor(
    //     () => {
    //       expect(node.classList.contains('dragging')).toBe(true);
    //     },
    //     { timeout: 15000 }
    //   );
    // });
  },
};

export const UserDragAddsDraggingClass: Story = {
  name: 'User drag adds .dragging',
  parameters: { test: { timeout: 15000 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the node (adjust selector if needed)
    const label = await canvas.findByText(/Hello/i);
    const node = label.closest('.react-flow__node') as HTMLElement | null;
    if (!node) throw new Error('Node not found');

    // Wait for the user to drag: class "dragging" appears
    await waitFor(
      () => {
        expect(node.classList.contains('dragging')).toBe(true);
      },
      { timeout: 15000 }
    );
  },
};

export const WithAnimatedEdge: Story = {
  render: () => <AnimatedHelloWorld />,
};
