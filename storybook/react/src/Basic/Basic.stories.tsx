// storybook/react/src/Basic/Basic.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import Basic from './Basic';
import { waitForDragging } from './waitForDragging';

const meta: Meta<typeof Basic> = {
  title: 'React Flow/Basic',
  component: Basic,
  argTypes: {
    reset: { control: { type: 'boolean' } },
    nodeDragThreshold: { control: { type: 'number', min: 0, max: 20, step: 1 } } as any,
  } as any,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const BasicStory: Story = {
  args: {
    reset: false,
    nodeDragThreshold: 0,
  },
  argTypes: {
    resetTransform: { control: { type: 'button' } } as any,
  } as any,
};

export const UserDragAddsDraggingClass: Story = {
  name: 'User drag adds .dragging',
  parameters: { test: { timeout: 15000 } },
  play: async ({ canvasElement }) => {
    await waitForDragging(canvasElement, { findByLabelText: /Hello/i });
  },
};
