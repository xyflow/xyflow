import type { Meta, StoryObj } from '@storybook/svelte-vite';

import Page from './+page.svelte';
import { exampleStoryParameters } from '../exampleStory';

const meta = {
  title: 'Examples/A11y',
  component: Page,
  tags: ['example'],
  parameters: exampleStoryParameters,
  args: {
    autoPanOnNodeFocus: true,
    ariaNodeDefault: 'Svelte Custom Node Desc.',
    ariaNodeKeyboardDisabled: 'Svelte Custom Keyboard Desc.',
    ariaNodeLiveMessagePrefix: 'Custom Moved selected node',
    ariaEdgeDefault: 'Svelte Custom Edge Desc.',
    ariaControlsLabel: 'Svelte Custom Control Aria Label',
    ariaControlsZoomIn: 'Svelte Custom Zoom in',
    ariaControlsZoomOut: 'Svelte Custom Zoom Out',
    ariaControlsInteractive: 'Svelte Custom Toggle Interactivity',
    ariaMinimap: 'Svelte Custom Minimap',
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
    ariaControlsInteractive: { control: 'text' },
    ariaMinimap: { control: 'text' },
  },
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
