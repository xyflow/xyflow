import type { Meta, StoryObj } from '@storybook/react-vite';
import Interaction from './index';
import { exampleStoryParameters } from '../../exampleStory';

const meta = {
  title: 'Examples/Interaction/Interaction',
  component: Interaction,
  tags: ['example'],
  parameters: exampleStoryParameters,
} satisfies Meta<typeof Interaction>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
