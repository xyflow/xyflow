import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import type { Props } from './data';

const argTypes = {} satisfies Record<keyof Props, any>;

export const meta: Meta = {
  title: 'Nodes',
  argTypes,
};

// TODO: implement all of the generic node tests here.
// the tests are run on each framework seperately
// The flow the tests are run on is already implemented and identical to the generic one
export const SelectNodeByClick: StoryObj<typeof meta> = {
  play: async ({ canvasElement, userEvent, parameters: { framework } }) => {
    const node = canvasElement.querySelector(`.${framework}-flow__node`);

    await userEvent.click(node);

    await expect(node?.classList).toContain('selected');
  },
};

export const SelectMultipleNodesWithShiftDrag: StoryObj<typeof meta> = {
  play: async ({ canvasElement, userEvent, parameters: { framework } }) => {
    const selection = canvasElement.querySelector(
      framework === 'react' ? '.react-flow__selection' : '.svelte-flow__selection'
    );

    const nodes = canvasElement.querySelectorAll(`.${framework}-flow__node`);

    await expect(nodes[0]).toBeVisible();
    await expect(nodes[1]).toBeVisible();
    await expect(nodes[2]).toBeVisible();

    const box = nodes[0].getBoundingClientRect();
    const pane = canvasElement.querySelector(`.${framework}-flow__pane`);

    // Calculate coordinates relative to the pane
    const paneRect = pane!.getBoundingClientRect();
    const startX = box.x - paneRect.x - 150;
    const startY = box.y - paneRect.y - 25;
    const endX = box.x - paneRect.x + 275;
    const endY = box.y - paneRect.y + 200;

    // Simulate shift+drag selection
    await userEvent.keyboard('{Shift>}');
    await userEvent.pointer([
      {
        keys: '[MouseLeft>]',
        target: pane,
      },
      {
        coords: { x: startX, y: startY },
      },
      {
        coords: { x: endX, y: endY },
      },
      {
        keys: '[/MouseLeft]',
        target: pane,
      },
    ]);
    await userEvent.keyboard('{/Shift}');

    // Wait for selection to be processed
    // await waitFor(async () => {
    //   await expect(selection).toBeInViewport();
    // });
    await expect(selection).toBeVisible();

    // Verify nodes are selected
    await expect(nodes[0]).toHaveClass(/selected/);
    await expect(nodes[1]).toHaveClass(/selected/);
    await expect(nodes[2]).toHaveClass(/selected/);

    // Verify node selection box appears

    const nodeSelection = canvasElement.querySelector(
      framework === 'react' ? '.react-flow__nodesselection' : '.svelte-flow__selection'
    );
    await expect(nodeSelection).toBeVisible();
  },
};
