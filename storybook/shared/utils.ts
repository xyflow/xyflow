import { expect, userEvent, waitFor } from 'storybook/test';

import type { FlowFramework } from './types';

const MATCH_ALL_NUMBERS = /[\d.]+/g;

export function getQueryRoot(canvasElement: HTMLElement) {
  return canvasElement.ownerDocument.body;
}

export function flowRootSelector(framework: FlowFramework) {
  return `.${framework}-flow`;
}

export function flowClass(framework: FlowFramework, className: string) {
  return `.${framework}-flow__${className}`;
}

export function paneSelector(framework: FlowFramework) {
  return flowClass(framework, 'pane');
}

export function viewportSelector(framework: FlowFramework) {
  return flowClass(framework, 'viewport');
}

export function nodeSelector(framework: FlowFramework) {
  return flowClass(framework, 'node');
}

export function handleSelector(framework: FlowFramework) {
  return flowClass(framework, 'handle');
}

export function edgeSelector(framework: FlowFramework) {
  return flowClass(framework, 'edge');
}

export function edgePathSelector(framework: FlowFramework) {
  return flowClass(framework, 'edge-path');
}

export function nodeToolbarSelector(framework: FlowFramework) {
  return flowClass(framework, 'node-toolbar');
}

export function backgroundSelector(framework: FlowFramework) {
  return framework === 'react' ? '[data-testid="rf__background"]' : '[data-testid="svelte-flow__background"]';
}

export function selectionSelector(framework: FlowFramework) {
  return framework === 'react' ? '.react-flow__selection' : '.svelte-flow__selection';
}

export function nodesSelectionSelector(framework: FlowFramework) {
  return framework === 'react' ? '.react-flow__nodesselection' : '.svelte-flow__selection';
}

export function dataIdSelector(id: string) {
  return `[data-id="${id}"]`;
}

export function getClassName(element: Element) {
  if (element instanceof SVGElement) {
    return element.getAttribute('class') ?? '';
  }

  return element.className?.toString() ?? '';
}

export function getElementTransform(element: Element) {
  const transformString = (element as HTMLElement).style.transform;
  const transforms = transformString.match(MATCH_ALL_NUMBERS) ?? ['0', '0', '1'];

  return {
    translateX: Number.parseFloat(transforms[0]),
    translateY: Number.parseFloat(transforms[1]),
    scale: Number.parseFloat(transforms[2] ?? '1'),
  };
}

export function getTransform(canvasElement: HTMLElement, selector: string) {
  const element = getQueryRoot(canvasElement).querySelector(selector);

  if (!element) {
    throw new Error(`Could not find element matching ${selector}`);
  }

  return getElementTransform(element);
}

export function queryNode(canvasElement: HTMLElement, framework: FlowFramework, nodeId: string) {
  return getQueryRoot(canvasElement).querySelector(`${dataIdSelector(nodeId)}${nodeSelector(framework)}`);
}

export function queryEdge(canvasElement: HTMLElement, edgeId: string) {
  return getQueryRoot(canvasElement).querySelector(dataIdSelector(edgeId));
}

export function countEdges(canvasElement: HTMLElement, framework: FlowFramework) {
  return getQueryRoot(canvasElement).querySelectorAll(edgeSelector(framework)).length;
}

export async function waitForEdgeCount(
  canvasElement: HTMLElement,
  framework: FlowFramework,
  count: number
) {
  await waitFor(() => {
    expect(countEdges(canvasElement, framework)).toBe(count);
  });
}

export function getCenter(element: Element) {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.x + rect.width * 0.5,
    y: rect.y + rect.height * 0.5,
  };
}

export function getWindow(canvasElement: HTMLElement) {
  return canvasElement.ownerDocument.defaultView!;
}

export function dispatchMouse(
  target: Element | Document,
  type: 'mousedown' | 'mousemove' | 'mouseup',
  coords: { x: number; y: number }
) {
  target.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      buttons: type === 'mouseup' ? 0 : 1,
      clientX: coords.x,
      clientY: coords.y,
    })
  );
}

export function dispatchPointer(
  target: Element | Document,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  coords: { x: number; y: number },
  options?: { shiftKey?: boolean }
) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      buttons: type === 'pointerup' ? 0 : 1,
      clientX: coords.x,
      clientY: coords.y,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      shiftKey: options?.shiftKey ?? false,
    })
  );
}

export function setModifierKey(canvasElement: HTMLElement, key: 'Shift', pressed: boolean) {
  const win = getWindow(canvasElement);
  const type = pressed ? 'keydown' : 'keyup';

  win.dispatchEvent(
    new KeyboardEvent(type, {
      key,
      code: 'ShiftLeft',
      bubbles: true,
      shiftKey: pressed,
    })
  );
}

export async function shiftDragSelect(
  canvasElement: HTMLElement,
  framework: FlowFramework,
  start: { x: number; y: number },
  end: { x: number; y: number }
) {
  const pane = getQueryRoot(canvasElement).querySelector(paneSelector(framework))!;
  const stepCount = 25;
  const pointerSteps: Array<{ coords: { x: number; y: number } }> = [];

  for (let index = 1; index <= stepCount; index += 1) {
    const progress = index / stepCount;
    pointerSteps.push({
      coords: {
        x: start.x + (end.x - start.x) * progress,
        y: start.y + (end.y - start.y) * progress,
      },
    });
  }

  if (framework === 'svelte') {
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: pane, coords: start },
      ...pointerSteps,
      { keys: '[/MouseLeft]', target: pane, coords: end },
    ]);
    await sleep(100);
    return;
  }

  await userEvent.keyboard('[/ShiftLeft][/MetaLeft][/ControlLeft]');
  await sleep(50);
  await userEvent.keyboard('[ShiftLeft>]');
  await sleep(100);

  await userEvent.pointer([
    { keys: '[ShiftLeft>][MouseLeft>]', target: pane, coords: start },
    ...pointerSteps,
    { keys: '[/MouseLeft][/ShiftLeft]', target: pane, coords: end },
  ]);
  await sleep(100);
}

export async function pointerDrag(
  target: Element,
  steps: Array<{ x: number; y: number }>,
  options?: { startOffset?: { x: number; y: number }; startCoords?: { x: number; y: number } }
) {
  const rect = target.getBoundingClientRect();
  const startX = options?.startCoords?.x ?? rect.x + (options?.startOffset?.x ?? rect.width * 0.5);
  const startY = options?.startCoords?.y ?? rect.y + (options?.startOffset?.y ?? rect.height * 0.5);

  await userEvent.pointer([
    { keys: '[MouseLeft>]', target, coords: { x: startX, y: startY } },
    ...steps.map((step) => ({ coords: { x: step.x, y: step.y } })),
    { keys: '[/MouseLeft]', target },
  ]);
}

export async function clickAt(canvasElement: HTMLElement, x: number, y: number) {
  const doc = canvasElement.ownerDocument;
  const target = doc.elementFromPoint(x, y) ?? doc.body;

  await userEvent.pointer([
    { target, coords: { x, y } },
    { keys: '[MouseLeft]', target, coords: { x, y } },
  ]);
}

export async function connectHandles(outputHandle: Element, inputHandle: Element) {
  const from = getCenter(outputHandle);
  const toRect = inputHandle.getBoundingClientRect();
  const to = { x: toRect.x + 2, y: toRect.y + 2 };
  const doc = outputHandle.ownerDocument;

  dispatchMouse(outputHandle, 'mousedown', from);
  dispatchMouse(doc, 'mousemove', { x: from.x + 5, y: from.y + 5 });
  dispatchMouse(doc, 'mousemove', to);
  dispatchMouse(doc, 'mouseup', to);
  await sleep(200);
}

export async function dragHandleToCoords(handle: Element, coords: { x: number; y: number }) {
  const from = getCenter(handle);
  const doc = handle.ownerDocument;

  dispatchMouse(handle, 'mousedown', from);
  dispatchMouse(doc, 'mousemove', { x: from.x + 5, y: from.y + 5 });
  dispatchMouse(doc, 'mousemove', coords);
  dispatchMouse(doc, 'mouseup', coords);
  await sleep(100);
}

export async function dragWithSteps(
  target: Element,
  end: { x: number; y: number },
  options?: { startCoords?: { x: number; y: number }; stepCount?: number }
) {
  const start = options?.startCoords ?? getCenter(target);
  const stepCount = options?.stepCount ?? 50;
  const steps: Array<{ x: number; y: number }> = [];

  for (let index = 1; index <= stepCount; index += 1) {
    const progress = index / stepCount;
    steps.push({
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress,
    });
  }

  await pointerDrag(target, steps, { startCoords: start });
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function wheel(target: Element, deltaX: number, deltaY: number) {
  target.dispatchEvent(
    new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaX,
      deltaY,
    })
  );
}

export function pressKey(key: string, target: Element | Document = document) {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
  target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key }));
}
