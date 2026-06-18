<script lang="ts" setup>
import type { ConnectingHandle, InternalNode, HandleElement, Position } from '@xyflow/vue';
import { getBezierPath, storeToRefs, useStore, useVueFlow } from '@xyflow/vue';

interface CustomConnectionLineProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
}

interface ClosestElements {
  node: InternalNode | null;
  handle: HandleElement | null;
  startHandle: ConnectingHandle | null;
}

const props = defineProps<CustomConnectionLineProps>();

const { getNodes, getInternalNode, onConnectEnd, addEdges } = useVueFlow();

const { connectionStartHandle } = storeToRefs(useStore());

const closest = reactive<ClosestElements>({
  node: null,
  handle: null,
  startHandle: connectionStartHandle.value,
});

const canSnap = ref(false);

const HIGHLIGHT_COLOR = '#f59e0b';

const SNAP_HIGHLIGHT_COLOR = '#10b981';

const MIN_DISTANCE = 75;

const SNAP_DISTANCE = 50;

watch([() => props.targetY, () => props.targetX], (_, __, onCleanup) => {
  const closestNode = getNodes.value.reduce(
    (res, n) => {
      if (n.id !== connectionStartHandle.value?.nodeId) {
        const internalNode = getInternalNode(n.id);

        if (!internalNode) {
          return res;
        }

        const dx = props.targetX - (internalNode.internals.positionAbsolute.x + (internalNode.measured?.width ?? 0) / 2);
        const dy = props.targetY - (internalNode.internals.positionAbsolute.y + (internalNode.measured?.height ?? 0) / 2);
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

  const type = connectionStartHandle.value!.type === 'source' ? 'target' : 'source';

  const closestHandle = closestNode.node.internals.handleBounds?.[type]?.reduce((prev, curr) => {
    const prevDistance = Math.sqrt((prev.x - props.targetX) ** 2 + (prev.y - props.targetY) ** 2);
    const currDistance = Math.sqrt((curr.x - props.targetX) ** 2 + (curr.y - props.targetY) ** 2);

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

const path = computed(() => getBezierPath(props));

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
    <circle :cx="targetX" :cy="targetY" fill="#fff" :stroke="strokeColor" :r="3" :stroke-width="1.5" />
  </g>
</template>
