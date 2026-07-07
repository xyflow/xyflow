import type { Meta, StoryObj } from '@storybook/react-vite';

import { nodesGeneralReactConfig } from 'storybook-shared/flow-configs/nodes-general';
import { createNodesGeneralSuite } from 'storybook-shared/play-helpers';

import DragHandleNode from '../../components/DragHandleNode';
import { FlowStory } from '../FlowStory';

const runSuite = createNodesGeneralSuite('react');
const nodeTypes = { DragHandleNode };

const meta = {
  title: 'Generic Tests/Nodes',
  component: FlowStory,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  args: {
    flowConfig: nodesGeneralReactConfig,
    nodeTypes,
  },
} satisfies Meta<typeof FlowStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = { play: runSuite };
