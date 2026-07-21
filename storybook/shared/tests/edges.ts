import { expect, userEvent, waitFor } from 'storybook/test';

import type { FlowFramework, StoryPlayContext } from '../types';
import { runPlaySuite, type PlaySuiteCase } from './suite';
import {
  clickAt,
  dataIdSelector,
  edgePathSelector,
  getClassName,
  getQueryRoot,
  queryEdge,
  sleep,
} from '../utils';

async function waitForEdges(canvasElement: HTMLElement, edgeIds: string[]) {
  for (const edgeId of edgeIds) {
    await waitFor(() => {
      expect(queryEdge(canvasElement, edgeId)).toBeTruthy();
    });
  }
}

export function createEdgesPlays(framework: FlowFramework) {
  const selectEdgeByClick = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['edge-with-class']);
    const edge = queryEdge(canvasElement, 'edge-with-class')!;
    await userEvent.click(edge);
    expect(getClassName(edge)).toMatch(/selected/);
  };

  const selectMultipleEdgesByMetaClick = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['edge-with-class', 'edge-with-style']);
    const edge1 = queryEdge(canvasElement, 'edge-with-class')!;
    const edge2 = queryEdge(canvasElement, 'edge-with-style')!;

    await userEvent.click(edge1);
    expect(getClassName(edge1)).toMatch(/selected/);

    await userEvent.keyboard('{s>}');
    await userEvent.click(edge2);
    await userEvent.keyboard('{/s}');

    expect(getClassName(edge2)).toMatch(/selected/);
    expect(getClassName(edge1)).toMatch(/selected/);
  };

  const classesGetApplied = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['edge-with-class']);
    const edge = queryEdge(canvasElement, 'edge-with-class')!;
    expect(getClassName(edge)).toMatch(/edge-class-test/);
  };

  const stylesGetApplied = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['edge-with-style']);
    const edgePath = queryEdge(canvasElement, 'edge-with-style')?.querySelector(edgePathSelector(framework))!;
    expect(window.getComputedStyle(edgePath).stroke).toBe('rgb(255, 0, 0)');
  };

  const hiddenEdgeIsHidden = async ({ canvasElement }: StoryPlayContext) => {
    const edge = queryEdge(canvasElement, 'hidden-edge');
    expect(edge === null || edge.checkVisibility() === false).toBe(true);
  };

  const animatedEdgeHasAnimatedClass = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['animated-edge']);
    const edge = queryEdge(canvasElement, 'animated-edge')!;
    expect(getClassName(edge)).toMatch(/animated/);
  };

  const selectableFalsePreventsSelection = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['not-selectable-edge']);
    const edge = queryEdge(canvasElement, 'not-selectable-edge')!;
    const edgeBox = edge.getBoundingClientRect();
    await clickAt(canvasElement, edgeBox.x + edgeBox.width * 0.5, edgeBox.y + edgeBox.height * 0.5);
    expect(getClassName(edge)).not.toMatch(/selected/);
  };

  const deleteEdge = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['edge-with-class']);
    const edge = queryEdge(canvasElement, 'edge-with-class')!;
    await userEvent.click(edge);
    expect(getClassName(edge)).toMatch(/selected/);
    await userEvent.keyboard('d');
    await waitFor(() => expect(queryEdge(canvasElement, 'edge-with-class')).toBeNull());
  };

  const deletableFalsePreventsDeletion = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['not-deletable']);
    const edge = queryEdge(canvasElement, 'not-deletable')!;
    await userEvent.click(edge);
    expect(getClassName(edge)).toMatch(/selected/);
    await userEvent.keyboard('d');
    await sleep(200);
    expect(queryEdge(canvasElement, 'not-deletable')).toBeTruthy();
  };

  const zIndexSetsZIndex = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['z-index']);
    const svg = getQueryRoot(canvasElement).querySelector(`svg:has(${dataIdSelector('z-index')})`)!;
    expect(window.getComputedStyle(svg).zIndex).toBe('3141592');
  };

  const ariaLabelWorks = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['aria-label']);
    const edge = queryEdge(canvasElement, 'aria-label')!;
    expect(edge.getAttribute('aria-label')).toBe('aria-label-test');
  };

  const interactionWidthWorks = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['interaction-width']);
    const edge = queryEdge(canvasElement, 'interaction-width')!;
    const edgeBox = edge.getBoundingClientRect();
    await userEvent.click(edge, {
      clientX: edgeBox.x + edgeBox.width * 0.5 + 21,
      clientY: edgeBox.y + edgeBox.height * 0.5,
    });
    expect(getClassName(edge)).toMatch(/selected/);
  };

  const markersSetMarkers = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['markers']);
    const edgePath = queryEdge(canvasElement, 'markers')?.querySelector(edgePathSelector(framework))!;
    expect(edgePath.getAttribute('marker-start')).toContain('arrowclosed');
    expect(edgePath.getAttribute('marker-end')).toContain('arrow');
  };

  const defaultZIndex = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['edge-with-class']);
    const svg = getQueryRoot(canvasElement).querySelector(`svg:has(${dataIdSelector('edge-with-class')})`)!;
    expect(window.getComputedStyle(svg).zIndex).toBe('0');
  };

  const subflowEdgeZIndex = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['subflow-edge']);
    const svg = getQueryRoot(canvasElement).querySelector(`svg:has(${dataIdSelector('subflow-edge')})`)!;
    expect(window.getComputedStyle(svg).zIndex).toBe('1');
  };

  const subflowEdge2ZIndex = async ({ canvasElement }: StoryPlayContext) => {
    await waitForEdges(canvasElement, ['subflow-edge-2']);
    const svg = getQueryRoot(canvasElement).querySelector(`svg:has(${dataIdSelector('subflow-edge-2')})`)!;
    expect(window.getComputedStyle(svg).zIndex).toBe('1');
  };

  return {
    selectEdgeByClick,
    selectMultipleEdgesByMetaClick,
    classesGetApplied,
    stylesGetApplied,
    hiddenEdgeIsHidden,
    animatedEdgeHasAnimatedClass,
    selectableFalsePreventsSelection,
    deleteEdge,
    deletableFalsePreventsDeletion,
    zIndexSetsZIndex,
    ariaLabelWorks,
    interactionWidthWorks,
    markersSetMarkers,
    defaultZIndex,
    subflowEdgeZIndex,
    subflowEdge2ZIndex,
  };
}

export function createEdgesGeneralSuite(framework: FlowFramework) {
  const plays = createEdgesPlays(framework);

  const cases: PlaySuiteCase[] = [
    { name: 'selecting an edge by click', run: plays.selectEdgeByClick },
    { name: 'selecting multiple edges by meta-click', run: plays.selectMultipleEdgesByMetaClick },
    { name: 'classes get applied', run: plays.classesGetApplied },
    { name: 'styles get applied', run: plays.stylesGetApplied },
    { name: 'hidden=true hides edge', run: plays.hiddenEdgeIsHidden },
    { name: 'animated=true add "animated" class', run: plays.animatedEdgeHasAnimatedClass },
    { name: 'selectable=false prevents selecting of edges', run: plays.selectableFalsePreventsSelection },
    { name: 'deleting edges is possible', run: plays.deleteEdge },
    { name: 'deletable=false prevents deleting of edges', run: plays.deletableFalsePreventsDeletion },
    { name: 'zIndex sets z-index of edge svgs', run: plays.zIndexSetsZIndex },
    { name: 'aria-lable is working', run: plays.ariaLabelWorks },
    { name: 'interactionWidth is working', run: plays.interactionWidthWorks },
    { name: 'marker-start, marker-end set markers', run: plays.markersSetMarkers },
    { name: 'z-index', run: plays.defaultZIndex },
    { name: 'sub flow: normal node to child node, z-index', run: plays.subflowEdgeZIndex },
    { name: 'sub flow: child node to child node, z-index', run: plays.subflowEdge2ZIndex },
  ];

  return (context: StoryPlayContext) => runPlaySuite('Edges / General', cases, context);
}
