// storybook/shared/waitForDragging.ts
import { within, waitFor, expect } from '@storybook/test';

type Options =
  | { findByTestId: string }
  | { findByLabelText: RegExp | string }
  | { custom: (canvas: ReturnType<typeof within>) => Promise<HTMLElement> | HTMLElement };

export async function waitForDragging(canvasElement: HTMLElement, opts: Options, timeout = 15000) {
  const canvas = within(canvasElement);

  let node: HTMLElement | null = null;
  if ('findByTestId' in opts) {
    node = (await canvas.findByTestId(opts.findByTestId)) as HTMLElement;
  } else if ('findByLabelText' in opts) {
    const label = await canvas.findByText(opts.findByLabelText);
    node = (label.closest('.react-flow__node') as HTMLElement) ?? null;
  } else {
    node = await Promise.resolve(opts.custom(canvas));
  }

  if (!node) throw new Error('Node not found');

  await waitFor(
    () => {
      expect(node.classList.contains('dragging')).toBe(true);
    },
    { timeout }
  );

  return node;
}
