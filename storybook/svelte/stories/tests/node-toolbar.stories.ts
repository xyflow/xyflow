import type { Meta, StoryObj } from '@storybook/svelte-vite';

import { nodeToolbarSvelteConfig } from 'storybook-shared/flow-configs/node-toolbar-general';
import { createNodeToolbarGeneralSuite } from 'storybook-shared/play-helpers';

import ToolbarNode from '../../components/ToolbarNode.svelte';
import FlowStory from '../FlowStory.svelte';

const runSuite = createNodeToolbarGeneralSuite('svelte');
const nodeTypes = { ToolbarNode };

const meta = {
  title: 'Generic Tests/Node Toolbar',
  component: FlowStory,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  args: {
    flowConfig: nodeToolbarSvelteConfig,
    nodeTypes,
  },
} satisfies Meta<typeof FlowStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = { play: runSuite };
