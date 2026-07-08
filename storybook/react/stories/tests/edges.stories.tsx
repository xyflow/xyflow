import type { Meta, StoryObj } from '@storybook/react-vite';

import { edgesGeneralReactConfig } from 'storybook-shared/flow-configs/edges-general';
import { createEdgesGeneralSuite } from 'storybook-shared/play-helpers';

import { Flow } from '../Flow';

const runSuite = createEdgesGeneralSuite('react');

const meta = {
  title: 'Generic Tests/Edges',
  component: Flow,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  args: { flowConfig: edgesGeneralReactConfig },
} satisfies Meta<typeof Flow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = { play: runSuite };
