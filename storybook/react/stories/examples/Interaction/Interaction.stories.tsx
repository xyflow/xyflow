import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanOnScrollMode } from '@xyflow/react';

import { InteractionExample } from './index';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/Interaction',
  component: InteractionExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    elementsSelectable: false,
    nodesDraggable: false,
    nodesConnectable: false,
    zoomOnScroll: false,
    zoomOnPinch: false,
    panOnScroll: false,
    panOnScrollMode: PanOnScrollMode.Free,
    zoomOnDoubleClick: false,
    panOnDrag: true,
    captureZoomClick: false,
    captureZoomScroll: false,
    captureElementClick: false,
  },
  argTypes: {
    elementsSelectable: { control: 'boolean' },
    nodesDraggable: { control: 'boolean' },
    nodesConnectable: { control: 'boolean' },
    zoomOnScroll: { control: 'boolean' },
    zoomOnPinch: { control: 'boolean' },
    panOnScroll: { control: 'boolean' },
    panOnScrollMode: {
      control: 'select',
      options: [PanOnScrollMode.Free, PanOnScrollMode.Vertical, PanOnScrollMode.Horizontal],
    },
    zoomOnDoubleClick: { control: 'boolean' },
    panOnDrag: { control: 'boolean' },
    captureZoomClick: { control: 'boolean' },
    captureZoomScroll: { control: 'boolean' },
    captureElementClick: { control: 'boolean' },
  },
} satisfies Meta<typeof InteractionExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
