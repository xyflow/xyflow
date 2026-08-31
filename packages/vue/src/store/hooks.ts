import type { Edge, FlowHooks, Node } from '../types';
import type { VueFlowError } from '../utils';
import { getCurrentInstance, onBeforeMount, onScopeDispose } from 'vue';
import { createExtendedEventHook, devWarn, hasVNodeListener } from '../utils';

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
    nodesDelete: createExtendedEventHook(),
    edgesDelete: createExtendedEventHook(),
    delete: createExtendedEventHook(),
    updateNodeInternals: createExtendedEventHook(),
    error: createExtendedEventHook<VueFlowError>(err => devWarn(err.code, err.message)),
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

      // wire the emitter separately from `on` so it runs in addition to (not instead of) default handlers
      value.setEmitter(listener);
      onScopeDispose(value.removeEmitter, true);

      value.setHasEmitListeners(() => hasVNodeListener(inst, key));
      onScopeDispose(value.removeHasEmitListeners, true);
    }
  });
}
