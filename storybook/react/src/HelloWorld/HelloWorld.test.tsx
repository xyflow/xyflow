import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as HelloWorldStories from './HelloWorld.stories';

const Story = HelloWorldStories.WithAnimatedEdge;

beforeAll(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => {
    return { x: 0, y: 0, top: 0, left: 0, bottom: 600, right: 800, width: 800, height: 600, toJSON: () => {} } as any;
  });

  if (!('PointerEvent' in window)) {
    (window as any).PointerEvent = MouseEvent;
  }

  (HTMLElement.prototype as any).setPointerCapture ??= () => {};
  (HTMLElement.prototype as any).releasePointerCapture ??= () => {};
});

afterAll(() => {
  (HTMLElement.prototype.getBoundingClientRect as any).mockRestore?.();
});

describe('React Flow node dragging via story', () => {
  it('adds and removes the "dragging" class while dragging a node', async () => {
    // Render the story (it uses AnimatedHelloWorld)
    const ui = Story?.render ? Story.render(Story.args ?? {}, {} as any) : null;
    render(ui as any);

    // Find the node wrapper via its label "Hello"
    const label = await screen.findByText('Hello');
    const nodeEl = label.closest('.react-flow__node') as HTMLElement;
    expect(nodeEl).toBeTruthy();

    // Start drag
    fireEvent.pointerDown(nodeEl, { clientX: 120, clientY: 120, button: 0, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerMove(nodeEl, { clientX: 200, clientY: 200, buttons: 1, pointerId: 1, pointerType: 'mouse' });

    await waitFor(() => expect(document.body.classList.contains('dragging')).toBe(true));

    // End drag
    fireEvent.pointerUp(nodeEl, { clientX: 200, clientY: 200, pointerId: 1, pointerType: 'mouse' });
    await waitFor(() => expect(document.body.classList.contains('dragging')).toBe(false));
  });
});
