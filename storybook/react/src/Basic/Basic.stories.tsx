// storybook/react/src/Basic/Basic.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import Basic from './Basic';

const meta: Meta<typeof Basic> = {
  title: 'React Flow/Basic',
  component: Basic,
  argTypes: {
    classNames: {
      description: 'CSS class name to apply to all nodes (light or dark theme)',
      options: ['light', 'dark'],
      control: { type: 'radio' },
    },
    nodeDragThreshold: {
      description: 'Distance in pixels that a node must be dragged before drag starts (0-20)',
      control: { type: 'number', min: 0, max: 20, step: 1 },
    },
    onNodeDrag: {
      description: 'Callback fired while dragging a node',
      table: { disable: true },
    },
    onNodeDragStart: {
      description: 'Callback fired when node drag starts',
      table: { disable: true },
    },
    onNodeDragStop: {
      description: 'Callback fired when node drag ends',
      table: { disable: true },
    },
    onNodeClick: {
      description: 'Callback fired when a node is clicked',
      table: { disable: true },
    },
    isHidden: {
      description: 'Controls the visibility of the React Flow component',
      control: { type: 'radio' },
      options: ['visible', 'hidden'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const BasicStory: Story = {
  args: {
    nodeDragThreshold: 0,
    classNames: 'dark',
    isHidden: 'visible',
  },
};

export const DragNode: Story = {
  play: async ({ canvasElement, step }) => {
    const { within, waitFor, expect } = await import('@storybook/test');
    const canvas = within(canvasElement);

    const label = await canvas.findByText(/Node 1/i);
    const node = label.closest('.react-flow__node') as HTMLElement;
    const rect = node.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    await step('Pointer down', async () => {
      node.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, pointerId: 1, buttons: 1 })
      );
    });

    await step('Drag 30px right', async () => {
      node.dispatchEvent(
        new PointerEvent('pointermove', { bubbles: true, clientX: x + 30, clientY: y, pointerId: 1, buttons: 1 })
      );
      await waitFor(() => expect(node.classList.contains('dragging')).toBe(true));
    });

    await step('Pointer up', async () => {
      node.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: x + 30, clientY: y, pointerId: 1 }));
    });
  },
};
