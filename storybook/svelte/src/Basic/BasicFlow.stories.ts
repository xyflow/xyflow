import type { Meta, StoryObj } from '@storybook/svelte-vite';
import BasicFlow from './BasicFlow.svelte';
import { sharedArgTypes, defaultStoryArgs, runBasicRenderingTests } from '../../../shared/basic/basic-stories';

const meta: Meta<BasicFlow> = {
  title: 'Svelte Flow/Basic',
  component: BasicFlow,
  argTypes: sharedArgTypes,
} satisfies Meta<BasicFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicStory: Story = {
  args: defaultStoryArgs,
};

export const BasicRendering: Story = {
  args: defaultStoryArgs,
  play: async ({ canvasElement, step }: { canvasElement: any; step: any }) => {
    const { expect } = await import('@storybook/test');

    // Run all basic rendering tests for Svelte
    await runBasicRenderingTests('Svelte', { canvasElement, step, expect });
  },
};
