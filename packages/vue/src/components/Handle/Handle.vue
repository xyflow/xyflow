<script lang="ts" setup>
import type { HandleProps } from '../../types';
import { ConnectionMode, getDimensions, isMouseEvent, nodeHasDimensions, Position } from '@xyflow/system';
import { computed, onMounted, shallowRef, toRef } from 'vue';
import { useHandle, useNode, useStore, useVueFlow } from '../../composables';
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

// Read the reactive store directly (see NodeWrapper) instead of projecting it into refs — there are ~2
// handles per node, so this setup runs a lot; `store.x` already tracks reactively in computeds/template.
const store = useStore();

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

  return isDef(isConnectable) ? isConnectable : store.nodesConnectable;
});

// All connection-driven classes in one computed instead of ~7 separate refs: they all derive from the same
// global `connection*` store state (so they toggle together during a connection) and are used only in the
// class binding. Mirrors xyflow/react's `connectingSelector`.
const connectionClasses = computed(() => {
  const fromHandle = store.connectionStartHandle;
  const clickFromHandle = store.connectionClickStartHandle;
  const toHandle = store.connectionEndHandle;
  const handleType = type.value;

  const connectionInProcess = fromHandle !== null;
  const clickConnectionInProcess = clickFromHandle !== null;
  // whether this handle can be the END of the in-progress (drag) connection
  const isPossibleEndHandle = store.connectionMode === ConnectionMode.Strict
    ? fromHandle?.type !== handleType
    : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id;
  const connectingto = toHandle?.nodeId === nodeId && toHandle?.id === handleId && toHandle?.type === handleType;

  return {
    // resolved value (falls back to `nodesConnectable`), not the raw prop — XYHandle's DOM query targets
    // `.connectable` to find drop targets, so an unset `:connectable` must still mark it
    connectable: isHandleConnectable.value,
    connecting:
      clickFromHandle?.nodeId === nodeId && clickFromHandle?.id === handleId && clickFromHandle?.type === handleType,
    connectablestart: connectableStart,
    connectableend: connectableEnd,
    connectingfrom: fromHandle?.nodeId === nodeId && fromHandle?.id === handleId && fromHandle?.type === handleType,
    connectingto,
    valid: connectingto && store.connectionStatus === 'valid',
    connectionindicator:
      isHandleConnectable.value
      && (!connectionInProcess || isPossibleEndHandle)
      && ((connectionInProcess || clickConnectionInProcess) ? connectableEnd : connectableStart),
  };
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

  if (isHandleConnectable.value && connectableStart && ((isMouseTriggered && event.button === 0) || !isMouseTriggered)) {
    handlePointerDown(event);
  }
}

function onClick(event: MouseEvent) {
  if (!nodeId || (!store.connectionClickStartHandle && !connectableStart)) {
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
