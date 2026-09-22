import type { Meta, StoryObj } from '@storybook/react-vite';
import Flow from '../Flow';
import flowConfig from './activation-keys';

const meta = {
  title: 'Generic Tests/Pane/activation-keys',
  parameters: { layout: 'fullscreen' },
  render: () => <Flow flowConfig={flowConfig} />,
} satisfies Meta;

export default meta;
export const Default: StoryObj<typeof meta> = {};
