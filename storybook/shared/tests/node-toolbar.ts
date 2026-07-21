import { expect, userEvent, waitFor } from 'storybook/test';

import type { FlowFramework, StoryPlayContext } from '../types';
import { runPlaySuite, type PlaySuiteCase } from './suite';
import { dataIdSelector, getQueryRoot, nodeToolbarSelector, queryNode } from '../utils';

const positions = ['top', 'right', 'bottom', 'left'] as const;
const alignments = ['start', 'center', 'end'] as const;

export function createNodeToolbarPlays(framework: FlowFramework) {
  const waitForToolbarNodes = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      expect(queryNode(canvasElement, framework, 'node-start-top')).toBeTruthy();
    });
  };

  const allToolbarsPositionedCorrectly = async ({ canvasElement }: StoryPlayContext) => {
    await waitForToolbarNodes({ canvasElement });

    for (const position of positions) {
      for (const align of alignments) {
        const id = `node-${align}-${position}`;
        const toolbar = getQueryRoot(canvasElement).querySelector(`${dataIdSelector(id)}${nodeToolbarSelector(framework)}`);
        const node = queryNode(canvasElement, framework, id)!;

        await waitFor(() => expect(toolbar).toBeTruthy());
        expect(node).toBeTruthy();

        await waitFor(() => {
          const toolbarBox = toolbar!.getBoundingClientRect();
          const nodeBox = node.getBoundingClientRect();

          expect(toolbarBox.width).toBeGreaterThan(0);
          expect(toolbarBox.height).toBeGreaterThan(0);

          switch (position) {
            case 'top':
              expect(toolbarBox.y).toBeLessThan(nodeBox.y);
              break;
            case 'right':
              expect(toolbarBox.x).toBeGreaterThan(nodeBox.x);
              break;
            case 'bottom':
              expect(toolbarBox.y).toBeGreaterThan(nodeBox.y);
              break;
            case 'left':
              expect(toolbarBox.x).toBeLessThan(nodeBox.x);
              break;
          }

          const dimension = position === 'top' || position === 'bottom' ? 'x' : 'y';
          const extent = position === 'top' || position === 'bottom' ? 'width' : 'height';

          switch (align) {
            case 'start':
              expect(Math.floor(toolbarBox[dimension])).toBe(Math.floor(nodeBox[dimension]));
              break;
            case 'center':
              expect(Math.floor(toolbarBox[dimension] + toolbarBox[extent] * 0.5)).toBe(
                Math.floor(nodeBox[dimension] + nodeBox[extent] * 0.5)
              );
              break;
            case 'end':
              expect(Math.floor(toolbarBox[dimension] + toolbarBox[extent])).toBe(
                Math.floor(nodeBox[dimension] + nodeBox[extent])
              );
              break;
          }
        });
      }
    }
  };

  const toolbarDefaultBehaviour = async ({ canvasElement }: StoryPlayContext) => {
    await waitForToolbarNodes({ canvasElement });
    const node = queryNode(canvasElement, framework, 'default-node')!;
    const toolbarSelector = `${dataIdSelector('default-node')}${nodeToolbarSelector(framework)}`;

    expect(getQueryRoot(canvasElement).querySelector(toolbarSelector)).toBeNull();

    await userEvent.click(node);
    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(toolbarSelector)).toBeTruthy();
    });
  };

  return {
    allToolbarsPositionedCorrectly,
    toolbarDefaultBehaviour,
  };
}

export function createNodeToolbarGeneralSuite(framework: FlowFramework) {
  const plays = createNodeToolbarPlays(framework);

  const cases: PlaySuiteCase[] = [
    { name: 'all toolbars are positioned correctly', run: plays.allToolbarsPositionedCorrectly },
    { name: 'toolbar default behaviour', run: plays.toolbarDefaultBehaviour },
  ];

  return (context: StoryPlayContext) => runPlaySuite('Node Toolbar / General', cases, context);
}
