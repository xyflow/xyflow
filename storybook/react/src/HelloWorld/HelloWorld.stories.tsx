import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelloWorld, AnimatedHelloWorld } from './HelloWorld';

const meta: Meta<typeof HelloWorld> = {
  title: 'React Flow/Hello World',
  component: HelloWorld,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithAnimatedEdge: Story = {
  render: () => <AnimatedHelloWorld />,
};
