import { expect, userEvent, waitFor } from 'storybook/test';

import type { StoryPlayContext } from '../types';
import {
  flowClass,
  getClassName,
  getQueryRoot,
  getTransform,
  nodeSelector,
  paneSelector,
  pointerDrag,
  sleep,
  viewportSelector,
  wheel,
} from '../utils';
import { runPlaySuite, type PlaySuiteCase } from './suite';

const framework = 'react' as const;

function minimapSelector(className: string) {
  return flowClass(framework, `minimap${className ? `-${className}` : ''}`);
}

function controlsSelector(className: string) {
  return flowClass(framework, `controls-${className}`);
}

export function createAddonsPlays() {
  const rendersMinimap = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(minimapSelector(''))).toBeTruthy();
      expect(getQueryRoot(canvasElement).querySelector(minimapSelector('mask'))).toBeTruthy();
    });
  };

  const minimapHasSameNodeCount = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      const paneNodes = getQueryRoot(canvasElement).querySelectorAll(nodeSelector(framework)).length;
      const minimapNodes = getQueryRoot(canvasElement).querySelectorAll(minimapSelector('node')).length;
      expect(minimapNodes).toBe(paneNodes);
    });
  };

  const minimapChangesZoomLevel = async ({ canvasElement }: StoryPlayContext) => {
    const root = getQueryRoot(canvasElement);
    const svg = root.querySelector(`${minimapSelector('')} svg`)!;
    const mask = root.querySelector(minimapSelector('mask'))!;
    const viewBoxBeforeZoom = svg.getAttribute('viewBox');
    const maskPathBeforeZoom = mask.getAttribute('d');
    const pane = root.querySelector(paneSelector(framework))!;

    wheel(pane, 0, -200);
    await sleep(100);

    expect(svg.getAttribute('viewBox')).not.toBe(viewBoxBeforeZoom);
    expect(mask.getAttribute('d')).not.toBe(maskPathBeforeZoom);
  };

  const minimapChangesNodePosition = async ({ canvasElement }: StoryPlayContext) => {
    const root = getQueryRoot(canvasElement);
    const minimapNode = root.querySelector(`${minimapSelector('node')}:first-of-type`)!;
    const flowNode = root.querySelector(`${nodeSelector(framework)}:first-of-type`)!;
    const xPosBeforeDrag = Number(minimapNode.getAttribute('x'));
    const yPosBeforeDrag = Number(minimapNode.getAttribute('y'));

    await pointerDrag(flowNode, [{ x: 500, y: 25 }]);
    await sleep(100);

    const xPosAfterDrag = Number(minimapNode.getAttribute('x'));
    const yPosAfterDrag = Number(minimapNode.getAttribute('y'));

    expect(xPosAfterDrag).not.toBe(xPosBeforeDrag);
    expect(yPosAfterDrag).not.toBe(yPosBeforeDrag);
    expect(xPosAfterDrag - xPosBeforeDrag).toBeGreaterThan(yPosAfterDrag - yPosBeforeDrag);
  };

  const minimapChangesViaPaneDrag = async ({ canvasElement }: StoryPlayContext) => {
    const root = getQueryRoot(canvasElement);
    const svg = root.querySelector(`${minimapSelector('')} svg`)!;
    const mask = root.querySelector(minimapSelector('mask'))!;
    const viewBoxBeforeDrag = svg.getAttribute('viewBox');
    const maskPathBeforeDrag = mask.getAttribute('d');
    const pane = root.querySelector(paneSelector(framework))!;
    const paneBox = pane.getBoundingClientRect();

    await pointerDrag(pane, [
      { x: paneBox.x + 10, y: paneBox.y + 10 },
      { x: paneBox.x + 10, y: paneBox.y + paneBox.height - 10 },
    ]);
    await sleep(100);

    expect(svg.getAttribute('viewBox')).not.toBe(viewBoxBeforeDrag);
    expect(mask.getAttribute('d')).not.toBe(maskPathBeforeDrag);
  };

  const rendersControls = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(flowClass(framework, 'controls'))).toBeTruthy();
    });
  };

  const controlsZoomIn = async ({ canvasElement }: StoryPlayContext) => {
    const transformBefore = getTransform(canvasElement, viewportSelector(framework));
    await userEvent.click(getQueryRoot(canvasElement).querySelector(controlsSelector('zoomin'))!);
    await sleep(100);
    const transformAfter = getTransform(canvasElement, viewportSelector(framework));
    expect(transformAfter.scale).not.toBe(transformBefore.scale);
  };

  const controlsZoomOut = async ({ canvasElement }: StoryPlayContext) => {
    const transformBefore = getTransform(canvasElement, viewportSelector(framework));
    await userEvent.click(getQueryRoot(canvasElement).querySelector(controlsSelector('zoomout'))!);
    await sleep(100);
    const transformAfter = getTransform(canvasElement, viewportSelector(framework));
    expect(transformAfter.scale).not.toBe(transformBefore.scale);
  };

  const controlsDragPane = async ({ canvasElement }: StoryPlayContext) => {
    const transformBefore = getTransform(canvasElement, viewportSelector(framework));
    const renderer = getQueryRoot(canvasElement).querySelector(flowClass(framework, 'renderer'))!;
    const rendererBox = renderer.getBoundingClientRect();

    await pointerDrag(renderer, [
      { x: rendererBox.x + 10, y: rendererBox.y + 10 },
      { x: rendererBox.x + 10, y: rendererBox.y + 400 },
    ]);
    await sleep(100);

    const transformAfter = getTransform(canvasElement, viewportSelector(framework));
    expect(transformAfter.translateX).not.toBe(transformBefore.translateX);
    expect(transformAfter.translateY).not.toBe(transformBefore.translateY);
  };

  const controlsFitView = async ({ canvasElement }: StoryPlayContext) => {
    const root = getQueryRoot(canvasElement);
    const renderer = root.querySelector(flowClass(framework, 'renderer'))!;
    const rendererBox = renderer.getBoundingClientRect();
    const transformBefore = getTransform(canvasElement, viewportSelector(framework));

    await pointerDrag(renderer, [
      { x: rendererBox.x + 10, y: rendererBox.y + 10 },
      { x: rendererBox.x + 10, y: rendererBox.y + 400 },
    ]);
    await sleep(100);

    await userEvent.click(root.querySelector(controlsSelector('fitview'))!);
    await sleep(100);
    const transformAfter = getTransform(canvasElement, viewportSelector(framework));
    expect(transformAfter.scale).not.toBe(transformBefore.scale);
  };

  const controlsInteractiveOff = async ({ canvasElement }: StoryPlayContext) => {
    const root = getQueryRoot(canvasElement);
    const node = root.querySelector(`${nodeSelector(framework)}:first-of-type`)!;
    const pane = root.querySelector(paneSelector(framework))!;

    await userEvent.click(node);
    expect(getClassName(node)).toMatch(/selected/);

    const paneBox = pane.getBoundingClientRect();
    await userEvent.click(pane, { clientX: paneBox.x + 5, clientY: paneBox.y + 5 });
    expect(getClassName(node)).not.toMatch(/selected/);

    await userEvent.click(root.querySelector(controlsSelector('interactive'))!);
    expect(getClassName(node)).not.toMatch(/selected/);
  };

  const controlsInteractiveOn = async ({ canvasElement }: StoryPlayContext) => {
    const root = getQueryRoot(canvasElement);
    const node = root.querySelector(`${nodeSelector(framework)}:first-of-type`)!;

    await userEvent.click(node);
    expect(getClassName(node)).toMatch(/selected/);
  };

  return {
    rendersMinimap,
    minimapHasSameNodeCount,
    minimapChangesZoomLevel,
    minimapChangesNodePosition,
    minimapChangesViaPaneDrag,
    rendersControls,
    controlsZoomIn,
    controlsZoomOut,
    controlsDragPane,
    controlsFitView,
    controlsInteractiveOff,
    controlsInteractiveOn,
  };
}

export function createMinimapSuite() {
  const plays = createAddonsPlays();

  const cases: PlaySuiteCase[] = [
    { name: 'renders the mini map', run: plays.rendersMinimap },
    { name: 'has same number of nodes as the pane', run: plays.minimapHasSameNodeCount },
    { name: 'changes zoom level', run: plays.minimapChangesZoomLevel },
    { name: 'changes node position', run: plays.minimapChangesNodePosition },
    { name: 'changes node positions via pane drag', run: plays.minimapChangesViaPaneDrag },
  ];

  return (context: StoryPlayContext) => runPlaySuite('Addons / Minimap', cases, context);
}

export function createControlsSuite() {
  const plays = createAddonsPlays();

  const cases: PlaySuiteCase[] = [
    { name: 'renders the control panel', run: plays.rendersControls },
    { name: 'zooms in', run: plays.controlsZoomIn },
    { name: 'zooms out', run: plays.controlsZoomOut },
    { name: 'drags the pane', run: plays.controlsDragPane },
    { name: 'fits view', run: plays.controlsFitView },
    { name: 'uses interactive control - not interactive', run: plays.controlsInteractiveOff },
    { name: 'uses interactive control - interactive', run: plays.controlsInteractiveOn },
  ];

  return (context: StoryPlayContext) => runPlaySuite('Addons / Controls', cases, context);
}
