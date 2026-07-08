import type { Meta, StoryObj } from '@storybook/react-vite';

import { BackgroundVariant } from '@xyflow/react';

import { createBackgroundPlays } from '../../play-helpers/background';

import { BackgroundExample } from './Flow';
import {
  backgroundArgTypeDescriptions,
  backgroundStoryDefinitions,
  defaultBackgroundArgs,
  storyArgs,
  type BackgroundStoryName,
} from './config';

const componentStoryParameters = { layout: 'fullscreen' as const };

const plays = createBackgroundPlays('react');

const meta = {
  title: 'Components/Background',
  component: BackgroundExample,
  tags: ['components', 'test'],
  parameters: componentStoryParameters,
  args: defaultBackgroundArgs,
  argTypes: {
    id: { control: 'text', description: backgroundArgTypeDescriptions.id },
    color: { control: 'color', description: backgroundArgTypeDescriptions.color },
    bgColor: { control: 'color', description: backgroundArgTypeDescriptions.bgColor },
    className: { control: 'text', description: backgroundArgTypeDescriptions.className },
    patternClassName: { control: 'text', description: backgroundArgTypeDescriptions.patternClassName },
    gap: { control: { type: 'number', min: 0, step: 1 }, description: backgroundArgTypeDescriptions.gap },
    size: { control: { type: 'number', min: 0, step: 1 }, description: backgroundArgTypeDescriptions.size },
    offset: { control: { type: 'number' }, description: backgroundArgTypeDescriptions.offset },
    lineWidth: { control: { type: 'number', min: 0, step: 0.5 }, description: backgroundArgTypeDescriptions.lineWidth },
    variant: {
      control: 'select',
      options: Object.values(BackgroundVariant),
      description: backgroundArgTypeDescriptions.variant,
    },
    style: { control: 'object', description: backgroundArgTypeDescriptions.style },
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

export const OffsetTuple: Story = story('OffsetTuple');

export const AppliesBgColor: Story = story('AppliesBgColor');

export const AppliesOffset: Story = story('AppliesOffset');
