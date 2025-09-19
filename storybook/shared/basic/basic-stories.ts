// Shared story configuration and test data for React and Svelte Flow examples// Basic Flow Props interface
export interface BasicFlowProps {
  nodeDragThreshold?: number;
  classNames?: string;
  isHidden?: string;
  onNodeDrag?: any;
  onNodeDragStart?: any;
  onNodeDragStop?: any;
  onNodeClick?: any;
}

// Shared argTypes for Storybook controls
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

// Single function that runs all basic rendering tests for a framework
export const runBasicRenderingTests = async (
  frameworkName: 'React' | 'Svelte',
  { canvasElement, step, expect }: { canvasElement: any; step: any; expect: any }
) => {
  const prefix = frameworkName.toLowerCase();
  if (frameworkName === 'React') {
    await step(`Check ${frameworkName} Flow renders`, async () => {
      const renderer = canvasElement.querySelector(`.${prefix}-flow__renderer`);
      expect(renderer).toBeInTheDocument();
    });
  }

  await step('Check className prop works', async () => {
    const flowContainer = canvasElement.querySelector('.light');
    expect(flowContainer).toBeInTheDocument();
  });

  await step('Check nodes render correctly', async () => {
    const nodes = canvasElement.querySelectorAll(`.${prefix}-flow__node`);
    expect(nodes).toHaveLength(4);
  });

  await step('Check edges render correctly', async () => {
    const edges = canvasElement.querySelectorAll(`.${prefix}-flow__edge`);
    expect(edges).toHaveLength(2);
  });

  await step('Check background renders', async () => {
    const background = canvasElement.querySelector(`.${prefix}-flow__background`);
    expect(background).toBeInTheDocument();
  });

  await step('Check node handles exist', async () => {
    const handles = canvasElement.querySelectorAll(`.${prefix}-flow__node .${prefix}-flow__handle`);
    expect(handles.length).toBeGreaterThan(0);
  });
};
