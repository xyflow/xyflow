import type { StoryPlayContext } from '../types';
import { sleep } from '../utils';

export type PlayFn = (context: StoryPlayContext) => Promise<void>;

export type PlaySuiteCase = {
  /** Original Playwright/Cypress test name for traceability */
  name: string;
  run: PlayFn;
};

export const FLOW_STORY_RESET_EVENT = 'flow-story-reset';

export async function resetStoryState(canvasElement: HTMLElement) {
  canvasElement.ownerDocument.defaultView?.dispatchEvent(new CustomEvent(FLOW_STORY_RESET_EVENT));
  await sleep(150);
}

export async function runPlaySuite(suiteName: string, cases: PlaySuiteCase[], context: StoryPlayContext) {
  for (const testCase of cases) {
    await resetStoryState(context.canvasElement);

    try {
      await testCase.run(context);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`[${suiteName}] ${testCase.name}: ${message}`, { cause: error });
    }
  }
}
