import type { StoryArgTypes } from '../../types';

export type BackgroundVariantName = 'dots' | 'lines' | 'cross';

export type SharedBackgroundArgs = {
  id?: string;
  variant?: BackgroundVariantName;
  gap?: number | [number, number];
  size?: number;
  lineWidth?: number;
  offset?: number | [number, number];
  bgColor?: string;
  color?: string;
  className?: string;
  patternClassName?: string;
  style?: Record<string, string | number>;
};

export const BACKGROUND_TEST_BG_COLOR = '#f8fafc';
export const BACKGROUND_TEST_PATTERN_COLOR = '#6366f1';

export const initialNodes = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 50, y: 50 },
  },
] as const;

export const defaultBackgroundArgs: SharedBackgroundArgs = {
  id: 'background',
  variant: 'dots',
  gap: 20,
  offset: 0,
  lineWidth: 1,
};

export function backgroundArgTypes(
  framework: 'react' | 'svelte',
  variantOptions: unknown[]
): StoryArgTypes {
  const base: StoryArgTypes = {
    id: { control: 'text', description: 'Unique id for the background pattern.' },
    color: { control: 'color', description: 'Color of the pattern.' },
    bgColor: { control: 'color', description: 'Color of the background.' },
    gap: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Gap between patterns. Can also be a [x, y] tuple.',
    },
    size: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Dot radius or cross size. Defaults to 1 for dots and 6 for cross.',
    },
    lineWidth: {
      control: { type: 'number', min: 0, step: 0.5 },
      description: 'Stroke thickness used when drawing the pattern.',
    },
    variant: {
      control: 'select',
      options: variantOptions,
      description: 'Variant of the pattern.',
    },
  };

  if (framework === 'react') {
    return {
      ...base,
      className: { control: 'text', description: 'Class applied to the container.' },
      patternClassName: { control: 'text', description: 'Class applied to the pattern.' },
      offset: { control: { type: 'number' }, description: 'Offset of the pattern. Can also be a [x, y] tuple.' },
      style: { control: 'object', description: 'Style applied to the container.' },
    };
  }

  return {
    ...base,
    class: { control: 'text', description: 'Class applied to the container.' },
    patternClass: { control: 'text', description: 'Class applied to the pattern.' },
  };
}
