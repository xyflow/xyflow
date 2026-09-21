import type { Meta, StoryObj } from '@storybook/react-vite';
import Example from './index';

const meta = {
  title: 'Examples/State & API/Remount',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Example>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
