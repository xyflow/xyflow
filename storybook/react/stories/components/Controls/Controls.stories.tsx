import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { createControlsSuite } from 'storybook-shared/play-helpers';

import { AddonsFlow } from '../../../components/AddonsFlowStory';
import { exampleStoryParameters } from '../../examples/exampleStory';

import { ControlsExample } from './Flow';
import { API_DOCS_URL, defaultControlsArgs, controlsArgTypes } from './config';

const runControlsSuite = createControlsSuite();

const testStoryParameters = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};

const meta = {
  title: 'Components/Controls',
  component: ControlsExample,
  tags: ['components'],
  parameters: {
    ...exampleStoryParameters,
    docs: {
      description: {
        component: `Interactive playground for [\`<Controls />\`](${API_DOCS_URL}). Use controls to tweak props. The General story runs automated regression tests in CI.`,
      },
    },
  },
  args: {
    ...defaultControlsArgs,
    onZoomIn: fn(),
    onZoomOut: fn(),
    onFitView: fn(),
    onInteractiveChange: fn(),
  },
  argTypes: controlsArgTypes,
} satisfies Meta<typeof ControlsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    position: 'top-right',
  },
};

export const ZoomOnly: Story = {
  args: {
    showFitView: false,
    showInteractive: false,
  },
};

export const General: Story = {
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  render: () => <AddonsFlow />,
  play: runControlsSuite,
};
