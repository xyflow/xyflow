import { expect, waitFor } from 'storybook/test';

import type { FlowFramework, StoryPlayContext } from '../types';
import { runPlaySuite, type PlaySuiteCase } from './suite';
import {
  dataIdSelector,
  dispatchMouse,
  dragWithSteps,
  getCenter,
  getQueryRoot,
  getTransform,
  paneSelector,
  pointerDrag,
  queryNode,
  sleep,
  viewportSelector,
  wheel,
} from '../utils';

export async function waitForEdges(canvasElement: HTMLElement, edgeIds: string[]) {
  for (const edgeId of edgeIds) {
    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(dataIdSelector(edgeId))).toBeInTheDocument();
    });
  }
}

export function createPanePlays(framework: FlowFramework) {
  const waitForDefaultEdges = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['first-edge', 'second-edge']);
  };

  const panMovesPane = async ({ canvasElement }: StoryPlayContext) => {
    await waitForDefaultEdges({ canvasElement });
    const pane = getQueryRoot(canvasElement).querySelector(paneSelector(framework))!;
    const transformsBefore = getTransform(canvasElement, viewportSelector(framework));
    const movementPx = 100;
    const center = pane.getBoundingClientRect();

    await pointerDrag(pane, [{ x: center.x + center.width * 0.5 + movementPx, y: center.y + center.height * 0.5 + movementPx }]);
    await sleep(200);

    const transformsAfter = getTransform(canvasElement, viewportSelector(framework));

    expect(Math.abs(transformsAfter.translateX - transformsBefore.translateX)).toBeGreaterThan(10);
    expect(Math.abs(transformsAfter.translateY - transformsBefore.translateY)).toBeGreaterThan(10);
  };

  const scrollZoomsPane = async ({ canvasElement }: StoryPlayContext) => {
    await waitForDefaultEdges({ canvasElement });
    const pane = getQueryRoot(canvasElement).querySelector(paneSelector(framework))!;
    let transformsBefore = getTransform(canvasElement, viewportSelector(framework));

    if (transformsBefore.scale <= 0.26) {
      wheel(pane, 0, -100);
      await sleep(100);
      transformsBefore = getTransform(canvasElement, viewportSelector(framework));
    }

    wheel(pane, 0, 100);
    await sleep(100);

    const transformsAfter = getTransform(canvasElement, viewportSelector(framework));
    expect(transformsAfter.scale).not.toBe(transformsBefore.scale);
  };

  const minZoom = async ({ canvasElement }: StoryPlayContext) => {
    await waitForDefaultEdges({ canvasElement });
    const pane = getQueryRoot(canvasElement).querySelector(paneSelector(framework))!;

    wheel(pane, 5000, 5000);
    await sleep(100);

    expect(getTransform(canvasElement, viewportSelector(framework)).scale).toBe(0.25);
  };

  const maxZoom = async ({ canvasElement }: StoryPlayContext) => {
    await waitForDefaultEdges({ canvasElement });
    const pane = getQueryRoot(canvasElement).querySelector(paneSelector(framework))!;

    wheel(pane, -5000, -5000);
    await sleep(100);

    expect(getTransform(canvasElement, viewportSelector(framework)).scale).toBe(4);
  };

  const autoPanOnNodeDrag = async ({ canvasElement }: StoryPlayContext) => {
    await waitForDefaultEdges({ canvasElement });
    const node = queryNode(canvasElement, framework, '1')!;
    const transformBefore = getTransform(canvasElement, viewportSelector(framework));
    const start = getCenter(node);

    await pointerDrag(node, [{ x: 0, y: 0 }], { startCoords: start });
    await sleep(500);
    await dragWithSteps(node, { x: 2000, y: 2000 }, { startCoords: { x: 0, y: 0 }, stepCount: 100 });
    await sleep(300);

    const transformAfter = getTransform(canvasElement, viewportSelector(framework));
    expect(transformAfter.translateX).not.toEqual(transformBefore.translateX);
    expect(transformAfter.translateY).not.toEqual(transformBefore.translateY);
  };

  const autoPanOnConnect = async ({ canvasElement }: StoryPlayContext) => {
    await waitForDefaultEdges({ canvasElement });
    const handle = getQueryRoot(canvasElement).querySelector(`${dataIdSelector('1')} ${handleSelector(framework)}`)!;
    const transformBefore = getTransform(canvasElement, viewportSelector(framework));
    const start = getCenter(handle);
    const doc = canvasElement.ownerDocument;
    const end = { x: start.x + 100, y: start.y + 100 };

    dispatchMouse(handle, 'mousedown', start);
    dispatchMouse(doc, 'mousemove', { x: 0, y: 0 });
    await sleep(500);

    for (let index = 1; index <= 100; index += 1) {
      const progress = index / 100;
      dispatchMouse(doc, 'mousemove', {
        x: start.x + (end.x - start.x) * progress,
        y: start.y + (end.y - start.y) * progress,
      });
    }

    const transformAfter = getTransform(canvasElement, viewportSelector(framework));
    expect(transformAfter.translateX).not.toEqual(transformBefore.translateX);
    expect(transformAfter.translateY).not.toEqual(transformBefore.translateY);

    dispatchMouse(doc, 'mouseup', end);
  };

  const panOnScrollPans = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['first-edge']);
    const pane = getQueryRoot(canvasElement).querySelector(paneSelector(framework))!;
    const transformsBefore = getTransform(canvasElement, viewportSelector(framework));

    wheel(pane, 100, 100);
    await sleep(100);

    const transformsAfter = getTransform(canvasElement, viewportSelector(framework));
    expect(transformsAfter.translateX).not.toBe(transformsBefore.translateX);
    expect(transformsAfter.translateY).not.toBe(transformsBefore.translateY);
  };

  const initialViewport = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['first-edge']);
    const viewportTransform = getTransform(canvasElement, viewportSelector(framework));

    expect(viewportTransform.translateX).toBe(1.23);
    expect(viewportTransform.translateY).toBe(9.87);
    expect(viewportTransform.scale).toBe(1.234);
  };

  return {
    waitForDefaultEdges,
    panMovesPane,
    scrollZoomsPane,
    minZoom,
    maxZoom,
    autoPanOnNodeDrag,
    autoPanOnConnect,
    panOnScrollPans,
    initialViewport,
  };
}

export function createPaneGeneralSuite(framework: FlowFramework) {
  const plays = createPanePlays(framework);

  const cases: PlaySuiteCase[] = [
    { name: 'panning the pane moves it', run: plays.panMovesPane },
    { name: 'scrolling the default pane zooms it', run: plays.scrollZoomsPane },
    { name: 'minZoom', run: plays.minZoom },
    { name: 'maxZoom', run: plays.maxZoom },
    { name: 'autoPanOnNodeDrag', run: plays.autoPanOnNodeDrag },
    { name: 'autoPanOnConnect', run: plays.autoPanOnConnect },
  ];

  return (context: StoryPlayContext) => runPlaySuite('Pane / General', cases, context);
}

export function createPaneNonDefaultsSuite(framework: FlowFramework) {
  const plays = createPanePlays(framework);

  const cases: PlaySuiteCase[] = [
    { name: 'panOnScroll pans the pane on scrolling', run: plays.panOnScrollPans },
    { name: 'intialViewport', run: plays.initialViewport },
  ];

  return (context: StoryPlayContext) => runPlaySuite('Pane / NonDefaults', cases, context);
}

function handleSelector(framework: FlowFramework) {
  return `.${framework}-flow__handle`;
}
