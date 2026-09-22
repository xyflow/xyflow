<script setup lang="ts">
import { markRaw } from 'vue';
import { VueFlow, Controls } from '@xyflow/vue';
import { initialNodes, initialEdges } from './config';
import { useFlowFixture } from '../../vue/useFlowFixture';
import ResizeNode from './ResizeNode.vue';
defineProps<{ snapToGrid?: boolean }>();
const { nodes, edges, onConnect } = useFlowFixture({ nodes: initialNodes, edges: initialEdges });
const extent = initialNodes.find((node) => node.type === 'fixedExtent')?.data?.extent as
  | [[number, number], [number, number]]
  | undefined;
const nodeTypes = Object.fromEntries(
  ['defaultResizer', 'customResizer', 'verticalResizer', 'horizontalResizer', 'bottomRightResizer', 'fixedExtent'].map(
    (type) => [type, markRaw(ResizeNode)]
  )
);
</script>
<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :node-types="nodeTypes"
    :snap-to-grid="snapToGrid"
    :snap-grid="[10, 10]"
    :min-zoom="0.2"
    :max-zoom="5"
    fit-view
    only-render-visible-elements
    @connect="onConnect"
    ><Controls />
    <template #zoom-pane>
      <div
        v-if="extent"
        :style="{
          position: 'absolute',
          transform: 'translate(' + extent[0][0] + 'px,' + extent[0][1] + 'px)',
          width: extent[1][0] - extent[0][0] + 'px',
          height: extent[1][1] - extent[0][1] + 'px',
          background: 'rgb(255 0 0 / 25%)',
          pointerEvents: 'none',
        }"
      /> </template
  ></VueFlow>
</template>
