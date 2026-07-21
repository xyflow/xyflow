import type { Meta, StoryObj } from '@storybook/framework';
import { fn } from 'storybook/test';

import { createControlsSuite } from '../../tests/addons';
import type { FlowFramework } from '../../types';

import AddonsTestFlow from 'storybook-component-addons-test-flow';
import ControlsExample from 'storybook-component-controls-flow';
import { apiDocsUrl, defaultControlsArgs, controlsArgTypes } from './config';

declare const __STORYBOOK_FRAMEWORK__: FlowFramework;

const framework = __STORYBOOK_FRAMEWORK__;
const runControlsSuite = createControlsSuite(framework);

const testStoryParameters = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};

const meta = {
  title: 'Components/Controls',
  component: ControlsExample,
  tags: ['components'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Interactive playground for [\`<Controls />\`](${apiDocsUrl(framework)}). Use controls to tweak props. The General story runs automated regression tests in CI.`,
      },
    },
  },
  args: {
    ...defaultControlsArgs(framework),
    ...(framework === 'react'
      ? {
          onZoomIn: fn(),
          onZoomOut: fn(),
          onFitView: fn(),
          onInteractiveChange: fn(),
        }
      : {}),
  },
  argTypes: controlsArgTypes(framework),
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
  component: AddonsTestFlow,
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  play: runControlsSuite,
};
