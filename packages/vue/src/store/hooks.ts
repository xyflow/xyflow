import type { Edge, FlowEvents, FlowHooks, Node } from '../types';
import { getCurrentInstance, onBeforeMount, onScopeDispose } from 'vue';
import { createExtendedEventHook, warn } from '../utils';

export function createHooks<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): FlowHooks<NodeType, EdgeType> {
  return {
    edgesChange: createExtendedEventHook(),
    nodesChange: createExtendedEventHook(),
    nodeDoubleClick: createExtendedEventHook(),
    nodeClick: createExtendedEventHook(),
    nodeMouseEnter: createExtendedEventHook(),
    nodeMouseMove: createExtendedEventHook(),
    nodeMouseLeave: createExtendedEventHook(),
    nodeContextMenu: createExtendedEventHook(),
    nodeDragStart: createExtendedEventHook(),
    nodeDrag: createExtendedEventHook(),
    nodeDragStop: createExtendedEventHook(),
    nodesInitialized: createExtendedEventHook(),
    miniMapNodeClick: createExtendedEventHook(),
    miniMapNodeDoubleClick: createExtendedEventHook(),
    miniMapNodeMouseEnter: createExtendedEventHook(),
    miniMapNodeMouseMove: createExtendedEventHook(),
    miniMapNodeMouseLeave: createExtendedEventHook(),
    connect: createExtendedEventHook(),
    connectStart: createExtendedEventHook(),
    connectEnd: createExtendedEventHook(),
    clickConnectStart: createExtendedEventHook(),
    clickConnectEnd: createExtendedEventHook(),
    init: createExtendedEventHook(),
    move: createExtendedEventHook(),
    moveStart: createExtendedEventHook(),
    moveEnd: createExtendedEventHook(),
    selectionDragStart: createExtendedEventHook(),
    selectionDrag: createExtendedEventHook(),
    selectionDragStop: createExtendedEventHook(),
    selectionContextMenu: createExtendedEventHook(),
    selectionStart: createExtendedEventHook(),
    selectionEnd: createExtendedEventHook(),
    selectionChange: createExtendedEventHook(),
    viewportChangeStart: createExtendedEventHook(),
    viewportChange: createExtendedEventHook(),
    viewportChangeEnd: createExtendedEventHook(),
    paneScroll: createExtendedEventHook(),
    paneClick: createExtendedEventHook(),
    paneContextMenu: createExtendedEventHook(),
    paneMouseEnter: createExtendedEventHook(),
    paneMouseMove: createExtendedEventHook(),
    paneMouseLeave: createExtendedEventHook(),
    edgeContextMenu: createExtendedEventHook(),
    edgeMouseEnter: createExtendedEventHook(),
    edgeMouseMove: createExtendedEventHook(),
    edgeMouseLeave: createExtendedEventHook(),
    edgeDoubleClick: createExtendedEventHook(),
    edgeClick: createExtendedEventHook(),
    reconnectStart: createExtendedEventHook(),
    reconnect: createExtendedEventHook(),
    reconnectEnd: createExtendedEventHook(),
    updateNodeInternals: createExtendedEventHook(),
    error: createExtendedEventHook(err => warn(err.message)),
  };
}

export function useHooks<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  emit: (...args: any[]) => void,
  hooks: FlowHooks<NodeType, EdgeType>,
) {
  const inst = getCurrentInstance();
  onBeforeMount(() => {
    for (const [key, value] of Object.entries(hooks)) {
      const listener = (data: unknown) => {
        emit(key, data);
      };

      // push into fns instead of using `on` to avoid overwriting default handlers - the emitter should be called in addition to the default handlers
      value.setEmitter(listener);
      onScopeDispose(value.removeEmitter, true);

      value.setHasEmitListeners(() => hasVNodeListener(key as keyof FlowEvents));
      onScopeDispose(value.removeHasEmitListeners, true);
    }
  });

  function hasVNodeListener(event: keyof FlowEvents) {
    const key = toHandlerKey(event);
    // listeners live on vnode.props; value can be a Function or an array of Functions
    const h = inst?.vnode.props?.[key];
    return !!h;
  }
}

/**
 * Converts an event name to the corresponding handler key.
 * E.g. 'nodeClick' -> 'onNodeClick'
 *
 * @param event The event name to convert.
 * @returns The corresponding handler key.
 */
function toHandlerKey(event: string) {
  const [head, ...rest] = event.split(':');
  const camel = head.replace(/(?:^|-)(\w)/g, (_, c: string) => c.toUpperCase());
  return `on${camel}${rest.length ? `:${rest.join(':')}` : ''}`;
}
