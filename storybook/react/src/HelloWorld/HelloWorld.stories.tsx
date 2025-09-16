import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelloWorld, AnimatedHelloWorld } from './HelloWorld';
import { within, waitFor } from '@storybook/test';

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

export const WithAnimatedEdge: Story = {
  render: () => <AnimatedHelloWorld />,
};
