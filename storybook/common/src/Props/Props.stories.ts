import type { Meta } from '@storybook/react';

import type { Props } from './data';
import { argTypes as baseArgTypes } from '../argTypes';

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
