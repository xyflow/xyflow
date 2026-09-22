import type { Meta, StoryObj } from '@storybook/framework';
import Example from 'AddNodeOnEdgeDrop';
const meta = {
  title: 'Examples/Connections/Add Node On Edge Drop',
  component: Example,
  tags: ['example'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Example>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
