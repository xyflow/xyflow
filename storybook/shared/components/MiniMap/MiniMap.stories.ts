import type { Meta, StoryObj } from '@storybook/framework';
import { fn } from 'storybook/test';

import { createMinimapSuite } from '../../tests/addons';
import type { FlowFramework } from '../../types';

import MiniMapExample from 'storybook-component-minimap-flow';
import { defaultMiniMapArgs, miniMapArgTypes } from './config';

declare const __STORYBOOK_FRAMEWORK__: FlowFramework;

const framework = __STORYBOOK_FRAMEWORK__;
const runMinimapSuite = createMinimapSuite(framework);

const testStoryParameters = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};

const meta = {
  title: 'Components/MiniMap',
  component: MiniMapExample,
  tags: ['components'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    ...defaultMiniMapArgs,
    ...(framework === 'react' ? { offsetScale: 5, onClick: fn(), onNodeClick: fn() } : {}),
  },
  argTypes: miniMapArgTypes(framework),
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
  play: runMinimapSuite,
};
