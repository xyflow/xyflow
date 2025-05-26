import type { NodeEventsEmit, VueFlowInstance } from '../types';
import { createExtendedEventHook } from '../utils';

function createNodeHooks() {
  return {
    doubleClick: createExtendedEventHook(),
    click: createExtendedEventHook(),
    mouseEnter: createExtendedEventHook(),
    mouseMove: createExtendedEventHook(),
    mouseLeave: createExtendedEventHook(),
    contextMenu: createExtendedEventHook(),
    dragStart: createExtendedEventHook(),
    drag: createExtendedEventHook(),
    dragStop: createExtendedEventHook(),
  };
}

/**
 * Composable for handling node events
 *
 * @internal
 */
export function useNodeHooks(emits: VueFlowInstance['emits']): { emit: NodeEventsEmit } {
  const nodeHooks = createNodeHooks();

  nodeHooks.doubleClick.on((event) => {
    emits.nodeDoubleClick(event);
  });

  nodeHooks.click.on((event) => {
    emits.nodeClick(event);
  });

  nodeHooks.mouseEnter.on((event) => {
    emits.nodeMouseEnter(event);
  });

  nodeHooks.mouseMove.on((event) => {
    emits.nodeMouseMove(event);
  });

  nodeHooks.mouseLeave.on((event) => {
    emits.nodeMouseLeave(event);
  });

  nodeHooks.contextMenu.on((event) => {
    emits.nodeContextMenu(event);
  });

  nodeHooks.dragStart.on((event) => {
    emits.nodeDragStart(event);
  });

  nodeHooks.drag.on((event) => {
    emits.nodeDrag(event);
  });

  nodeHooks.dragStop.on((event) => {
    emits.nodeDragStop(event);
  });

  return Object.entries(nodeHooks).reduce(
    (hooks, [key, value]) => {
      hooks.emit[key as keyof NodeEventsEmit] = value.trigger;
      return hooks;
    },
    { emit: {} as NodeEventsEmit },
  );
}
