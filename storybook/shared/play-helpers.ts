import { expect, waitFor } from 'storybook/test';

import type { FlowFramework } from './types';
import { dataIdSelector, getTransform, paneSelector, viewportSelector } from './utils';

export async function assertNodeLabels(canvasElement: HTMLElement, labels: string[]) {
  for (const label of labels) {
    await waitFor(() => {
      expect(canvasElement.textContent).toContain(label);
    });
  }
}

export async function assertEdgesRendered(canvasElement: HTMLElement, edgeIds: string[]) {
  for (const edgeId of edgeIds) {
    await waitFor(() => {
      expect(canvasElement.querySelector(dataIdSelector(edgeId))).toBeInTheDocument();
    });
  }
}

export async function assertPaneIsInteractive(canvasElement: HTMLElement, framework: FlowFramework) {
  const pane = canvasElement.querySelector(paneSelector(framework));

  await waitFor(() => {
    expect(pane).toBeInTheDocument();
  });
}

export async function getViewportTransform(canvasElement: HTMLElement, framework: FlowFramework) {
  return getTransform(canvasElement, viewportSelector(framework));
}

export * from './play-helpers/index';
