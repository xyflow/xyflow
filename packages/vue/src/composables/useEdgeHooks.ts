import type { EdgeEventsEmit, VueFlowInstance } from '../types';
import { createExtendedEventHook } from '../utils';

function createEdgeHooks() {
  return {
    doubleClick: createExtendedEventHook(),
    click: createExtendedEventHook(),
    mouseEnter: createExtendedEventHook(),
    mouseMove: createExtendedEventHook(),
    mouseLeave: createExtendedEventHook(),
    contextMenu: createExtendedEventHook(),
    reconnectStart: createExtendedEventHook(),
    reconnect: createExtendedEventHook(),
    reconnectEnd: createExtendedEventHook(),
  };
}

/**
 * Composable for handling edge events
 *
 * @internal
 */
export function useEdgeHooks(emits: VueFlowInstance['emits']): {
  emit: EdgeEventsEmit;
} {
  const edgeHooks = createEdgeHooks();

  edgeHooks.doubleClick.on((event) => {
    emits.edgeDoubleClick(event);
  });

  edgeHooks.click.on((event) => {
    emits.edgeClick(event);
  });

  edgeHooks.mouseEnter.on((event) => {
    emits.edgeMouseEnter(event);
  });

  edgeHooks.mouseMove.on((event) => {
    emits.edgeMouseMove(event);
  });

  edgeHooks.mouseLeave.on((event) => {
    emits.edgeMouseLeave(event);
  });

  edgeHooks.contextMenu.on((event) => {
    emits.edgeContextMenu(event);
  });

  edgeHooks.reconnectStart.on((event) => {
    emits.reconnectStart(event);
  });

  edgeHooks.reconnect.on((event) => {
    emits.reconnect(event);
  });

  edgeHooks.reconnectEnd.on((event) => {
    emits.reconnectEnd(event);
  });

  return Object.entries(edgeHooks).reduce(
    (hooks, [key, value]) => {
      hooks.emit[key as keyof EdgeEventsEmit] = value.trigger;

      return hooks;
    },
    { emit: {} as EdgeEventsEmit },
  );
}
