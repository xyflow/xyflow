import type { Meta, StoryObj } from '@storybook/react-vite';

import { paneGeneralConfig } from 'storybook-shared/flow-configs/pane-general';
import { paneNonDefaultsConfig } from 'storybook-shared/flow-configs/pane-non-defaults';
import { createPaneGeneralSuite, createPaneNonDefaultsSuite } from 'storybook-shared/play-helpers';

import { Flow } from '../Flow';

const runGeneralSuite = createPaneGeneralSuite('react');
const runNonDefaultsSuite = createPaneNonDefaultsSuite('react');

const meta = {
  title: 'Generic Tests/Pane',
  component: Flow,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Flow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const General: Story = {
  args: { flowConfig: paneGeneralConfig },
  play: runGeneralSuite,
};

export const NonDefaults: Story = {
  args: { flowConfig: paneNonDefaultsConfig },
  play: runNonDefaultsSuite,
};
