import type { Meta, StoryObj } from '@storybook/react-vite';

import { BackgroundVariant } from '@xyflow/react';

import { BackgroundExample, BackgroundShowcase } from './index';
import { exampleStoryParameters } from '../../examples/exampleStory';

const meta = {
  title: 'Components/Background',
  component: BackgroundExample,
  tags: ['components'],
  parameters: exampleStoryParameters,
  args: {
    id: 'background',
    variant: BackgroundVariant.Dots,
    gap: 20,
    offset: 0,
    lineWidth: 1,
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'When multiple backgrounds are present, each one should have a unique id.',
    },
    color: {
      control: 'color',
      description: 'Color of the pattern.',
    },
    bgColor: {
      control: 'color',
      description: 'Color of the background.',
    },
    className: {
      control: 'text',
      description: 'Class applied to the container.',
    },
    patternClassName: {
      control: 'text',
      description: 'Class applied to the pattern.',
    },
    gap: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Gap between patterns. Can also be a [x, y] tuple.',
    },
    size: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Dot radius or cross size. Defaults to 1 for dots and 6 for cross.',
    },
    offset: {
      control: { type: 'number' },
      description: 'Offset of the pattern. Can also be a [x, y] tuple.',
    },
    lineWidth: {
      control: { type: 'number', min: 0, step: 0.5 },
      description: 'Stroke thickness used when drawing the pattern.',
    },
    variant: {
      control: 'select',
      options: Object.values(BackgroundVariant),
      description: 'Variant of the pattern.',
    },
    style: {
      control: 'object',
      description: 'Style applied to the container.',
    },
  },
} satisfies Meta<typeof BackgroundExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Lines: Story = {
  args: {
    variant: BackgroundVariant.Lines,
    gap: 20,
    lineWidth: 1,
  },
};

export const Cross: Story = {
  args: {
    variant: BackgroundVariant.Cross,
    gap: 30,
    size: 6,
  },
};

export const CustomColors: Story = {
  args: {
    variant: BackgroundVariant.Dots,
    color: '#6366f1',
    bgColor: '#f8fafc',
    gap: 24,
    size: 2,
  },
};

export const GapTuple: Story = {
  args: {
    variant: BackgroundVariant.Lines,
    gap: [50, 25],
    lineWidth: 1,
  },
};

export const OffsetTuple: Story = {
  args: {
    variant: BackgroundVariant.Lines,
    gap: 20,
    offset: [10, 5],
    color: '#94a3b8',
  },
};
