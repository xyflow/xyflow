// storybook/react/src/Basic/Basic.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import Basic from './Basic';
import { sharedArgTypes, defaultStoryArgs, runBasicRenderingTests } from 'storybook-shared';

const meta: Meta<typeof Basic> = {
  title: 'React Flow/Basic',
  component: Basic,
  argTypes: sharedArgTypes,
} satisfies Meta<typeof Basic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicStory: Story = {
  args: defaultStoryArgs,
};

export const BasicRendering: Story = {
  args: defaultStoryArgs,
  play: async ({ canvasElement, step }: { canvasElement: any; step: any }) => {
    // Run all basic rendering tests for React
    await runBasicRenderingTests('React', { canvasElement, step });
  },
};
