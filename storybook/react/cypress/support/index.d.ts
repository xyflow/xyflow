import type { XYPosition } from '@xyflow/react';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      connectNodes(source: string, target: string): Chainable<void>;
      visitStory(id: string): Chainable<void>;
      updateStoryArgs(args: Record<string, unknown>): Chainable<void>;
      drag(selector: string, position: XYPosition): Chainable<JQuery<HTMLElement>>;
      dragPane(positions: { from: XYPosition; to: XYPosition }): Chainable<JQuery<HTMLElement>>;
      zoomPane(wheelDelta: number): Chainable<JQuery<HTMLElement>>;
      isWithinViewport(): Chainable<JQuery<HTMLElement>>;
      isOutsideViewport(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
