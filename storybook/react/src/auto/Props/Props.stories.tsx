import Flow from 'storybook-shared-tests/Props/Flow';
import * as stories from 'storybook-shared-tests/Props/Props.stories';

const meta = {
  ...stories.meta,
  title: 'React Flow/Props',
  component: Flow,
};
export default meta;

export const HighNodeDragThreshold = stories.HighNodeDragThreshold;
export const PanOnScroll = stories.PanOnScroll;
