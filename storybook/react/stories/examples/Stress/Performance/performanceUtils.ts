type Frame = {
  duration: number;
  stage: string;
};

/**
 * Measures and outputs the duration of every frame that happens between the
 * instance is created and `endRecording()` is called.
 *
 * Usage:
 *
 * ```ts
 * const recorder = new FrameRecorder();
 *
 * // Do some performance-intensive stuff
 *
 * await recorder.endRecordingAsync();
 *
 * console.log(recorder.getFrames());
 * console.log(recorder.getFramesForObservable()); // → paste into https://observablehq.com/@iamakulov/long-frame-visualizer
 * ```
 */
export class FrameRecorder {
  private frames: Frame[] = [];
  private animationFrameId: number;
  private stage: string = '<no stage>';

  constructor() {
    let lastFrameTimestamp = performance.now();

    const measureFrame = () => {
      const timestamp = performance.now();

      // Visualize the frames in the Performance pane (see the collapsed
      // “Timings” section) – so it’s easier to see what exactly each frame
      // captured
      performance.measure(`frame (${this.stage})`, {
        start: lastFrameTimestamp,
        end: timestamp,
      });

      this.frames.push({
        duration: timestamp - lastFrameTimestamp,
        stage: this.stage,
      });

      lastFrameTimestamp = timestamp;

      this.animationFrameId = requestAnimationFrame(measureFrame);
    };

    this.animationFrameId = requestAnimationFrame(measureFrame);
  }

  // The method is explicitly marked `async` in its name to make sure the caller
  // doesn’t forget to `await` it. (Otherwise, some events might be lost.)
  async endRecordingAsync() {
    this.setStage('waiting for idle');
    await new Promise((resolve) => requestIdleCallback(resolve));
    requestAnimationFrame(() => {
      cancelAnimationFrame(this.animationFrameId);
    });
  }

  /**
   * Adds an optional annotation to all subsequent frames. Useful to
   * differentiate frames from different events – e.g. you can call
   * `setState("mousedown")` before dispatching a mousedown event, and then
   * `setState("mouseup")` before a mouseup one.
   *
   * When used, will affect both `getFramesForObservable()` and `getFrames()`.
   */
  setStage(stage: string) {
    this.stage = stage;
  }

  getFramesForObservable() {
    return this.frames.map((frame, index) => ({ ...frame, index }));
  }

  getFrames() {
    // Group frames by stage – so you could see which frames originated from `mousedown` vs `mousemove` vs `mouseup` events
    const framesPerStage: Record<string, number[]> = {};
    for (const frame of this.frames) {
      const stage = frame.stage;
      if (!framesPerStage[stage]) {
        framesPerStage[stage] = [];
      }
      framesPerStage[stage].push(frame.duration);
    }

    // If there’s only one stage, return the frames directly
    return framesPerStage;
  }
}

/**
 * Returns a promise that resolves when the next frame starts, and everything
 * that was already scheduled in the event queue has been processed.
 */
export function nextFrame() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Generates params for a new MouseEvent() that will target the given node.
 */
export function generateMouseEventParamsTargetingNode(node: Element) {
  const nodePosition = node.getBoundingClientRect();

  // Let’s make the event (eg click) happen 5px to the right and 5px to the
  // bottom of the node’s top-left corner
  const positionRelativeToNode = {
    left: 5,
    top: 5,
  };

  return {
    clientX: Math.round(nodePosition.left + positionRelativeToNode.left),
    clientY: Math.round(nodePosition.top + positionRelativeToNode.top),
    movementX: 0,
    movementY: 0,
    offsetX: positionRelativeToNode.left,
    offsetY: positionRelativeToNode.top,
    screenX: Math.round(nodePosition.left + positionRelativeToNode.left),
    screenY: Math.round(nodePosition.top + positionRelativeToNode.top),

    // Required boilerplate
    altKey: false,
    bubbles: true,
    button: 0,
    buttons: 1,
    cancelBubble: false,
    cancelable: true,
    composed: true,
    ctrlKey: false,
    currentTarget: null,
    defaultPrevented: false,
    detail: 1,
    eventPhase: 0,
    fromElement: null,
    isTrusted: true,
    metaKey: false,
    relatedTarget: null,
    returnValue: true,
    shiftKey: false,
    view: window,
    which: 1,
  };
}
