import { expect, userEvent, waitFor } from 'storybook/test';

import type { FlowFramework, StoryPlayContext } from '../types';
import { runPlaySuite, type PlaySuiteCase } from './suite';
import {
  connectHandles,
  countEdges,
  dataIdSelector,
  dragHandleToCoords,
  getCenter,
  getClassName,
  getElementTransform,
  getQueryRoot,
  handleSelector,
  nodeSelector,
  nodesSelectionSelector,
  paneSelector,
  pointerDrag,
  queryNode,
  shiftDragSelect,
  sleep,
  waitForEdgeCount,
} from '../utils';

function firstNode(canvasElement: HTMLElement, framework: FlowFramework) {
  return getQueryRoot(canvasElement).querySelector(nodeSelector(framework))!;
}

export function createNodesPlays(framework: FlowFramework) {
  const selectNodeByClick = async ({ canvasElement }: StoryPlayContext) => {
    const node = firstNode(canvasElement, framework);
    await userEvent.click(node);
    await waitFor(() => expect(getClassName(node)).toMatch(/selected/));
  };

  const selectMultipleNodesWithShiftDrag = async ({ canvasElement }: StoryPlayContext) => {
    const pane = getQueryRoot(canvasElement).querySelector(paneSelector(framework))!;
    await userEvent.click(pane);
    await userEvent.keyboard('{Escape}[/ShiftLeft][/MetaLeft]');
    await sleep(100);

    const node1 = queryNode(canvasElement, framework, 'Node-1')!;
    const node2 = queryNode(canvasElement, framework, 'Node-2')!;
    const node3 = queryNode(canvasElement, framework, 'Node-3')!;
    const box = node1.getBoundingClientRect();

    await shiftDragSelect(
      canvasElement,
      framework,
      { x: box.x - 150, y: box.y - 25 },
      { x: box.x + 350, y: box.y + 250 }
    );

    await waitFor(() => expect(getClassName(node1)).toMatch(/selected/));
    await waitFor(() => expect(getClassName(node2)).toMatch(/selected/));
    await waitFor(() => expect(getClassName(node3)).toMatch(/selected/));
    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(nodesSelectionSelector(framework))).toBeTruthy();
    });
  };

  const selectableFalsePreventsSelection = async ({ canvasElement }: StoryPlayContext) => {
    const node = queryNode(canvasElement, framework, 'notSelectable')!;
    await userEvent.click(node);
    expect(getClassName(node)).not.toMatch(/selected/);
  };

  const dragNode = async ({ canvasElement }: StoryPlayContext) => {
    const node = firstNode(canvasElement, framework);
    const transformBeforeMove = getElementTransform(node);

    await pointerDrag(node, [{ x: 500, y: 500 }]);
    await sleep(100);

    expect(getElementTransform(node).translateX).not.toBe(transformBeforeMove.translateX);
  };

  const draggableFalsePreventsDragging = async ({ canvasElement }: StoryPlayContext) => {
    const node = queryNode(canvasElement, framework, 'notDraggable')!;
    const transformBeforeMove = getElementTransform(node);

    await pointerDrag(node, [{ x: 500, y: 500 }]);
    await sleep(100);

    expect(getElementTransform(node).translateX).toBe(transformBeforeMove.translateX);
    expect(getElementTransform(node).translateY).toBe(transformBeforeMove.translateY);
  };

  const customDragHandleWorks = async ({ canvasElement }: StoryPlayContext) => {
    const node = queryNode(canvasElement, framework, 'drag-handle')!;
    const dragHandle = getQueryRoot(canvasElement).querySelector('.custom-drag-handle')!;
    const transformBeforeMove = getElementTransform(node);
    const nodeBox = node.getBoundingClientRect();

    await pointerDrag(getQueryRoot(canvasElement), [{ x: nodeBox.x + 10, y: nodeBox.y + 10 }, { x: 500, y: 500 }]);
    expect(getElementTransform(node).translateX).toBe(transformBeforeMove.translateX);

    await pointerDrag(dragHandle, [{ x: 500, y: 500 }]);
    await sleep(100);
    expect(getElementTransform(node).translateX).not.toBe(transformBeforeMove.translateX);
  };

  const deleteNodeAndEdges = async ({ canvasElement }: StoryPlayContext) => {
    const node = queryNode(canvasElement, framework, 'Node-1')!;
    await userEvent.click(node);
    await userEvent.keyboard('d');

    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(dataIdSelector('Node-1'))).toBeNull();
      expect(countEdges(canvasElement, framework)).toBe(0);
    });
  };

  const deletableFalsePreventsDeletion = async ({ canvasElement }: StoryPlayContext) => {
    const node = queryNode(canvasElement, framework, 'notDeletable')!;
    await userEvent.click(node);
    await userEvent.keyboard('d');
    await sleep(200);
    expect(node).toBeInTheDocument();
  };

  const connectTwoNodes = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdgeCount(canvasElement, framework, 2);
    const outputHandle = getQueryRoot(canvasElement).querySelector(`${handleSelector(framework)}[data-nodeid="Node-1"]`)!;
    const inputHandle = getQueryRoot(canvasElement).querySelector(`${handleSelector(framework)}[data-nodeid="Node-4"]`)!;

    await connectHandles(outputHandle, inputHandle);

    await waitFor(() => {
      expect(countEdges(canvasElement, framework)).toBe(3);
      expect(getQueryRoot(canvasElement).querySelector(dataIdSelector('xy-edge__Node-1-Node-4'))).toBeTruthy();
    });
  };

  const connectingOutputsDoesNotWork = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdgeCount(canvasElement, framework, 2);
    const firstOutputHandle = getQueryRoot(canvasElement).querySelector(`${handleSelector(framework)}[data-nodeid="Node-2"]`)!;
    const secondOutputHandle = getQueryRoot(canvasElement).querySelector(`${handleSelector(framework)}[data-nodeid="Node-4"]`)!;
    const box = getCenter(secondOutputHandle);

    await dragHandleToCoords(firstOutputHandle, { x: box.x + 2, y: box.y + 2 });

    expect(countEdges(canvasElement, framework)).toBe(2);
  };

  const connectingInputsDoesNotWork = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdgeCount(canvasElement, framework, 2);
    const firstInputHandle = getQueryRoot(canvasElement).querySelector(`${handleSelector(framework)}[data-nodeid="Node-1"]`)!;
    const secondInputHandle = getQueryRoot(canvasElement)
      .querySelector(`${handleSelector(framework)}[data-nodeid="Node-3"].source`)!;
    const box = getCenter(secondInputHandle);

    await dragHandleToCoords(firstInputHandle, { x: box.x + 2, y: box.y + 2 });

    expect(countEdges(canvasElement, framework)).toBe(2);
  };

  const connectableFalsePreventsConnections = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdgeCount(canvasElement, framework, 2);
    const outputHandle = getQueryRoot(canvasElement).querySelector(`${handleSelector(framework)}[data-nodeid="Node-1"]`)!;
    const notConnectableHandle = getQueryRoot(canvasElement).querySelector(
      `${handleSelector(framework)}[data-nodeid="notConnectable"]`
    )!;
    const box = getCenter(notConnectableHandle);

    await dragHandleToCoords(outputHandle, { x: box.x + 2, y: box.y + 2 });

    expect(countEdges(canvasElement, framework)).toBe(2);
  };

  const hiddenNodeIsHidden = async ({ canvasElement }: StoryPlayContext) => {
    const node = queryNode(canvasElement, framework, 'hidden');
    expect(node === null || node.checkVisibility() === false).toBe(true);
  };

  const classesGetApplied = async ({ canvasElement }: StoryPlayContext) => {
    const node = queryNode(canvasElement, framework, 'Node-1')!;
    expect(getClassName(node)).toMatch(/playwright-test-class-123/);
  };

  const stylesGetApplied = async ({ canvasElement }: StoryPlayContext) => {
    const node = queryNode(canvasElement, framework, 'Node-1')!;
    expect(window.getComputedStyle(node).backgroundColor).toBe('rgb(255, 0, 0)');
  };

  return {
    selectNodeByClick,
    selectMultipleNodesWithShiftDrag,
    selectableFalsePreventsSelection,
    dragNode,
    draggableFalsePreventsDragging,
    customDragHandleWorks,
    deleteNodeAndEdges,
    deletableFalsePreventsDeletion,
    connectTwoNodes,
    connectingOutputsDoesNotWork,
    connectingInputsDoesNotWork,
    connectableFalsePreventsConnections,
    hiddenNodeIsHidden,
    classesGetApplied,
    stylesGetApplied,
  };
}

export function createNodesGeneralSuite(framework: FlowFramework) {
  const plays = createNodesPlays(framework);

  const cases: PlaySuiteCase[] = [
    { name: 'selecting a node by click', run: plays.selectNodeByClick },
    { name: 'selecting multiple nodes with shift drag', run: plays.selectMultipleNodesWithShiftDrag },
    { name: 'selectable=false prevents selection', run: plays.selectableFalsePreventsSelection },
    { name: 'dragging a node', run: plays.dragNode },
    { name: 'draggable=false prevents dragging', run: plays.draggableFalsePreventsDragging },
    { name: 'custom drag handle works', run: plays.customDragHandleWorks },
    { name: 'deleting a node and its edges', run: plays.deleteNodeAndEdges },
    { name: 'deletable=false prevents deletion', run: plays.deletableFalsePreventsDeletion },
    { name: 'connecting two nodes', run: plays.connectTwoNodes },
    { name: 'connecting two output handles does not work', run: plays.connectingOutputsDoesNotWork },
    { name: 'connecting two input handles does not work', run: plays.connectingInputsDoesNotWork },
    { name: 'connectable=false prevents connections', run: plays.connectableFalsePreventsConnections },
    { name: 'hidden=true hides the node', run: plays.hiddenNodeIsHidden },
    { name: 'classes get applied', run: plays.classesGetApplied },
    { name: 'styles get applied', run: plays.stylesGetApplied },
  ];

  return (context: StoryPlayContext) => runPlaySuite('Nodes / General', cases, context);
}
