import type { Meta, StoryObj } from '@storybook/svelte-vite';

import { createPropsColorModeSuite } from 'storybook-shared/play-helpers';

import ColorModeStory from '../../components/ColorModeStory.svelte';

const runSuite = createPropsColorModeSuite('svelte');

const meta = {
  title: 'Generic Tests/Props',
  component: ColorModeStory,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColorModeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorMode: Story = { play: runSuite };
