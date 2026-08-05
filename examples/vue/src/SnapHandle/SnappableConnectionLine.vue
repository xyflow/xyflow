<script lang="ts" setup>
import type { ConnectionLineProps, Handle, InternalNode } from '@xyflow/vue';
import { getBezierPath, Position, storeToRefs, useStore, useVueFlow } from '@xyflow/vue';

interface ClosestElements {
  node: InternalNode | null;
  handle: Handle | null;
  startHandle: Handle | null;
}

const props = defineProps<ConnectionLineProps>();

const { getNodes, getInternalNode, onConnectEnd, addEdges } = useVueFlow();

const { connection } = storeToRefs(useStore());

const closest = reactive<ClosestElements>({
  node: null,
  handle: null,
  startHandle: connection.value.fromHandle,
});

const canSnap = ref(false);

const HIGHLIGHT_COLOR = '#f59e0b';

const SNAP_HIGHLIGHT_COLOR = '#10b981';

const MIN_DISTANCE = 75;

const SNAP_DISTANCE = 50;

watch([() => props.toY, () => props.toX], (_, __, onCleanup) => {
  const closestNode = getNodes.value.reduce(
    (res, n) => {
      if (n.id !== connection.value.fromHandle?.nodeId) {
        const internalNode = getInternalNode(n.id);

        if (!internalNode) {
          return res;
        }

        const dx = props.toX - (internalNode.internals.positionAbsolute.x + (internalNode.measured?.width ?? 0) / 2);
        const dy = props.toY - (internalNode.internals.positionAbsolute.y + (internalNode.measured?.height ?? 0) / 2);
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < res.distance && d < MIN_DISTANCE) {
          res.distance = d;
          res.node = internalNode;
        }
      }

      return res;
    },
    {
      distance: Number.MAX_VALUE,
      node: null as InternalNode | null,
    },
  );

  if (!closestNode.node) {
    return;
  }

  canSnap.value = closestNode.distance < SNAP_DISTANCE;

  const type = connection.value.fromHandle!.type === 'source' ? 'target' : 'source';

  const closestHandle = closestNode.node.internals.handleBounds?.[type]?.reduce((prev, curr) => {
    const prevDistance = Math.sqrt((prev.x - props.toX) ** 2 + (prev.y - props.toY) ** 2);
    const currDistance = Math.sqrt((curr.x - props.toX) ** 2 + (curr.y - props.toY) ** 2);

    return prevDistance < currDistance ? prev : curr;
  });

  if (closestHandle) {
    const el = document.querySelector(`[data-nodeid='${closestNode.node.id}']`) as HTMLElement;

    const prevStyle = el.style.backgroundColor;
    el.style.backgroundColor = canSnap.value ? SNAP_HIGHLIGHT_COLOR : HIGHLIGHT_COLOR;
    closest.node = closestNode.node;
    closest.handle = closestHandle;

    onCleanup(() => {
      el.style.backgroundColor = prevStyle;
      closest.node = null;
      closest.handle = null;
    });
  }
});

const path = computed(() => getBezierPath({
  sourceX: props.fromX,
  sourceY: props.fromY,
  sourcePosition: connection.value.fromHandle?.position ?? Position.Bottom,
  targetX: canSnap.value && closest.handle ? closest.handle.x : props.toX,
  targetY: canSnap.value && closest.handle ? closest.handle.y : props.toY,
  targetPosition: closest.handle?.position ?? Position.Top,
}));

onConnectEnd(() => {
  if (closest.startHandle && closest.handle && closest.node) {
    if (canSnap.value) {
      addEdges([
        {
          sourceHandle: closest.startHandle.id ?? null,
          source: closest.startHandle.nodeId,
          target: closest.node.id,
          targetHandle: closest.handle.id!,
        },
      ]);
    }
  }
});

const strokeColor = computed(() => {
  if (canSnap.value) {
    return SNAP_HIGHLIGHT_COLOR;
  }

  if (closest.node) {
    return HIGHLIGHT_COLOR;
  }

  return '#222';
});
</script>

<template>
  <g>
    <path :d="path[0]" class="vue-flow__connection-path" />
    <circle :cx="toX" :cy="toY" fill="#fff" :stroke="strokeColor" :r="3" :stroke-width="1.5" />
  </g>
</template>
