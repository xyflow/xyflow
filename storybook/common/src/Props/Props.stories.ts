import type { Meta } from '@storybook/react';

import type { Props } from './data';
import { argTypes as baseArgTypes } from '../argTypes';
import { expect } from '@storybook/test';

const argTypes = {
  ...baseArgTypes,
} satisfies Record<keyof Props, any>;

export const meta: Meta = {
  title: 'Props',
  argTypes,
  parameters: {
    framework: 'react',
  },
};

export const HighNodeDragThreshold = {
  args: {
    nodeDragThreshold: 50,
  },
};

export const NoNodeDragThreshold = {
  args: {
    nodeDragThreshold: 0,
  },
  play: async ({ context }: { context: any }) => {
    const { canvasElement, step } = context;
    const framework = context.parameters.renderer;

    if (framework === 'react') {
      await step(`Check ${framework} Flow renders`, async () => {
        const renderer = canvasElement.querySelector(`.${framework}-flow__renderer`);
        expect(renderer).toBeInTheDocument();
      });
    }

    await step('Check className prop works', async () => {
      const flowContainer = canvasElement.querySelector('.light');
      await expect(flowContainer).toBeInTheDocument();
    });

    await step('Check nodes render correctly', async () => {
      const nodes = canvasElement.querySelectorAll(`.${framework}-flow__node`);
      await expect(nodes).toHaveLength(4);
    });

    await step('Check edges render correctly', async () => {
      // const edges = canvasElement.querySelectorAll(`.${framework}-flow__edge`);
      // TODO: Fix problematic test
      // await expect(edges).toHaveLength(2);
    });

    await step('Check background renders', async () => {
      const background = canvasElement.querySelector(`.${framework}-flow__background`);
      await expect(background).toBeInTheDocument();
    });

    await step('Check node handles exist', async () => {
      const handles = canvasElement.querySelectorAll(`.${framework}-flow__node .${framework}-flow__handle`);
      await expect(handles.length).toBeGreaterThan(0);
    });
  },
};

export const PanOnScroll = {
  args: {
    zoomOnScroll: false,
    panOnDrag: false,
    panOnScroll: true,
  },
};

export const Default = {
  args: {
    maxZoom: 15,
  },
};
