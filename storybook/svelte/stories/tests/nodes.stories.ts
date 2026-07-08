import type { Meta, StoryObj } from '@storybook/svelte-vite';

import { nodesGeneralSvelteConfig } from 'storybook-shared/flow-configs/nodes-general';
import { createNodesGeneralSuite } from 'storybook-shared/play-helpers';

import DragHandleNode from '../../components/DragHandleNode.svelte';
import Flow from '../Flow.svelte';

const runSuite = createNodesGeneralSuite('svelte');
const nodeTypes = { DragHandleNode };

const meta = {
  title: 'Generic Tests/Nodes',
  component: Flow,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  args: {
    flowConfig: nodesGeneralSvelteConfig,
    nodeTypes,
  },
} satisfies Meta<typeof Flow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = { play: runSuite };
