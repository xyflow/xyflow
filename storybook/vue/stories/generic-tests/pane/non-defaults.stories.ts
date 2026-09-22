import { createPaneNonDefaultsSuite } from 'storybook-shared/tests';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Flow from '../Flow.vue';
import flowConfig from './non-defaults';

const meta = {
  tags: ['test'],
  title: 'Generic Tests/Pane/Non Defaults',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { Flow },
    setup: () => ({ flowConfig }),
    template: '<Flow :flow-config="flowConfig" />',
  }),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { play: createPaneNonDefaultsSuite('vue') };
