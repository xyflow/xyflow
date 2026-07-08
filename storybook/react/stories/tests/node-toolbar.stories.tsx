import type { Meta, StoryObj } from '@storybook/react-vite';

import { nodeToolbarReactConfig } from 'storybook-shared/flow-configs/node-toolbar-general';
import { createNodeToolbarGeneralSuite } from 'storybook-shared/play-helpers';

import ToolbarNode from '../../components/ToolbarNode';
import { Flow } from '../Flow';

const runSuite = createNodeToolbarGeneralSuite('react');
const nodeTypes = { ToolbarNode };

const meta = {
  title: 'Generic Tests/Node Toolbar',
  component: Flow,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  args: {
    flowConfig: nodeToolbarReactConfig,
    nodeTypes,
  },
} satisfies Meta<typeof Flow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = { play: runSuite };
