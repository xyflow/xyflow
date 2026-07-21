import { expect, userEvent, waitFor } from 'storybook/test';

import type { FlowFramework, StoryPlayContext } from '../types';
import { runPlaySuite, type PlaySuiteCase } from './suite';
import { flowRootSelector, getQueryRoot, nodeSelector } from '../utils';

export function createPropsPlays(framework: FlowFramework) {
  const renderWithoutForcedThemeOnFlowWrapper = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(nodeSelector(framework))).toBeTruthy();
    });

    expect(getQueryRoot(canvasElement).querySelector(flowRootSelector(framework))).not.toHaveAttribute('data-theme');
  };

  const renderDarkPageThemeViaHtmlDataTheme = async ({ canvasElement }: StoryPlayContext) => {
    const doc = canvasElement.ownerDocument;

    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(nodeSelector(framework))).toBeTruthy();
    });

    const select = doc.querySelector('[data-testid="colormode-select"]')!;
    await userEvent.selectOptions(select, 'dark');

    expect(doc.documentElement).toHaveAttribute('data-theme', 'dark');
  };

  return {
    renderWithoutForcedThemeOnFlowWrapper,
    renderDarkPageThemeViaHtmlDataTheme,
  };
}

export function createPropsColorModeSuite(framework: FlowFramework) {
  const plays = createPropsPlays(framework);

  const cases: PlaySuiteCase[] = [
    { name: 'render without forced theme on the flow wrapper', run: plays.renderWithoutForcedThemeOnFlowWrapper },
    { name: 'render dark page theme via html data-theme', run: plays.renderDarkPageThemeViaHtmlDataTheme },
  ];

  return (context: StoryPlayContext) => runPlaySuite('Props / colorMode', cases, context);
}
