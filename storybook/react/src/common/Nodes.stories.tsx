import type { Meta } from '@storybook/react';
import Flow from 'common-storybook/Nodes/Flow.tsx';
import * as stories from 'common-storybook/Nodes/Nodes.stories.ts';

const meta: Meta = {
  ...stories.meta,
  title: 'Common/Nodes',
  component: Flow,
  parameters: {
    framework: 'react',
  },
};
export default meta;

export const Default = stories.Default;
