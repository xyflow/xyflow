<script lang="ts" setup>
import type { HandleProps } from '../../types';
import { ConnectionMode, getDimensions, isMouseEvent, nodeHasDimensions, Position } from '@xyflow/system';
import { computed, onMounted, shallowRef, toRef } from 'vue';
import { storeToRefs, useHandle, useNode, useStore, useVueFlow } from '../../composables';
import { isDef } from '../../utils';

const {
  position = Position.Top,
  isConnectable = undefined,
  connectableStart = true,
  connectableEnd = true,
  id: handleId = null,
  ...props
} = defineProps<HandleProps>();

const type = toRef(() => props.type ?? 'source');

const isValidConnection = toRef(() => props.isValidConnection ?? null);

const { id: flowId } = useVueFlow();

const {
  connectionStartHandle,
  connectionEndHandle,
  connectionClickStartHandle,
  connectionStatus,
  connectionMode,
  vueFlowRef,
  nodesConnectable,
  noDragClassName,
  noPanClassName,
  ariaLabelConfig,
} = storeToRefs(useStore());

const { id: nodeId, node: nodeRef, nodeEl, connectedEdges } = useNode();

const handle = shallowRef<HTMLDivElement>();

// `data-id` (queried by handle DOM lookup in `utils/handle.ts`) and the other handle identifiers are
// typed through a `Record` because this vue version's `HTMLAttributes` lacks the `data-*` index signature
// that `strictTemplates` needs, so they can't be written as bare `:data-*` attributes in the template.
const handleDataIds = computed<Record<string, string | null>>(() => ({
  'data-id': `${flowId}-${nodeId}-${handleId}-${type.value}`,
  'data-handleid': handleId,
  'data-nodeid': nodeId,
  'data-handlepos': position,
}));

const isConnectableStart = toRef(() => (typeof connectableStart !== 'undefined' ? connectableStart : true));

const isConnectableEnd = toRef(() => (typeof connectableEnd !== 'undefined' ? connectableEnd : true));

// Connection-indicator flags, mirroring xyflow/react's `connectingSelector`. A connection is "in process"
// globally while dragging (`connectionStartHandle`) or click-connecting (`connectionClickStartHandle`);
// `isPossibleEndHandle` is whether this handle can be the END of the in-progress (drag) connection.
const connectionInProcess = toRef(() => connectionStartHandle.value !== null);

const clickConnectionInProcess = toRef(() => connectionClickStartHandle.value !== null);

const isPossibleEndHandle = toRef(() => {
  const fromHandle = connectionStartHandle.value;
  return connectionMode.value === ConnectionMode.Strict
    ? fromHandle?.type !== type.value
    : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id;
});

const isClickConnecting = toRef(
  () =>
    connectionClickStartHandle.value?.nodeId === nodeId
    && connectionClickStartHandle.value?.id === handleId
    && connectionClickStartHandle.value?.type === type.value,
);

// xyflow/react + svelte toggle these per handle during a connection: `connectingfrom` on the handle the
// drag started from, `connectingto` on the handle currently hovered, and `valid` when that hovered handle
// is a valid target. Core only toggles the classes — coloring is left to user CSS.
const connectingFrom = toRef(
  () =>
    connectionStartHandle.value?.nodeId === nodeId
    && connectionStartHandle.value?.id === handleId
    && connectionStartHandle.value?.type === type.value,
);

const connectingTo = toRef(
  () =>
    connectionEndHandle.value?.nodeId === nodeId
    && connectionEndHandle.value?.id === handleId
    && connectionEndHandle.value?.type === type.value,
);

const valid = toRef(() => connectingTo.value && connectionStatus.value === 'valid');

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
    return nodeRef.value ? isConnectable(nodeRef.value, connectedEdges.value) : false;
  }

  return isDef(isConnectable) ? isConnectable : nodesConnectable.value;
});

// todo: remove this and have users handle this themselves using `updateNodeInternals`
// set up handle bounds if they don't exist yet and the node has been initialized (i.e. the handle was added after the node has already been mounted)
onMounted(() => {
  const node = nodeRef.value;

  // if the node isn't initialized yet, we can't set up the handle bounds
  // the handle bounds will be automatically set up when the node is initialized (`updateNodeDimensions`)
  if (!node || !nodeHasDimensions(node)) {
    return;
  }

  const existingBounds = node.internals.handleBounds?.[type.value]?.find(b => b.id === handleId);

  if (!vueFlowRef.value || existingBounds) {
    return;
  }

  const viewportNode = vueFlowRef.value.querySelector('.vue-flow__viewport');

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

  if (isHandleConnectable.value && isConnectableStart.value && ((isMouseTriggered && event.button === 0) || !isMouseTriggered)) {
    handlePointerDown(event);
  }
}

function onClick(event: MouseEvent) {
  if (!nodeId || (!connectionClickStartHandle.value && !isConnectableStart.value)) {
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
    v-bind="handleDataIds"
    :aria-label="ariaLabelConfig['handle.ariaLabel']"
    class="vue-flow__handle"
    :class="[
      `vue-flow__handle-${position}`,
      handleId && `vue-flow__handle-${handleId}`,
      noDragClassName,
      noPanClassName,
      type,
      {
        // use the resolved value (falls back to `nodesConnectable`), not the raw prop — XYHandle's DOM
        // query targets `.connectable` to find drop targets, so an unset `:connectable` must still mark it
        connectable: isHandleConnectable,
        connecting: isClickConnecting,
        connectablestart: isConnectableStart,
        connectableend: isConnectableEnd,
        connectingfrom: connectingFrom,
        connectingto: connectingTo,
        valid,
        connectionindicator:
          isHandleConnectable
          && (!connectionInProcess || isPossibleEndHandle)
          && ((connectionInProcess || clickConnectionInProcess) ? isConnectableEnd : isConnectableStart),
      },
    ]"
    @mousedown="onPointerDown"
    @touchstart.passive="onPointerDown"
    @click="onClick"
  >
    <slot :id="id" />
  </div>
</template>
