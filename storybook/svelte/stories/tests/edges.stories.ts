import type { Meta, StoryObj } from '@storybook/svelte-vite';

import { edgesGeneralSvelteConfig } from 'storybook-shared/flow-configs/edges-general';
import { createEdgesGeneralSuite } from 'storybook-shared/play-helpers';

import Flow from '../Flow.svelte';

const runSuite = createEdgesGeneralSuite('svelte');

const meta = {
  title: 'Generic Tests/Edges',
  component: Flow,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  args: { flowConfig: edgesGeneralSvelteConfig },
} satisfies Meta<typeof Flow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = { play: runSuite };
