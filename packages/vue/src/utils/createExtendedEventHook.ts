import { onScopeDispose } from 'vue';

/**
 * vue-flow's own event-hook types. We intentionally do NOT reuse `@vueuse/core`'s `EventHook*` types:
 * since v14 its `Callback<T>` spreads array payloads (for `T extends any[]` it becomes
 * `(...param: T) => void`), which is incompatible with vue-flow's single-array-payload hooks — e.g.
 * `onNodesChange((changes: NodeChange[]) => void)` and `trigger(changes)`. Owning these types keeps the
 * public hook contract stable regardless of `@vueuse/core`'s internal callback variance.
 */
export type EventHookOn<T = any> = (fn: (param: T) => void) => { off: () => void };
export type EventHookOff<T = any> = (fn: (param: T) => void) => void;
export type EventHookTrigger<T = any> = (param: T) => Promise<unknown[]>;

export interface EventHook<T = any> {
  on: EventHookOn<T>;
  off: EventHookOff<T>;
  trigger: EventHookTrigger<T>;
}

export interface EventHookExtended<T> extends EventHook<T> {
  /** true if any user listeners are registered (emitter ignored) */
  hasListeners: () => boolean;
  /** current user listeners (read-only; do not mutate externally) */
  listeners: ReadonlySet<(param: T) => void>;
  /** wire a single external emitter (e.g., for `emit`) */
  setEmitter: (fn: (param: T) => void) => void;
  /** remove the external emitter */
  removeEmitter: () => void;
  /** wire a function to detect if any emit listeners exist (e.g., for `$listeners` in Vue 2) */
  setHasEmitListeners: (fn: () => boolean) => void;
  /** remove the emit listeners detector */
  removeHasEmitListeners: () => void;
}

type Handler<T = any> = (param: T) => any | Promise<any>;

const noop: Handler = () => {};

// shared resolved promise for triggers with no observers — pointer-move hooks fire per mousemove, so
// allocating a fresh array + allSettled chain for nothing is measurable GC pressure
const EMPTY_TRIGGER_RESULT: Promise<unknown[]> = Promise.resolve([]);

export function createExtendedEventHook<T = any>(defaultHandler?: (param: T) => void): EventHookExtended<T> {
  const listeners = new Set<Handler>();
  let emitter: Handler = noop;
  let hasEmitListeners = () => false;

  const hasListeners = () => listeners.size > 0 || hasEmitListeners();

  const setEmitter = (fn: Handler) => {
    emitter = fn;
  };

  const removeEmitter = () => {
    emitter = noop;
  };

  const setHasEmitListeners = (fn: () => boolean) => {
    hasEmitListeners = fn;
  };

  const removeHasEmitListeners = () => {
    hasEmitListeners = () => false;
  };

  const off: EventHookOff<T> = (fn) => {
    listeners.delete(fn);
  };

  const on: EventHookOn<T> = (fn) => {
    listeners.add(fn);

    const offFn = () => off(fn);
    // `failSilently` (Vue 3.5+) mirrors `tryOnScopeDispose`: auto-remove the listener when registered
    // inside an effect scope, and no-op (no warning) when `on()` is called outside one.
    onScopeDispose(offFn, true);

    return { off: offFn };
  };

  /**
   * Trigger order:
   * 1) If any user listeners OR an emitter exist -> call all of those (defaultHandler is skipped)
   * 2) Else (no listeners and no emitter) -> call defaultHandler (if provided)
   *
   * Errors are isolated via allSettled so one failing handler doesn't break others.
   */
  const trigger: EventHookTrigger<T> = (param) => {
    // fast path: nothing can observe this event — no programmatic listeners, no `@event` vnode handler
    // (the emitter would dispatch into a void emit), no default. Skip the dispatch + allocations.
    if (listeners.size === 0 && !hasEmitListeners() && !defaultHandler) {
      return EMPTY_TRIGGER_RESULT;
    }

    const queue: Handler[] = [emitter];

    if (hasListeners()) {
      queue.push(...listeners);
    }
    else if (defaultHandler) {
      queue.push(defaultHandler);
    }

    return Promise.allSettled(queue.map(fn => fn(param)));
  };

  return {
    on,
    off,
    trigger,
    hasListeners,
    listeners,
    setEmitter,
    removeEmitter,
    setHasEmitListeners,
    removeHasEmitListeners,
  };
}
