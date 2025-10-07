import Flow from 'common-storybook/Props/Flow.svelte';
import * as stories from 'common-storybook/Props/Props.stories.ts';

const meta = {
  ...stories.meta,
  title: 'Common/Props',
  component: Flow,
};
export default meta;

export const HighNodeDragThreshold = stories.HighNodeDragThreshold;
export const NoNodeDragThreshold = stories.NoNodeDragThreshold;
export const PanOnScroll = stories.PanOnScroll;
export const Default = stories.Default;
