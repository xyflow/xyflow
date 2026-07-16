<script lang="ts" setup>
import type { HandleConnection } from '@xyflow/system';
import type { HandleProps } from '../../types';
import { areConnectionMapsEqual, ConnectionMode, getConnectedEdges, getDimensions, handleConnectionChange, isMouseEvent, nodeHasDimensions, Position } from '@xyflow/system';
import { computed, getCurrentInstance, inject, onMounted, shallowRef, toRef, watch } from 'vue';
import { useHandle, useInternalNode, useStore, useVueFlow } from '../../composables';
import { useNodeId } from '../../composables/useNodeId';
import { NodeRef } from '../../context';
import { isDef } from '../../utils';

const {
  position = Position.Top,
  isConnectable = undefined,
  isConnectableStart = true,
  isConnectableEnd = true,
  id: handleId = null,
  ...props
} = defineProps<HandleProps>();

const emit = defineEmits<{
  /** fired when an edge touching this handle is added, with the newly-connected connections */
  connect: [connections: HandleConnection[]];
  /** fired when an edge touching this handle is removed, with the removed connections */
  disconnect: [connections: HandleConnection[]];
}>();

const type = toRef(() => props.type ?? 'source');

const isValidConnection = toRef(() => props.isValidConnection ?? null);

const { id: flowId } = useVueFlow();

const store = useStore();

const nodeId = useNodeId() ?? '';
const nodeEl = inject(NodeRef, shallowRef(null));
const internalNode = useInternalNode();
const connectedEdges = computed(() => (internalNode.value ? getConnectedEdges([internalNode.value], store.edges) : []));

const instance = getCurrentInstance();
let prevConnections: Map<string, HandleConnection> | null = null;

const handle = shallowRef<HTMLDivElement>();

const { handlePointerDown, handleClick } = useHandle({
  nodeId,
  handleId,
  isValidConnection,
  type,
});

const isHandleConnectable = computed(() => {
  if (typeof isConnectable === 'string' && isConnectable === 'single') {
    return !connectedEdges.value.some((edge) => {
      const id = edge[`${type.value}Handle`];

      if (edge[type.value] !== nodeId) {
        return false;
      }

      return id ? id === handleId : true;
    });
  }

  if (typeof isConnectable === 'number') {
    return (
      connectedEdges.value.filter((edge) => {
        const id = edge[`${type.value}Handle`];

        if (edge[type.value] !== nodeId) {
          return false;
        }

        return id ? id === handleId : true;
      }).length < isConnectable
    );
  }

  if (typeof isConnectable === 'function') {
    return internalNode.value ? isConnectable(internalNode.value, connectedEdges.value) : false;
  }

  return isDef(isConnectable) ? isConnectable : store.nodesConnectable;
});

const connectionClasses = computed<Record<string, boolean>>((prev) => {
  const fromHandle = store.connectionStartHandle;
  const clickFromHandle = store.connectionClickStartHandle;
  const toHandle = store.connectionEndHandle;
  const handleType = type.value;

  const connectionInProcess = fromHandle !== null;
  const clickConnectionInProcess = clickFromHandle !== null;
  const isPossibleEndHandle = store.connectionMode === ConnectionMode.Strict
    ? fromHandle?.type !== handleType
    : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id;
  const connectingto = toHandle?.nodeId === nodeId && toHandle?.id === handleId && toHandle?.type === handleType;

  const next = {
    connectable: isHandleConnectable.value,
    connecting:
      clickFromHandle?.nodeId === nodeId && clickFromHandle?.id === handleId && clickFromHandle?.type === handleType,
    connectablestart: isConnectableStart,
    connectableend: isConnectableEnd,
    connectingfrom: fromHandle?.nodeId === nodeId && fromHandle?.id === handleId && fromHandle?.type === handleType,
    connectingto,
    valid: connectingto && store.connectionStatus === 'valid',
    connectionindicator:
      isHandleConnectable.value
      && (!connectionInProcess || isPossibleEndHandle)
      && ((connectionInProcess || clickConnectionInProcess) ? isConnectableEnd : isConnectableStart),
  };

  // reuse the previous object when nothing changed so the class binding doesn't re-render (Vue gates on ref identity)
  // a connection drag recomputes every handle, but only the two endpoints' classes actually change
  if (
    prev
    && prev.connectable === next.connectable
    && prev.connecting === next.connecting
    && prev.connectablestart === next.connectablestart
    && prev.connectableend === next.connectableend
    && prev.connectingfrom === next.connectingfrom
    && prev.connectingto === next.connectingto
    && prev.valid === next.valid
    && prev.connectionindicator === next.connectionindicator
  ) {
    return prev;
  }

  return next;
});

watch(
  () => store.edges,
  () => {
    // no listeners, bail
    if (!instance?.vnode.props?.onConnect && !instance?.vnode.props?.onDisconnect) {
      return;
    }

    const connections = store.connectionLookup.get(`${nodeId}-${type.value}${handleId ? `-${handleId}` : ''}`);

    if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
      const nextConnections = connections ?? new Map<string, HandleConnection>();
      handleConnectionChange(prevConnections, nextConnections, diff => emit('disconnect', diff));
      handleConnectionChange(nextConnections, prevConnections, diff => emit('connect', diff));
    }

    prevConnections = new Map(connections);
  },
  { immediate: true },
);

// todo: remove this and have users handle it via `updateNodeInternals`
// set up handle bounds if missing and the node is already initialized (handle added after the node mounted)
onMounted(() => {
  const node = internalNode.value;

  // if the node isn't initialized yet, bounds get set up later by `updateNodeDimensions`
  if (!node || !nodeHasDimensions(node)) {
    return;
  }

  const existingBounds = node.internals.handleBounds?.[type.value]?.find(b => b.id === handleId);

  if (!store.vueFlowRef || existingBounds) {
    return;
  }

  const viewportNode = store.vueFlowRef.querySelector('.vue-flow__viewport');

  if (!nodeEl.value || !handle.value || !viewportNode || !handleId) {
    return;
  }

  const nodeBounds = nodeEl.value.getBoundingClientRect();

  const handleBounds = handle.value.getBoundingClientRect();

  const style = window.getComputedStyle(viewportNode);
  const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

  const nextBounds = {
    id: handleId,
    position,
    x: (handleBounds.left - nodeBounds.left) / zoom,
    y: (handleBounds.top - nodeBounds.top) / zoom,
    type: type.value,
    nodeId,
    ...getDimensions(handle.value),
  };

  if (!node.internals.handleBounds) {
    node.internals.handleBounds = { source: null, target: null };
  }
  const bounds = node.internals.handleBounds;
  bounds[type.value] = [...(bounds[type.value] ?? []), nextBounds];
});

function onPointerDown(event: MouseEvent | TouchEvent) {
  const isMouseTriggered = isMouseEvent(event);

  if (isHandleConnectable.value && isConnectableStart && ((isMouseTriggered && event.button === 0) || !isMouseTriggered)) {
    handlePointerDown(event);
  }
}

function onClick(event: MouseEvent) {
  if (!nodeId || (!store.connectionClickStartHandle && !isConnectableStart)) {
    return;
  }

  if (isHandleConnectable.value) {
    handleClick(event);
  }
}

defineExpose({
  handleClick,
  handlePointerDown,
  onClick,
  onPointerDown,
});
</script>

<script lang="ts">
export default {
  name: 'Handle',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <div
    ref="handle"
    :data-id="`${flowId}-${nodeId}-${handleId}-${type}`"
    :data-handleid="handleId"
    :data-nodeid="nodeId"
    :data-handlepos="position"
    :aria-label="store.ariaLabelConfig['handle.ariaLabel']"
    class="vue-flow__handle"
    :class="[
      `vue-flow__handle-${position}`,
      handleId && `vue-flow__handle-${handleId}`,
      store.noDragClassName,
      store.noPanClassName,
      type,
      connectionClasses,
    ]"
    @mousedown="onPointerDown"
    @touchstart.passive="onPointerDown"
    @click="onClick"
  >
    <slot :id="id" />
  </div>
</template>
