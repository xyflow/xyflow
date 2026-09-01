import { expect, userEvent, waitFor } from 'storybook/test';

import { DEMO_NODE_ID, type NodeToolbarStoryArgs } from '../components/NodeToolbar/config';
import type { FlowFramework, StoryPlayContext } from '../types';
import { dataIdSelector, getQueryRoot, nodeToolbarSelector, queryNode } from '../utils';

type ToolbarPosition = NonNullable<NodeToolbarStoryArgs['position']>;
type ToolbarAlign = NonNullable<NodeToolbarStoryArgs['align']>;

export function createNodeToolbarPlays(framework: FlowFramework) {
  const toolbarSelector = `${dataIdSelector(DEMO_NODE_ID)}${nodeToolbarSelector(framework)}`;

  const waitForDemoNode = async ({ canvasElement }: StoryPlayContext) => {
    await waitFor(() => {
      expect(queryNode(canvasElement, framework, DEMO_NODE_ID)).toBeTruthy();
    });
  };

  const toolbarPositioned = (position: ToolbarPosition, align: ToolbarAlign) => {
    return async ({ canvasElement }: StoryPlayContext) => {
      await waitForDemoNode({ canvasElement });

      await waitFor(() => {
        expect(getQueryRoot(canvasElement).querySelector(toolbarSelector)).toBeTruthy();
      });

      const toolbar = getQueryRoot(canvasElement).querySelector(toolbarSelector)!;
      const node = queryNode(canvasElement, framework, DEMO_NODE_ID)!;

      await waitFor(() => {
        const toolbarBox = toolbar.getBoundingClientRect();
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
    };
  };

  const toolbarShowsOnSelect = async ({ canvasElement }: StoryPlayContext) => {
    await waitForDemoNode({ canvasElement });
    const node = queryNode(canvasElement, framework, DEMO_NODE_ID)!;

    expect(getQueryRoot(canvasElement).querySelector(toolbarSelector)).toBeNull();

    await userEvent.click(node);
    await waitFor(() => {
      expect(getQueryRoot(canvasElement).querySelector(toolbarSelector)).toBeTruthy();
    });
  };

  return {
    toolbarPositioned,
    toolbarShowsOnSelect,
  };
}
