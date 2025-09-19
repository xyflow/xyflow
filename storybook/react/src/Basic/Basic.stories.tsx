// storybook/react/src/Basic/Basic.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import Basic from './Basic';

const meta: Meta<typeof Basic> = {
  title: 'React Flow/Basic',
  component: Basic,
  argTypes: {
    classNames: {
      description: 'CSS class name to apply to flow',
      options: ['light', 'dark'],
      control: { type: 'radio' },
    },
    nodeDragThreshold: {
      description: 'Distance in pixels that a node must be dragged before drag starts',
      control: { type: 'number', min: 0, max: 2000, step: 1 },
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
    classNames: 'light',
    isHidden: 'visible',
  },
};

export const BasicRendering: Story = {
  play: async ({ canvasElement, step }) => {
    const { expect } = await import('@storybook/test');

    await step('Check React Flow renders', async () => {
      // Use canvasElement for querySelector when needed
      const renderer = canvasElement.querySelector('.react-flow__renderer');
      expect(renderer).toBeInTheDocument();
    });

    await step('Check className prop works', async () => {
      // Check if custom className is applied
      const flowContainer = canvasElement.querySelector('.light');
      expect(flowContainer).toBeInTheDocument();
    });

    await step('Check nodes render correctly', async () => {
      // Use canvasElement for querySelectorAll
      const nodes = canvasElement.querySelectorAll('.react-flow__node');
      expect(nodes).toHaveLength(4);
    });

    await step('Check edges render correctly', async () => {
      // Check that we have 2 edges
      const edges = canvasElement.querySelectorAll('.react-flow__edge');
      expect(edges).toHaveLength(2);
    });

    await step('Check background renders', async () => {
      // Check if background exists
      const background = canvasElement.querySelector('.react-flow__background');
      expect(background).toBeInTheDocument();
    });

    await step('Check node handles exist', async () => {
      // Check that nodes have handles
      const handles = canvasElement.querySelectorAll('.react-flow__node .react-flow__handle');
      expect(handles.length).toBeGreaterThan(0);
    });
  },
};
