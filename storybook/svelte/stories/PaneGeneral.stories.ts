import type { Meta, StoryObj } from '@storybook/svelte-vite';

import { paneGeneralConfig } from 'storybook-shared/flow-configs/pane-general';
import { assertEdgesRendered, assertNodeLabels, assertPaneIsInteractive } from 'storybook-shared/play-helpers';

import FlowStory from './FlowStory.svelte';

const meta = {
  title: 'Generic Tests/Pane/General',
  component: FlowStory,
  tags: ['test'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    flowConfig: paneGeneralConfig,
  },
} satisfies Meta<typeof FlowStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await assertPaneIsInteractive(canvasElement, 'svelte');
    await assertNodeLabels(canvasElement, ['1', '2', '3']);
    await assertEdgesRendered(canvasElement, ['first-edge', 'second-edge']);
  },
};
