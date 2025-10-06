import type { Props } from './data';

const argTypes = {
  classNames: {
    description: 'CSS class name to apply to flow',
    options: ['light', 'dark'],
    control: { type: 'radio' as const },
  },
  nodeDragThreshold: {
    description: 'Distance in pixels that a node must be dragged before drag starts',
    control: { type: 'number' as const, min: 0, max: 100, step: 1 },
  },
  minZoom: {
    description: 'Minimum zoom level',
    control: { type: 'number' as const, min: 0.1, max: 2, step: 0.1 },
  },
  maxZoom: {
    description: 'Maximum zoom level',
    control: { type: 'number' as const, min: 1, max: 10, step: 0.5 },
  },
  panOnDrag: {
    description: 'Enable panning by dragging',
    control: { type: 'boolean' as const },
  },
  panOnScroll: {
    description: 'Enable panning by scrolling',
    control: { type: 'boolean' as const },
  },
  zoomOnScroll: {
    description: 'Enable zooming by scrolling',
    control: { type: 'boolean' as const },
  },
} satisfies Record<keyof Props, any>;

export const meta = {
  title: 'Nodes',
  argTypes,
};

export const Default = {
  args: {},
};
