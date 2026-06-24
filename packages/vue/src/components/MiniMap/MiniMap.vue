<script lang="ts" setup>
import type { XYMinimapInstance } from '@xyflow/system';
import type { InternalNode } from '../../types';
import type { MiniMapEmits, MiniMapNodeFunc, MiniMapProps, MiniMapSlots, ShapeRendering } from './types';
import { getBoundsOfRects, getConnectedEdges, getNodeDimensions, getNodesBounds, XYMinimap } from '@xyflow/system';
import { computed, onMounted, onUnmounted, provide, shallowRef, toRef, useAttrs, watch } from 'vue';
import { storeToRefs, useStore, useVueFlow } from '../../composables';
import Panel from '../Panel/Panel.vue';
import MiniMapNode from './MiniMapNode.vue';
import { Slots } from './types';

const {
  width,
  height,
  nodeStrokeColor = 'var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default))',
  nodeColor = 'var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default))',
  nodeClassName,
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  maskColor = 'var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default))',
  position = 'bottom-right',
  maskStrokeColor = 'var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default))',
  maskStrokeWidth = 1,
  maskBorderRadius = 0,
  pannable = false,
  zoomable = false,
  ariaLabel,
  inversePan = false,
  zoomStep = 1,
  offsetScale = 5,
} = defineProps<MiniMapProps>();

const emit = defineEmits<MiniMapEmits>();

const slots = defineSlots<MiniMapSlots>();

const attrs: Record<string, any> = useAttrs();

const defaultWidth = 200;
const defaultHeight = 150;

const { id, viewport, emits } = useVueFlow();

const { nodeLookup } = useStore();

const { edges, nodes, transform, translateExtent, dimensions, panZoom, ariaLabelConfig } = storeToRefs(useStore());

// fall back to the configurable default label (`ariaLabelConfig`) when no explicit `ariaLabel` is passed
const resolvedAriaLabel = computed(() => ariaLabel ?? ariaLabelConfig.value['minimap.ariaLabel']);

const el = shallowRef<SVGElement>();

let minimapInstance: XYMinimapInstance | null = null;

provide(Slots, slots);

const elementWidth = toRef(() => width ?? attrs.style?.width ?? defaultWidth);

const elementHeight = toRef(() => height ?? attrs.style?.height ?? defaultHeight);

const shapeRendering: ShapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

const nodeColorFunc = computed<MiniMapNodeFunc>(() => (typeof nodeColor === 'string' ? () => nodeColor : nodeColor));

const nodeStrokeColorFunc = computed<MiniMapNodeFunc>(() =>
  typeof nodeStrokeColor === 'string' ? () => nodeStrokeColor : nodeStrokeColor,
);

const nodeClassNameFunc = computed<MiniMapNodeFunc>(() =>
  typeof nodeClassName === 'string' ? () => nodeClassName : typeof nodeClassName === 'function' ? nodeClassName : () => '',
);

// The minimap renders absolute positions + measured dimensions, which live on the InternalNode — iterate
// the lookup (the public `nodes` ref holds user `Node`s without `internals`).
const minimapNodes = computed(() => Array.from(nodeLookup.values()));

const bb = computed(() =>
  getNodesBounds(
    nodes.value.filter(node => !node.hidden),
    { nodeLookup },
  ),
);

const viewBB = computed(() => ({
  x: -viewport.value.x / viewport.value.zoom,
  y: -viewport.value.y / viewport.value.zoom,
  width: dimensions.value.width / viewport.value.zoom,
  height: dimensions.value.height / viewport.value.zoom,
}));

const boundingRect = computed(() => (nodes.value && nodes.value.length ? getBoundsOfRects(bb.value, viewBB.value) : viewBB.value));

const viewScale = computed(() => {
  const scaledWidth = boundingRect.value.width / elementWidth.value;
  const scaledHeight = boundingRect.value.height / elementHeight.value;

  return Math.max(scaledWidth, scaledHeight);
});

const viewBox = computed(() => {
  const viewWidth = viewScale.value * elementWidth.value;
  const viewHeight = viewScale.value * elementHeight.value;
  const offset = offsetScale * viewScale.value;

  return {
    offset,
    x: boundingRect.value.x - (viewWidth - boundingRect.value.width) / 2 - offset,
    y: boundingRect.value.y - (viewHeight - boundingRect.value.height) / 2 - offset,
    width: viewWidth + offset * 2,
    height: viewHeight + offset * 2,
  };
});

const d = computed(() => {
  if (!viewBox.value.x || !viewBox.value.y) {
    return '';
  }

  return `
    M${viewBox.value.x - viewBox.value.offset},${viewBox.value.y - viewBox.value.offset}
    h${viewBox.value.width + viewBox.value.offset * 2}
    v${viewBox.value.height + viewBox.value.offset * 2}
    h${-viewBox.value.width - viewBox.value.offset * 2}z
    M${viewBB.value.x + maskBorderRadius},${viewBB.value.y}
    h${viewBB.value.width - 2 * maskBorderRadius}
    a${maskBorderRadius},${maskBorderRadius} 0 0 1 ${maskBorderRadius},${maskBorderRadius}
    v${viewBB.value.height - 2 * maskBorderRadius}
    a${maskBorderRadius},${maskBorderRadius} 0 0 1 -${maskBorderRadius},${maskBorderRadius}
    h${-(viewBB.value.width - 2 * maskBorderRadius)}
    a${maskBorderRadius},${maskBorderRadius} 0 0 1 -${maskBorderRadius},-${maskBorderRadius}
    v${-(viewBB.value.height - 2 * maskBorderRadius)}
    a${maskBorderRadius},${maskBorderRadius} 0 0 1 ${maskBorderRadius},-${maskBorderRadius}z`;
});

onMounted(() => {
  watch(
    panZoom,
    (panZoomInstance) => {
      if (el.value && panZoomInstance) {
        minimapInstance = XYMinimap({
          domNode: el.value,
          panZoom: panZoomInstance,
          getTransform: () => transform.value,
          getViewScale: () => viewScale.value,
        });
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    minimapInstance?.destroy();
  });

  watch(
    [
      () => pannable,
      () => zoomable,
      () => inversePan,
      () => zoomStep,
      translateExtent,
      () => dimensions.value.height,
      () => dimensions.value.width,
    ],
    () => {
      minimapInstance?.update({
        translateExtent: translateExtent.value,
        width: dimensions.value.width,
        height: dimensions.value.height,
        inversePan,
        pannable,
        zoomStep,
        zoomable,
      });
    },
    { immediate: true },
  );
});

function onSvgClick(event: MouseEvent) {
  const [x, y] = minimapInstance?.pointer(event) || [0, 0];

  emit('click', { event, position: { x, y } });
}

function onNodeClick(event: MouseEvent, node: InternalNode) {
  const param = { event, node: node.internals.userNode, connectedEdges: getConnectedEdges([node], edges.value) };
  emits.miniMapNodeClick(param);
  emit('nodeClick', param);
}

function onNodeDblClick(event: MouseEvent, node: InternalNode) {
  const param = { event, node: node.internals.userNode, connectedEdges: getConnectedEdges([node], edges.value) };
  emits.miniMapNodeDoubleClick(param);
  emit('nodeDblclick', param);
}

function onNodeMouseEnter(event: MouseEvent, node: InternalNode) {
  const param = { event, node: node.internals.userNode, connectedEdges: getConnectedEdges([node], edges.value) };
  emits.miniMapNodeMouseEnter(param);
  emit('nodeMouseenter', param);
}

function onNodeMouseMove(event: MouseEvent, node: InternalNode) {
  const param = { event, node: node.internals.userNode, connectedEdges: getConnectedEdges([node], edges.value) };
  emits.miniMapNodeMouseMove(param);
  emit('nodeMousemove', param);
}

function onNodeMouseLeave(event: MouseEvent, node: InternalNode) {
  const param = { event, node: node.internals.userNode, connectedEdges: getConnectedEdges([node], edges.value) };
  emits.miniMapNodeMouseLeave(param);
  emit('nodeMouseleave', param);
}
</script>

<script lang="ts">
export default {
  name: 'MiniMap',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <Panel :class="{ pannable, zoomable }" :position="position" class="vue-flow__minimap">
    <svg
      ref="el"
      :width="elementWidth"
      :height="elementHeight"
      :viewBox="[viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(' ')"
      :aria-labelledby="`vue-flow__minimap-${id}`"
      role="img"
      @click="onSvgClick"
    >
      <title v-if="resolvedAriaLabel" :id="`vue-flow__minimap-${id}`">{{ resolvedAriaLabel }}</title>

      <!-- v-memo on the lookup entry: unchanged nodes keep their InternalNode reference across commits
      (checkEquality reuse), so drag/pan-frame MiniMap re-renders skip every untouched child instead of
      re-rendering all of them (the inline per-node prop objects/calls would otherwise always patch). The
      node*Func RESULTS are in the deps (not the fn refs) so a recolor driven by an external reactive dep
      read inside a `nodeColor`/`nodeStrokeColor`/`nodeClassName` callback still re-renders the affected
      node — memoizing the fn refs froze the color until the node itself changed -->
      <MiniMapNode
        v-for="node of minimapNodes"
        :id="node.id"
        :key="node.id"
        v-memo="[node, nodeClassNameFunc(node), nodeColorFunc(node), nodeStrokeColorFunc(node), nodeBorderRadius, nodeStrokeWidth, shapeRendering]"
        :position="node.internals.positionAbsolute"
        :dimensions="getNodeDimensions(node)"
        :selected="node.selected"
        :dragging="node.dragging"
        :style="node.style"
        :class="nodeClassNameFunc(node)"
        :color="nodeColorFunc(node)"
        :border-radius="nodeBorderRadius"
        :stroke-color="nodeStrokeColorFunc(node)"
        :stroke-width="nodeStrokeWidth"
        :shape-rendering="shapeRendering"
        :type="node.type"
        :hidden="node.hidden"
        @click="onNodeClick($event, node)"
        @dblclick="onNodeDblClick($event, node)"
        @mouseenter="onNodeMouseEnter($event, node)"
        @mousemove="onNodeMouseMove($event, node)"
        @mouseleave="onNodeMouseLeave($event, node)"
      />

      <path
        :d="d"
        :fill="maskColor"
        :stroke="maskStrokeColor"
        :stroke-width="maskStrokeWidth"
        class="vue-flow__minimap-mask"
        fill-rule="evenodd"
      />
    </svg>
  </Panel>
</template>
