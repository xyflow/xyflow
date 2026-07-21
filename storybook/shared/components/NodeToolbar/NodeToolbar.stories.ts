import type { Meta, StoryObj } from '@storybook/framework';

import { createNodeToolbarGeneralSuite } from '../../tests/node-toolbar';
import type { FlowFramework } from '../../types';

import NodeToolbarExample from 'storybook-component-nodetoolbar-flow';
import NodeToolbarTestFlow from 'storybook-component-nodetoolbar-test-flow';
import { apiDocsUrl, defaultNodeToolbarArgs, nodeToolbarArgTypes } from './config';

declare const __STORYBOOK_FRAMEWORK__: FlowFramework;

const framework = __STORYBOOK_FRAMEWORK__;
const runNodeToolbarSuite = createNodeToolbarGeneralSuite(framework);

const testStoryParameters = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};

const meta = {
  title: 'Components/NodeToolbar',
  component: NodeToolbarExample,
  tags: ['components'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Interactive playground for [\`<NodeToolbar />\`](${apiDocsUrl(framework)}). Use controls to tweak props on a demo node. The General story runs automated regression tests in CI.`,
      },
    },
  },
  args: defaultNodeToolbarArgs,
  argTypes: nodeToolbarArgTypes,
} satisfies Meta<typeof NodeToolbarExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isVisible: true,
  },
};

export const ExternalToolbar: Story = {
  args: {
    renderMode: 'external',
    nodeId: 'demo-node',
    isVisible: true,
    position: 'bottom',
    align: 'end',
    offset: 16,
  },
};

export const SelectToShow: Story = {
  args: {
    renderMode: 'inside-node',
    position: 'top',
    align: 'center',
  },
};

export const General: Story = {
  component: NodeToolbarTestFlow,
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  play: runNodeToolbarSuite,
};
