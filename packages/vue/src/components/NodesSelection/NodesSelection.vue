<script lang="ts" setup>
import type { InternalNode } from '../../types';
import { getNodesBounds } from '@xyflow/system';
import { computed, onMounted, shallowRef } from 'vue';
import { storeToRefs, useDrag, useStore, useUpdateNodePositions, useVueFlow } from '../../composables';
import { arrowKeyDiffs } from '../../utils';

const { emits, viewport, getSelectedNodes } = useVueFlow();

const { nodeLookup } = useStore();

const { noPanClassName, disableKeyboardA11y, userSelectionActive } = storeToRefs(useStore());

const updatePositions = useUpdateNodePositions();

const el = shallowRef<HTMLDivElement | null>(null);

const dragging = useDrag({
  el,
  onStart(args) {
    emits.selectionDragStart(args);
    emits.nodeDragStart(args);
  },
  onDrag(args) {
    emits.selectionDrag(args);
    emits.nodeDrag(args);
  },
  onStop(args) {
    emits.selectionDragStop(args);
    emits.nodeDragStop(args);
  },
});

onMounted(() => {
  if (!disableKeyboardA11y.value) {
    el.value?.focus({ preventScroll: true });
  }
});

// getSelectedNodes is readonly (public guard); getNodesBounds only reads it (dims come from nodeLookup)
const selectedNodesBBox = computed(() => getNodesBounds(getSelectedNodes.value as InternalNode[], { nodeLookup }));

const innerStyle = computed(() => ({
  width: `${selectedNodesBBox.value.width}px`,
  height: `${selectedNodesBBox.value.height}px`,
  top: `${selectedNodesBBox.value.y}px`,
  left: `${selectedNodesBBox.value.x}px`,
}));

function onContextMenu(event: MouseEvent) {
  emits.selectionContextMenu({ event, nodes: [...getSelectedNodes.value] });
}

function onKeyDown(event: KeyboardEvent) {
  if (disableKeyboardA11y.value) {
    return;
  }

  if (arrowKeyDiffs[event.key]) {
    event.preventDefault();

    updatePositions(
      {
        x: arrowKeyDiffs[event.key].x,
        y: arrowKeyDiffs[event.key].y,
      },
      event.shiftKey,
    );
  }
}
</script>

<script lang="ts">
export default {
  name: 'NodesSelection',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <div
    v-if="!userSelectionActive && selectedNodesBBox.width && selectedNodesBBox.height"
    class="vue-flow__nodesselection vue-flow__container"
    :class="noPanClassName"
    :style="{ transform: `translate(${viewport.x}px,${viewport.y}px) scale(${viewport.zoom})` }"
  >
    <div
      ref="el"
      :class="{ dragging }"
      class="vue-flow__nodesselection-rect"
      :style="innerStyle"
      :tabindex="disableKeyboardA11y ? undefined : -1"
      @contextmenu="onContextMenu"
      @keydown="onKeyDown"
    />
  </div>
</template>
