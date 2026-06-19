<script lang="ts" setup>
import type { Edge, EdgeProps, Node } from '@xyflow/vue';
import type { Colors } from './utils';
import { VueFlow } from '@xyflow/vue';
import RGBEdge from './RGBEdge.vue';
import RGBNode from './RGBNode.vue';
import RGBOutputNode from './RGBOutputNode.vue';

const nodes = ref<Node[]>([
  { id: '1', type: 'rgb', data: { color: 'red' }, position: { x: -25, y: 50 } },
  { id: '2', type: 'rgb', data: { color: 'green' }, position: { x: 50, y: -100 } },
  { id: '3', type: 'rgb', data: { color: 'blue' }, position: { x: 0, y: 200 } },
  { id: '4', type: 'rgb-output', data: { label: 'RGB' }, position: { x: 400, y: 50 } },
]);

const edges = ref<Edge[]>([
  { id: 'e1-4', type: 'rgb-edge', data: { color: 'red' }, source: '1', target: '4', animated: true },
  { id: 'e2-4', type: 'rgb-edge', data: { color: 'green' }, source: '2', target: '4', animated: true },
  { id: 'e3-4', type: 'rgb-edge', data: { color: 'blue' }, source: '3', target: '4', animated: true },
]);

const color = ref<Record<Colors, number>>({
  red: 100,
  green: 150,
  blue: 100,
});

function onChange({ color: c, val }: { color: Colors; val: number }) {
  return (color.value[c] = Number(val));
}
</script>

<template>
  <div class="demo-flow">
    <VueFlow v-model:nodes="nodes" v-model:edges="edges">
      <template #node-rgb="props">
        <RGBNode :data="props.data as { color: Colors }" :amount="color" @change="onChange" />
      </template>

      <template #node-rgb-output>
        <RGBOutputNode :rgb="`rgb(${color.red}, ${color.green}, ${color.blue})`" />
      </template>

      <template #edge-rgb-edge="props">
        <RGBEdge
          v-bind="props as unknown as EdgeProps<Edge<{ text?: number; color?: Colors }, 'rgb-edge'>>"
          :data="{ text: color[props.data?.color as Colors], ...props.data }"
        />
      </template>
    </VueFlow>
  </div>
</template>

<style>
.demo-flow {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  border-radius: 0;
}
</style>
