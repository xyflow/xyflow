import type { Meta, StoryObj } from '@storybook/react-vite';
import CommonProps from './CommonProps';
import { exampleAriaLabelConfig } from '../Types/ariaLabelConfig';
import { getReactCommonArgs } from 'storybook-shared/common';

const meta: Meta<typeof CommonProps> = {
  title: 'React Flow/ReactFlow/Common Props',
  component: CommonProps,
  parameters: { renderer: 'react' },
  args: getReactCommonArgs({
    ariaLabelConfig: exampleAriaLabelConfig,
  }),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
