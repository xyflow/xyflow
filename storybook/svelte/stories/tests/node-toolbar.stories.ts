import type { Meta, StoryObj } from '@storybook/svelte-vite';

import { nodeToolbarSvelteConfig } from 'storybook-shared/flow-configs/node-toolbar-general';
import { createNodeToolbarGeneralSuite } from 'storybook-shared/play-helpers';

import ToolbarNode from '../../components/ToolbarNode.svelte';
import Flow from '../Flow.svelte';

const runSuite = createNodeToolbarGeneralSuite('svelte');
const nodeTypes = { ToolbarNode };

const meta = {
  title: 'Generic Tests/Node Toolbar',
  component: Flow,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  args: {
    flowConfig: nodeToolbarSvelteConfig,
    nodeTypes,
  },
} satisfies Meta<typeof Flow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = { play: runSuite };
