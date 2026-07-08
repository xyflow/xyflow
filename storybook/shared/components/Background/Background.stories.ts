import type { Meta, StoryObj } from '@storybook/svelte-vite';

import { BackgroundVariant } from '@xyflow/svelte';

import { createBackgroundPlays } from '../../play-helpers/background';

import {
  backgroundArgTypeDescriptions,
  backgroundStoryDefinitions,
  storyArgs,
  type BackgroundStoryName,
} from './config';
import BackgroundExample from './Flow.svelte';

const componentStoryParameters = { layout: 'fullscreen' as const };

const plays = createBackgroundPlays('svelte');

const meta = {
  title: 'Components/Background',
  component: BackgroundExample,
  tags: ['components', 'test'],
  parameters: componentStoryParameters,
  args: storyArgs('Default'),
  argTypes: {
    id: { control: 'text', description: backgroundArgTypeDescriptions.id },
    color: { control: 'color', description: backgroundArgTypeDescriptions.color },
    bgColor: { control: 'color', description: backgroundArgTypeDescriptions.bgColor },
    class: { control: 'text', description: backgroundArgTypeDescriptions.class },
    patternClass: { control: 'text', description: backgroundArgTypeDescriptions.patternClass },
    gap: { control: { type: 'number', min: 0, step: 1 }, description: backgroundArgTypeDescriptions.gap },
    size: { control: { type: 'number', min: 0, step: 1 }, description: backgroundArgTypeDescriptions.size },
    lineWidth: { control: { type: 'number', min: 0, step: 0.5 }, description: backgroundArgTypeDescriptions.lineWidth },
    variant: {
      control: 'select',
      options: Object.values(BackgroundVariant),
      description: backgroundArgTypeDescriptions.variant,
    },
  },
} satisfies Meta<typeof BackgroundExample>;

export default meta;

type Story = StoryObj<typeof meta>;

function story(name: BackgroundStoryName): Story {
  const definition = backgroundStoryDefinitions[name];
  const playKey = definition.play;
  const play = playKey ? plays[playKey as keyof typeof plays] : undefined;

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
