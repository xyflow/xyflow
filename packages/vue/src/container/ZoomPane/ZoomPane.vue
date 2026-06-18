<script setup lang="ts">
import { XYPanZoom } from '@xyflow/system';
import { onMounted, onUnmounted, toRef, watch } from 'vue';
import { storeToRefs, useKeyPress, useStore, useVueFlow } from '../../composables';
import { useFitViewOnInit } from '../../composables/useFitViewOnInit';
import { useResizeHandler } from '../../composables/useResizeHandler';
import EdgeRenderer from '../EdgeRenderer/EdgeRenderer.vue';
import NodeRenderer from '../NodeRenderer/NodeRenderer.vue';
import Pane from '../Pane/Pane.vue';
import Viewport from '../Viewport/Viewport.vue';

const { id, emits } = useVueFlow();

const {
  transform,
  viewportRef: zoomPane,
  panZoom,
  paneDragging,
  userSelectionActive,
  zoomActivationKeyCode,
  minZoom,
  maxZoom,
  translateExtent,
  defaultViewport,
  zoomOnScroll,
  zoomOnPinch,
  panOnScroll,
  panOnScrollSpeed,
  panOnScrollMode,
  zoomOnDoubleClick,
  panOnDrag,
  preventScrolling,
  noPanClassName,
  noWheelClassName,
  panActivationKeyCode,
  selectionKeyCode,
  selectionOnDrag,
  paneClickDistance,
  connectionStartHandle,
} = storeToRefs(useStore());

const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);

const panKeyPressed = useKeyPress(panActivationKeyCode);

const selectionKeyPressed = useKeyPress(selectionKeyCode);

const shouldPanOnDrag = toRef(() => !selectionKeyPressed.value && (panKeyPressed.value || panOnDrag.value));

const shouldPanOnScroll = toRef(() => panKeyPressed.value || panOnScroll.value);

// selection-on-drag is active when the user opted in AND a left-drag wouldn't pan (so it selects instead)
const selectionOnDragActive = toRef(() => selectionOnDrag.value === true && shouldPanOnDrag.value !== true);

const isSelecting = toRef(() => selectionKeyPressed.value || selectionOnDragActive.value);

useResizeHandler(zoomPane);

// drives the `fitView` prop's initial fit (waits for nodes + re-fits while the container settles)
useFitViewOnInit();

onUnmounted(() => panZoom.value?.destroy());

onMounted(() => {
  if (zoomPane.value) {
    const panZoomInstance = XYPanZoom({
      domNode: zoomPane.value,
      minZoom: minZoom.value,
      maxZoom: maxZoom.value,
      translateExtent: translateExtent.value,
      viewport: { x: transform.value[0], y: transform.value[1], zoom: transform.value[2], ...defaultViewport.value },
      onDraggingChange: isDraggingPane => (paneDragging.value = isDraggingPane),
      onPanZoomStart: (event, viewport) => {
        emits.moveStart({ event, viewport });
        emits.viewportChangeStart(viewport);
      },
      // `viewportChange` is emitted once per transform by `onTransformChange` below (which fires for both
      // user gestures and programmatic changes) — emitting it here too would double-fire it every frame.
      onPanZoom: (event, viewport) => {
        emits.move({ event, viewport });
      },
      onPanZoomEnd: (event, viewport) => {
        emits.moveEnd({ event, viewport });
        emits.viewportChangeEnd(viewport);
      },
    });

    const initialViewport = panZoomInstance.getViewport();
    transform.value = [initialViewport.x, initialViewport.y, initialViewport.zoom];
    panZoom.value = panZoomInstance;

    watch(
      [
        zoomOnScroll,
        zoomOnPinch,
        shouldPanOnScroll,
        panOnScrollSpeed,
        panOnScrollMode,
        zoomOnDoubleClick,
        shouldPanOnDrag,
        zoomActivationKeyPressed,
        preventScrolling,
        noPanClassName,
        userSelectionActive,
        noWheelClassName,
        paneClickDistance,
        selectionOnDragActive,
        connectionStartHandle,
      ],
      () => {
        panZoom.value?.update({
          zoomOnScroll: zoomOnScroll.value,
          zoomOnPinch: zoomOnPinch.value,
          panOnScroll: shouldPanOnScroll.value,
          panOnScrollSpeed: panOnScrollSpeed.value,
          panOnScrollMode: panOnScrollMode.value,
          zoomOnDoubleClick: zoomOnDoubleClick.value,
          panOnDrag: shouldPanOnDrag.value,
          zoomActivationKeyPressed: zoomActivationKeyPressed.value,
          preventScrolling: preventScrolling.value,
          noPanClassName: noPanClassName.value,
          userSelectionActive: userSelectionActive.value,
          noWheelClassName: noWheelClassName.value,
          paneClickDistance: paneClickDistance.value,
          // when selecting on drag, d3-zoom's click distance is set to Infinity so it never swallows the
          // gesture as a click — letting `paneClick` fire (xyflow/react #5572)
          selectionOnDrag: selectionOnDragActive.value,
          onTransformChange: (nextTransform) => {
            emits.viewportChange({ x: nextTransform[0], y: nextTransform[1], zoom: nextTransform[2] });
            transform.value = nextTransform;
          },
          connectionInProgress: !!connectionStartHandle.value,
          lib: 'vue',
        });
      },
      { immediate: true },
    );
  }
});
</script>

<script lang="ts">
export default {
  name: 'ZoomPane',
};
</script>

<template>
  <div ref="zoomPane" :key="`viewport-${id}`" class="vue-flow__viewport vue-flow__container">
    <Pane
      :is-selecting="isSelecting"
      :selection-key-pressed="selectionKeyPressed"
      :class="{ connecting: !!connectionStartHandle, dragging: paneDragging, draggable: shouldPanOnDrag }"
    >
      <Viewport>
        <EdgeRenderer />

        <div class="vue-flow__edgelabel-renderer" />

        <NodeRenderer />

        <slot />
      </Viewport>
    </Pane>
  </div>
</template>
