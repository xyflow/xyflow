import type { Meta, StoryObj } from '@storybook/react-vite';

import { createPropsColorModeSuite } from 'storybook-shared/play-helpers';

import { ColorModeStory } from '../../components/ColorModeStory';

const runSuite = createPropsColorModeSuite('react');

const meta = {
  title: 'Generic Tests/Props',
  component: ColorModeStory,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColorModeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorMode: Story = { play: runSuite };
