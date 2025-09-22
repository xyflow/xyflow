// storybook/react/src/Basic/Basic.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import Basic from './Basic';
import { expect } from 'storybook/test';

export const sharedArgTypes = {
  classNames: {
    description: 'CSS class name to apply to flow',
    options: ['light', 'dark'],
    control: { type: 'radio' as const },
  },
  nodeDragThreshold: {
    description: 'Distance in pixels that a node must be dragged before drag starts',
    control: { type: 'number' as const, min: 0, max: 2000, step: 1 },
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
    description: 'Controls the visibility of the Flow component',
    control: { type: 'radio' as const },
    options: ['visible', 'hidden'],
  },
};

// Default story args
export const defaultStoryArgs = {
  nodeDragThreshold: 0,
  classNames: 'light',
  isHidden: 'visible',
};

const meta: Meta<typeof Basic> = {
  title: 'React Flow/Basic',
  component: Basic,
  argTypes: sharedArgTypes,
} satisfies Meta<typeof Basic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicStory: Story = {
  args: defaultStoryArgs,
};

export const BasicRendering: Story = {
  args: defaultStoryArgs,
  play: async ({ canvasElement, step }) => {
    const frameworkName = 'React';
    const prefix = 'react';

    await step(`Check ${frameworkName} Flow renders`, async () => {
      const renderer = canvasElement.querySelector(`.${prefix}-flow__renderer`);
      expect(renderer).toBeInTheDocument();
    });
  },
};
