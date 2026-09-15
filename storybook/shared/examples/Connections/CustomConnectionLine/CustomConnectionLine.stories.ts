import type { Meta, StoryObj } from '@storybook/framework';
import Example from 'CustomConnectionLine';
const meta = {
  title: 'Examples/Connections/Custom Connection Line',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Example>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
