import type { Meta, StoryObj } from '@storybook/react-vite';
import Basic from '@shared/examples/Basic/Flow';
const meta = {
  title: 'Examples/State & API/Controlled',
  component: Basic,
  tags: ['example'],
  args: { controlled: true },
} satisfies Meta<typeof Basic>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
