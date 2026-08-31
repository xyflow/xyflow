<script lang="ts" setup>
import type { EdgeProps } from '@xyflow/vue';
import type { ProcessEdge } from '.';
import type { ProcessNode } from '../nodes';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, useNodesData, useVueFlow } from '@xyflow/vue';
import { computed, ref, watch } from 'vue';
import { ProcessStatus } from '../nodes';

const props = defineProps<EdgeProps<ProcessEdge>>();

const { updateEdgeData } = useVueFlow();

/**
 * We call `useNodesData` to get the data of the source and target nodes, which
 * contain the information about the status of each nodes' process.
 */
const nodesData = useNodesData<ProcessNode>(() => [props.target, props.source]);

const labelRef = ref<HTMLDivElement | null>(null);

const edgeRef = ref();

/**
 * We extract the source and target node data from the nodes data.
 * We only need the first element of the array since we are only connecting two nodes.
 */
const targetNodeData = computed(() => nodesData.value[0].data);

const sourceNodeData = computed(() => nodesData.value[1].data);

const isAnimating = computed({
  get: () => props.data?.isAnimating || false,
  set: (value) => {
    updateEdgeData(props.id, { isAnimating: value });
  },
});

let animation: Animation | null = null;

const path = computed(() => getSmoothStepPath(props));

const edgeColor = computed(() => {
  switch (targetNodeData.value.status) {
    case ProcessStatus.ERROR:
      return '#f87171';
    case ProcessStatus.FINISHED:
      return '#42B983';
    case ProcessStatus.CANCELLED:
    case ProcessStatus.SKIPPED:
      return '#fbbf24';
    case ProcessStatus.RUNNING:
      return '#2563eb';
    default:
      return '#6b7280';
  }
});

// Cancel the animation if the target nodes' process was cancelled
watch(
  () => targetNodeData.value.status === ProcessStatus.CANCELLED,
  (isCancelled) => {
    if (isCancelled) {
      animation?.cancel();
    }
  },
);

// Run the animation when the source nodes' process is finished
watch(
  () => sourceNodeData.value.status === ProcessStatus.FINISHED,
  (isFinished) => {
    if (isFinished) {
      runAnimation();
    }
  },
);

function runAnimation() {
  const pathEl = edgeRef.value?.pathEl;
  const labelEl = labelRef.value;

  if (!pathEl || !labelEl) {
    console.warn('Path or label element not found');
    return;
  }

  const totalLength = pathEl.getTotalLength();

  isAnimating.value = true;

  // We need to wait for the next tick to ensure that the label element is rendered
  nextTick(() => {
    const keyframes = [{ offsetDistance: '0%' }, { offsetDistance: '100%' }];

    // use path length as a possible measure for the animation duration
    const pathLengthDuration = totalLength * 10;

    /**
     * We animate the label element along the path of the edge using the `offsetDistance` property and
     * the Web Animations API.
     *
     * The `animate` method returns an `Animation` object that we can use to listen to events like `finish` or `cancel`.
     *
     * The animation duration is calculated based on the total length of the path and clamped between 1.5s and 3s.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
     */
    const labelAnimation = labelEl.animate(keyframes, {
      duration: Math.min(Math.max(pathLengthDuration, 1500), 3000), // clamp duration between 1.5s and 3s
      direction: 'normal',
      easing: 'ease-in-out',
      iterations: 1,
    });

    const handleAnimationEnd = () => {
      isAnimating.value = false;
    };

    labelAnimation.onfinish = handleAnimationEnd;
    labelAnimation.oncancel = handleAnimationEnd;
    animation = labelAnimation;
  });
}
</script>

<script lang="ts">
export default {
  name: 'AnimationEdge',
  inheritAttrs: false,
};
</script>

<template>
  <BaseEdge :id="id" ref="edgeRef" :path="path[0]" :style="{ stroke: edgeColor }" />

  <EdgeLabelRenderer>
    <div
      ref="labelRef"
      :style="{
        visibility: isAnimating ? 'visible' : 'hidden',
        position: 'absolute',
        zIndex: 1,
        offsetPath: `path('${path[0]}')`,
        offsetRotate: '0deg',
        offsetAnchor: 'center',
      }"
    >
      <span class="truck">
        <span class="box">📦</span>
        🚚
      </span>
    </div>
  </EdgeLabelRenderer>
</template>

<style scoped>
.truck {
  position: relative;
  display: inline-block;
  transform: scaleX(-1);
}

.box {
  position: absolute;
  top: -10px;
}
</style>
