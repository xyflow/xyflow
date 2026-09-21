import type { Meta, StoryObj } from '@storybook/react-vite';
import Flow from '../Flow';
import flowConfig from './reconnect';

const meta = {
  title: 'Generic Tests/Edges/reconnect',
  parameters: { layout: 'fullscreen' },
  render: () => <Flow flowConfig={flowConfig} />,
} satisfies Meta;

export default meta;
export const Default: StoryObj<typeof meta> = {};
