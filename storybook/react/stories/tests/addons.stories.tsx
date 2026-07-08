import type { Meta, StoryObj } from '@storybook/react-vite';

import { createControlsSuite, createMinimapSuite } from 'storybook-shared/play-helpers';

import { AddonsFlow } from '../../../components/AddonsFlowStory';

const runMinimapSuite = createMinimapSuite();
const runControlsSuite = createControlsSuite();

const meta = {
  title: 'Generic Tests/Addons',
  component: AddonsFlow,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AddonsFlow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Minimap: Story = { play: runMinimapSuite };
export const Controls: Story = { play: runControlsSuite };
