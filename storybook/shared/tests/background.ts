import { expect, waitFor } from 'storybook/test';

import {
  BACKGROUND_TEST_BG_COLOR,
  BACKGROUND_TEST_PATTERN_COLOR,
} from '../components/Background/config';

import type { FlowFramework, StoryPlayContext } from '../types';
import { backgroundSelector, flowClass, getClassName, getQueryRoot } from '../utils';

function getBackground(canvasElement: HTMLElement, framework: FlowFramework) {
  return getQueryRoot(canvasElement).querySelector(backgroundSelector(framework));
}

export function createBackgroundPlays(framework: FlowFramework) {
  const patternClass = flowClass(framework, 'background-pattern');

  const rendersBackground = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      expect(getBackground(canvasElement, framework)).toBeInTheDocument();
    });
  };

  const rendersDotsVariant = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      const background = getBackground(canvasElement, framework);
      expect(background?.querySelector('circle')).toBeInTheDocument();
      expect(background?.querySelector(`${patternClass}.dots`)).toBeInTheDocument();
    });
  };

  const rendersLinesVariant = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      const background = getBackground(canvasElement, framework);
      const path = background?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(getClassName(path!)).toMatch(/lines/);
    });
  };

  const rendersCrossVariant = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      const background = getBackground(canvasElement, framework);
      const path = background?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(getClassName(path!)).toMatch(/cross/);
    });
  };

  const appliesBgColor = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      const background = getBackground(canvasElement, framework) as HTMLElement | null;
      expect(background?.style.getPropertyValue('--xy-background-color-props')).toBe(BACKGROUND_TEST_BG_COLOR);
    });
  };

  const appliesPatternColor = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      const background = getBackground(canvasElement, framework) as HTMLElement | null;
      expect(background?.style.getPropertyValue('--xy-background-pattern-color-props')).toBe(
        BACKGROUND_TEST_PATTERN_COLOR
      );
    });
  };

  const appliesOffset = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      const pattern = getBackground(canvasElement, framework)?.querySelector('pattern');
      expect(pattern?.getAttribute('patternTransform')).toMatch(/translate\(-[\d.]+,-[\d.]+\)/);
    });
  };

  return {
    rendersBackground,
    rendersDotsVariant,
    rendersLinesVariant,
    rendersCrossVariant,
    appliesBgColor,
    appliesPatternColor,
    ...(framework === 'react' ? { appliesOffset } : {}),
  };
}

export type BackgroundPlays = ReturnType<typeof createBackgroundPlays>;

export { BACKGROUND_TEST_BG_COLOR, BACKGROUND_TEST_PATTERN_COLOR };
