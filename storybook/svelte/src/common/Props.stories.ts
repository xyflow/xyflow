import type { Meta } from '@storybook/svelte';
import Flow from 'common-storybook/Props/Flow.svelte';
import * as stories from 'common-storybook/Props/Props.stories.ts';

const meta: Meta = {
  ...stories.meta,
  title: 'Common/Props',
  component: Flow,
  parameters: {
    framework: 'svelte',
  },
};
export default meta;

export const HighNodeDragThreshold = stories.HighNodeDragThreshold;
export const NoNodeDragThreshold = stories.NoNodeDragThreshold;
export const PanOnScroll = stories.PanOnScroll;
export const Default = stories.Default;
