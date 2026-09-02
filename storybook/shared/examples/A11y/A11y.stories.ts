import type { Meta, StoryObj } from '@storybook/framework';

import A11yExample from 'storybook-example-a11y-flow';
import { a11yArgTypes, defaultA11yArgs } from './config';

const meta = {
  title: 'Examples/A11y',
  component: A11yExample,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
  args: defaultA11yArgs,
  argTypes: a11yArgTypes,
} satisfies Meta<typeof A11yExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
