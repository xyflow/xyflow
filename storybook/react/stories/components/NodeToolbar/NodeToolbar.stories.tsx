import type { Meta, StoryObj } from '@storybook/react-vite';

import { nodeToolbarReactConfig } from 'storybook-shared/flow-configs/node-toolbar-general';
import { createNodeToolbarGeneralSuite } from 'storybook-shared/play-helpers';

import ToolbarNode from '../../../components/ToolbarNode';
import { Flow } from '../../Flow';
import { exampleStoryParameters } from '../../examples/exampleStory';

import { NodeToolbarExample } from './Flow';
import { API_DOCS_URL, defaultNodeToolbarArgs, nodeToolbarArgTypes } from './config';

const runNodeToolbarSuite = createNodeToolbarGeneralSuite('react');
const nodeTypes = { ToolbarNode };

const testStoryParameters = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};

const meta = {
  title: 'Components/NodeToolbar',
  component: NodeToolbarExample,
  tags: ['components'],
  parameters: {
    ...exampleStoryParameters,
    docs: {
      description: {
        component: `Interactive playground for [\`<NodeToolbar />\`](${API_DOCS_URL}). Use controls to tweak props on a demo node. The General story runs automated regression tests in CI.`,
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
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  render: () => <Flow flowConfig={nodeToolbarReactConfig} nodeTypes={nodeTypes} />,
  play: runNodeToolbarSuite,
};
