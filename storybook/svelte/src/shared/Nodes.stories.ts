import Flow from 'storybook-shared-tests/Nodes/Flow.svelte';
import * as stories from 'storybook-shared-tests/Nodes/Nodes.stories.ts';

const meta = {
  ...stories.meta,
  title: 'Svelte Flow/Nodes',
  component: Flow,
};
export default meta;

export const Default = stories.Default;
