import type { Meta, StoryObj } from '@storybook/react-vite';
import BackgroundExample from './Background';
import { BackgroundVariant } from '@xyflow/react';

const meta: Meta<typeof BackgroundExample> = {
  title: 'React Flow/Components/Background',
  component: BackgroundExample,
  parameters: { renderer: 'react', docs: { description: { component: 'See also: Types/BackgroundVariant' } } },
  args: { variant: BackgroundVariant.Lines },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Lines: Story = { args: { variant: BackgroundVariant.Lines } };
export const Dots: Story = { args: { variant: BackgroundVariant.Dots } };
export const Cross: Story = { args: { variant: BackgroundVariant.Cross } };
