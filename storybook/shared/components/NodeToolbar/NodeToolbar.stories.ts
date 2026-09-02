// Resolves to @storybook/react-vite or @storybook/svelte-vite.
import type { Meta, StoryObj } from '@storybook/framework';

import { createNodeToolbarPlays } from '../../tests/node-toolbar';
import type { FlowFramework } from '../../types';

// Resolves to Flow.tsx or Flow.svelte in this folder.
import NodeToolbarExample from 'NodeToolbar';
import { defaultNodeToolbarArgs, nodeToolbarArgTypes } from './config';

declare const __STORYBOOK_FRAMEWORK__: FlowFramework;

const framework = __STORYBOOK_FRAMEWORK__;
const plays = createNodeToolbarPlays(framework);

const meta = {
  title: 'Components/NodeToolbar',
  component: NodeToolbarExample,
  tags: ['components', 'test'],
  parameters: {
    layout: 'fullscreen',
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
  play: plays.toolbarPositioned('top', 'center'),
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
  play: plays.toolbarPositioned('bottom', 'end'),
};

export const SelectToShow: Story = {
  args: {
    renderMode: 'inside-node',
    position: 'top',
    align: 'center',
  },
  play: plays.toolbarShowsOnSelect,
};
