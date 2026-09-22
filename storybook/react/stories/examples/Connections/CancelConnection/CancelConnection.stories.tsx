import type { Meta, StoryObj } from '@storybook/react-vite';

import Example from './index';

const meta = {
  title: 'Examples/Connections/Cancel Connection',
  tags: ['example'],
  render: () => <Example />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
