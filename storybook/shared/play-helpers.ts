import { expect, waitFor } from 'storybook/test';

import type { FlowFramework } from './types';

export function paneSelector(framework: FlowFramework) {
  return `.${framework}-flow__pane`;
}

export function viewportSelector(framework: FlowFramework) {
  return `.${framework}-flow__viewport`;
}

export function edgeSelector(edgeId: string) {
  return `[data-id="${edgeId}"]`;
}

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
      expect(canvasElement.querySelector(edgeSelector(edgeId))).toBeInTheDocument();
    });
  }
}

export async function getViewportTransform(
  canvasElement: HTMLElement,
  framework: FlowFramework
): Promise<{ translateX: number; translateY: number; scale: number }> {
  const viewport = canvasElement.querySelector(viewportSelector(framework));

  if (!viewport) {
    throw new Error(`Could not find viewport for ${framework}`);
  }

  await waitFor(() => {
    expect(viewport).toBeInTheDocument();
  });

  const transform = window.getComputedStyle(viewport).transform;

  if (transform === 'none') {
    return { translateX: 0, translateY: 0, scale: 1 };
  }

  const matrix = transform.match(/matrix\(([^)]+)\)/);

  if (!matrix) {
    throw new Error(`Unexpected transform value: ${transform}`);
  }

  const values = matrix[1].split(',').map((value) => Number.parseFloat(value.trim()));

  return {
    scale: values[0],
    translateX: values[4],
    translateY: values[5],
  };
}

export async function assertPaneIsInteractive(canvasElement: HTMLElement, framework: FlowFramework) {
  const pane = canvasElement.querySelector(paneSelector(framework));

  await waitFor(() => {
    expect(pane).toBeInTheDocument();
  });
}
