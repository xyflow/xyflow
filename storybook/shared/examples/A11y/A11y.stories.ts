// Resolves to @storybook/react-vite or @storybook/svelte-vite.
import type { Meta, StoryObj } from '@storybook/framework';

// Resolves to Flow.tsx or Flow.svelte in this folder.
import A11yExample from 'A11y';
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
