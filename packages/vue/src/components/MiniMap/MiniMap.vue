<script lang="ts" setup>
import type { XYMinimapInstance } from '@xyflow/system';
import type { InternalNode } from '../../types';
import type { MiniMapEmits, MiniMapNodeFunc, MiniMapProps, MiniMapSlots, ShapeRendering } from './types';
import { getBoundsOfRects, getConnectedEdges, getNodeDimensions, getNodesBounds, isNumeric, XYMinimap } from '@xyflow/system';
import { computed, onMounted, onUnmounted, provide, shallowRef, toRef, useAttrs, watch } from 'vue';
import { storeToRefs, useVueFlow, useVueFlowStore } from '../../composables';
import Panel from '../Panel/Panel.vue';
import MiniMapNode from './MiniMapNode.vue';
import { Slots } from './types';

const {
  width,
  height,
  nodeStrokeColor,
  nodeColor,
  nodeClassName,
  nodeBorderRadius = 5,
  nodeStrokeWidth,
  bgColor,
  maskColor,
  position = 'bottom-right',
  maskStrokeColor,
  maskStrokeWidth,
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

provide(Slots, slots);

const defaultWidth = 200;
const defaultHeight = 150;

const { id, viewport, emits } = useVueFlow();

const { nodeLookup } = useVueFlowStore();

const { edges, nodes, transform, translateExtent, dimensions, panZoom, ariaLabelConfig } = storeToRefs(useVueFlowStore());

const el = shallowRef<SVGElement>();

let minimapInstance: XYMinimapInstance | null = null;

const resolvedAriaLabel = computed(() => ariaLabel ?? ariaLabelConfig.value['minimap.ariaLabel']);

const elementWidth = toRef(() => width ?? attrs.style?.width ?? defaultWidth);

const elementHeight = toRef(() => height ?? attrs.style?.height ?? defaultHeight);

const shapeRendering: ShapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

const nodeColorFunc = computed(() => getAttrFunction(nodeColor));

const nodeStrokeColorFunc = computed(() => getAttrFunction(nodeStrokeColor));

const nodeClassNameFunc = computed(() => getAttrFunction(nodeClassName));

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

const minimapStyle = computed(() => ({
  '--xy-minimap-background-color-props': bgColor,
  '--xy-minimap-mask-background-color-props': maskColor,
  '--xy-minimap-mask-stroke-color-props': maskStrokeColor,
  '--xy-minimap-mask-stroke-width-props':
    typeof maskStrokeWidth === 'number' ? maskStrokeWidth * viewScale.value : undefined,
  '--xy-minimap-node-background-color-props': typeof nodeColor === 'string' ? nodeColor : undefined,
  '--xy-minimap-node-stroke-color-props': typeof nodeStrokeColor === 'string' ? nodeStrokeColor : undefined,
  '--xy-minimap-node-stroke-width-props': nodeStrokeWidth,
}));

const d = computed(() => {
  if (!isNumeric(viewBox.value.x) || !isNumeric(viewBox.value.y)) {
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

onUnmounted(() => {
  minimapInstance?.destroy();
});

function getAttrFunction(attr: string | MiniMapNodeFunc | undefined): MiniMapNodeFunc {
  return typeof attr === 'function' ? attr : () => attr;
}

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
  <Panel :class="{ pannable, zoomable }" :style="minimapStyle" :position="position" class="vue-flow__minimap">
    <svg
      ref="el"
      :width="elementWidth"
      :height="elementHeight"
      :viewBox="[viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(' ')"
      :aria-labelledby="`vue-flow__minimap-${id}`"
      role="img"
      class="vue-flow__minimap-svg"
      @click="onSvgClick"
    >
      <title v-if="resolvedAriaLabel" :id="`vue-flow__minimap-${id}`">{{ resolvedAriaLabel }}</title>

      <!-- v-memo on the lookup entry: unchanged nodes keep their InternalNode reference across commits, so
      drag/pan-frame re-renders skip untouched children. The node*Func RESULTS are in the deps (not the fn
      refs) so a recolor driven by a reactive read inside a `nodeColor`/`nodeStrokeColor`/`nodeClassName`
      callback still re-renders the affected node -->
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

      <path :d="d" class="vue-flow__minimap-mask" fill-rule="evenodd" pointer-events="none" />
    </svg>
  </Panel>
</template>
