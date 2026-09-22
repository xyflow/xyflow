<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import { VueFlow, Background, NodeToolbar, Position, type Node } from '@xyflow/vue';
import { demoNode, DEMO_NODE_ID, type ToolbarNodeData, type SharedNodeToolbarArgs } from './config';
import ToolbarNode from './ToolbarNode.vue';
const props = withDefaults(defineProps<SharedNodeToolbarArgs>(), { isVisible: undefined });
const nodes = shallowRef<Node<ToolbarNodeData>[]>([]);
watch(
  () => ({ ...props }),
  (args) => {
    nodes.value = [{ ...demoNode(args), class: 'vue-flow__node-default' } as Node<ToolbarNodeData>];
  },
  { immediate: true }
);
</script>
<template>
  <VueFlow v-model:nodes="nodes" fit-view :min-zoom="0.5" :max-zoom="2">
    <template #node-ToolbarNode="node"><ToolbarNode v-bind="node" /></template>
    <Background />
    <NodeToolbar
      v-if="props.renderMode === 'external'"
      :node-id="props.nodeId || DEMO_NODE_ID"
      :is-visible="props.isVisible"
      :position="props.position as Position"
      :offset="props.offset"
      :align="props.align"
    >
      <button>delete</button><button>copy</button><button>expand</button>
    </NodeToolbar>
  </VueFlow>
</template>
