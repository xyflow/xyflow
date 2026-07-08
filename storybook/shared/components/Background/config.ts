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

export const BACKGROUND_STORY_TITLE = 'Components/Background';

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

export const backgroundArgTypeDescriptions = {
  id: 'Unique id for the background pattern.',
  color: 'Color of the pattern.',
  bgColor: 'Color of the background.',
  className: 'Class applied to the container.',
  patternClassName: 'Class applied to the pattern.',
  gap: 'Gap between patterns. Can also be a [x, y] tuple.',
  size: 'Dot radius or cross size. Defaults to 1 for dots and 6 for cross.',
  offset: 'Offset of the pattern. Can also be a [x, y] tuple.',
  lineWidth: 'Stroke thickness used when drawing the pattern.',
  variant: 'Variant of the pattern.',
  style: 'Style applied to the container.',
  class: 'Class applied to the container.',
  patternClass: 'Class applied to the pattern.',
} as const;

export type BackgroundPlayKey =
  | 'rendersBackground'
  | 'rendersDotsVariant'
  | 'rendersLinesVariant'
  | 'rendersCrossVariant'
  | 'appliesBgColor'
  | 'appliesPatternColor'
  | 'appliesOffset';

export type BackgroundStoryDefinition = {
  args?: SharedBackgroundArgs;
  play?: BackgroundPlayKey;
  test?: boolean;
  reactOnly?: boolean;
};

export const backgroundStoryDefinitions = {
  Default: {
    args: defaultBackgroundArgs,
    play: 'rendersBackground',
    test: true,
  },
  Lines: {
    args: { variant: 'lines', gap: 20, lineWidth: 1 },
    play: 'rendersLinesVariant',
    test: true,
  },
  Cross: {
    args: { variant: 'cross', gap: 30, size: 6 },
    play: 'rendersCrossVariant',
    test: true,
  },
  CustomColors: {
    args: {
      variant: 'dots',
      color: BACKGROUND_TEST_PATTERN_COLOR,
      bgColor: BACKGROUND_TEST_BG_COLOR,
      gap: 24,
      size: 2,
    },
    play: 'appliesPatternColor',
    test: true,
  },
  GapTuple: {
    args: { variant: 'lines', gap: [50, 25], lineWidth: 1 },
  },
  OffsetTuple: {
    args: { variant: 'lines', gap: 20, offset: [10, 5], color: '#94a3b8' },
    reactOnly: true,
  },
  AppliesBgColor: {
    args: { bgColor: BACKGROUND_TEST_BG_COLOR },
    play: 'appliesBgColor',
    test: true,
  },
  AppliesOffset: {
    args: { variant: 'lines', offset: 10 },
    play: 'appliesOffset',
    test: true,
    reactOnly: true,
  },
} satisfies Record<string, BackgroundStoryDefinition>;

export type BackgroundStoryName = keyof typeof backgroundStoryDefinitions;

export function storyArgs(name: BackgroundStoryName) {
  return { ...defaultBackgroundArgs, ...backgroundStoryDefinitions[name].args };
}

export function storyTags(definition: BackgroundStoryDefinition) {
  return definition.test ? (['components', 'test'] as const) : (['components'] as const);
}
