import Flow from 'storybook-shared-tests/Props/Flow.svelte';
import * as stories from 'storybook-shared-tests/Props/Props.stories.ts';

const meta = {
  ...stories.meta,
  title: 'Svelte Flow/Props',
  component: Flow,
};
export default meta;

export const HighNodeDragThreshold = stories.HighNodeDragThreshold;
export const NoNodeDragThreshold = stories.NoNodeDragThreshold;
export const PanOnScroll = stories.PanOnScroll;
export const Default = stories.Default;
