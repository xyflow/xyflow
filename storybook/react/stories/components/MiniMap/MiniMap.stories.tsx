import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { createMinimapSuite } from 'storybook-shared/play-helpers';

import { AddonsFlow } from '../../../components/AddonsFlowStory';
import { exampleStoryParameters } from '../../examples/exampleStory';

import { MiniMapExample } from './Flow';
import { API_DOCS_URL, defaultMiniMapArgs, miniMapArgTypes } from './config';

const runMinimapSuite = createMinimapSuite();

const testStoryParameters = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};

const meta = {
  title: 'Components/MiniMap',
  component: MiniMapExample,
  tags: ['components'],
  parameters: {
    ...exampleStoryParameters,
    docs: {
      description: {
        component: `Interactive playground for [\`<MiniMap />\`](${API_DOCS_URL}). Use controls to tweak props. The General story runs automated regression tests in CI.`,
      },
    },
  },
  args: {
    ...defaultMiniMapArgs,
    onClick: fn(),
    onNodeClick: fn(),
  },
  argTypes: miniMapArgTypes,
} satisfies Meta<typeof MiniMapExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  args: {
    pannable: true,
    zoomable: true,
  },
};

export const CustomColors: Story = {
  args: {
    nodeColor: '#6366f1',
    nodeStrokeColor: '#312e81',
    bgColor: '#f8fafc',
    maskColor: 'rgba(99, 102, 241, 0.15)',
    maskStrokeColor: '#6366f1',
    maskStrokeWidth: 2,
  },
};

export const General: Story = {
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  render: () => <AddonsFlow />,
  play: runMinimapSuite,
};
