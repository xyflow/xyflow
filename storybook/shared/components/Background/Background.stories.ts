import type { Meta, StoryObj } from '@storybook/framework';

import { BackgroundVariant } from '@xyflow/storybook';

import { createBackgroundPlays } from '../../tests/background';
import type { FlowFramework } from '../../types';

import BackgroundExample from 'storybook-component-background-flow';
import {
  BACKGROUND_TEST_BG_COLOR,
  BACKGROUND_TEST_PATTERN_COLOR,
  backgroundArgTypes,
  defaultBackgroundArgs,
} from './config';

declare const __STORYBOOK_FRAMEWORK__: FlowFramework;

const framework = __STORYBOOK_FRAMEWORK__;
const plays = createBackgroundPlays(framework);

const meta = {
  title: 'Components/Background',
  component: BackgroundExample,
  tags: ['components', 'test'],
  parameters: { layout: 'fullscreen' },
  args: defaultBackgroundArgs,
  argTypes: backgroundArgTypes(framework, Object.values(BackgroundVariant)),
} satisfies Meta<typeof BackgroundExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: plays.rendersBackground,
};

export const Lines: Story = {
  args: { variant: 'lines', gap: 20, lineWidth: 1 },
  play: plays.rendersLinesVariant,
};

export const Cross: Story = {
  args: { variant: 'cross', gap: 30, size: 6 },
  play: plays.rendersCrossVariant,
};

export const CustomColors: Story = {
  args: {
    variant: 'dots',
    color: BACKGROUND_TEST_PATTERN_COLOR,
    bgColor: BACKGROUND_TEST_BG_COLOR,
    gap: 24,
    size: 2,
  },
  play: plays.appliesPatternColor,
};

export const GapTuple: Story = {
  args: { variant: 'lines', gap: [50, 25], lineWidth: 1 },
};

export const AppliesBgColor: Story = {
  args: { bgColor: BACKGROUND_TEST_BG_COLOR },
  play: plays.appliesBgColor,
};

export const OffsetTuple: Story = {
  args: { variant: 'lines', gap: 20, offset: [10, 5], color: '#94a3b8' },
};

// Svelte's Background has no offset prop, so the assertion only runs for React.
export const AppliesOffset: Story = {
  args: { variant: 'lines', offset: 10 },
  play: framework === 'react' ? plays.appliesOffset : undefined,
};
