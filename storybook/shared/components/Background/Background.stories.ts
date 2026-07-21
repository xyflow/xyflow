import type { Meta, StoryObj } from '@storybook/framework';

import { BackgroundVariant } from '@xyflow/storybook';

import { createBackgroundPlays } from '../../tests/background';
import type { FlowFramework } from '../../types';

import BackgroundExample from 'storybook-component-background-flow';
import {
  backgroundArgTypes,
  backgroundStoryDefinitions,
  defaultBackgroundArgs,
  storyArgs,
  type BackgroundStoryName,
} from './config';

declare const __STORYBOOK_FRAMEWORK__: FlowFramework;

const framework = __STORYBOOK_FRAMEWORK__;
const plays = createBackgroundPlays(framework);

const componentStoryParameters = { layout: 'fullscreen' as const };

const meta = {
  title: 'Components/Background',
  component: BackgroundExample,
  tags: ['components', 'test'],
  parameters: componentStoryParameters,
  args: defaultBackgroundArgs,
  argTypes: backgroundArgTypes(framework, Object.values(BackgroundVariant)),
} satisfies Meta<typeof BackgroundExample>;

export default meta;

type Story = StoryObj<typeof meta>;

function story(name: BackgroundStoryName): Story {
  const definition = backgroundStoryDefinitions[name];
  const playKey = definition.play;
  const play =
    playKey && !(framework === 'svelte' && definition.reactOnly) ? plays[playKey as keyof typeof plays] : undefined;

  return {
    ...(definition.args ? { args: storyArgs(name) } : {}),
    tags: definition.test ? ['components', 'test'] : ['components'],
    ...(play ? { play } : {}),
  };
}

export const Default: Story = story('Default');
export const Lines: Story = story('Lines');
export const Cross: Story = story('Cross');
export const CustomColors: Story = story('CustomColors');
export const GapTuple: Story = story('GapTuple');
export const AppliesBgColor: Story = story('AppliesBgColor');
export const OffsetTuple: Story = story('OffsetTuple');
export const AppliesOffset: Story = story('AppliesOffset');
