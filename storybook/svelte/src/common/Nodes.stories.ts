import type { Meta } from '@storybook/svelte';
import Flow from 'common-storybook/Nodes/Flow.svelte';
import * as stories from 'common-storybook/Nodes/Nodes.stories.ts';

const meta: Meta = {
  ...stories.meta,
  title: 'Common/Nodes',
  component: Flow,
  parameters: {
    framework: 'svelte',
  },
};
export default meta;

export const SelectNodeByClick = stories.SelectNodeByClick;
export const SelectMultipleNodesWithShiftDrag = stories.SelectMultipleNodesWithShiftDrag;
