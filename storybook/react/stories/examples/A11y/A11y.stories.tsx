import type { Meta, StoryObj } from '@storybook/react-vite';

import { A11yExample } from './index';
import { exampleStoryParameters, withReactFlowProvider } from '../exampleStory';

const meta = {
  title: 'Examples/A11y',
  component: A11yExample,
  tags: ['example'],
  parameters: exampleStoryParameters,
  decorators: [withReactFlowProvider],
  args: {
    autoPanOnNodeFocus: true,
    ariaNodeDefault: 'Custom Node Desc.',
    ariaNodeKeyboardDisabled: 'Custom Keyboard Desc.',
    ariaNodeLiveMessagePrefix: 'Custom Moved selected node',
    ariaEdgeDefault: 'Custom Edge Desc.',
    ariaControlsLabel: 'Custom Controls Aria Label',
    ariaControlsZoomIn: 'Custom Zoom in',
    ariaControlsZoomOut: 'Custom Zoom Out',
    ariaControlsFitView: 'Custom Fit View',
    ariaControlsInteractive: 'Custom Toggle Interactivity',
    ariaMinimap: 'Custom Aria Label',
  },
  argTypes: {
    autoPanOnNodeFocus: { control: 'boolean' },
    ariaNodeDefault: { control: 'text' },
    ariaNodeKeyboardDisabled: { control: 'text' },
    ariaNodeLiveMessagePrefix: { control: 'text' },
    ariaEdgeDefault: { control: 'text' },
    ariaControlsLabel: { control: 'text' },
    ariaControlsZoomIn: { control: 'text' },
    ariaControlsZoomOut: { control: 'text' },
    ariaControlsFitView: { control: 'text' },
    ariaControlsInteractive: { control: 'text' },
    ariaMinimap: { control: 'text' },
  },
} satisfies Meta<typeof A11yExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
