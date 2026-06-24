<script lang="ts" setup>
import type { NodeProps } from '@xyflow/vue';
import { getNodesInside, Handle, Position, useStore, useVueFlow } from '@xyflow/vue';

const props = defineProps<NodeProps>();

const { onNodeDragStop, viewport, updateNodeData } = useVueFlow();

const { nodeLookup } = useStore();

onNodeDragStop(({ node }) => {
  const nodes = getNodesInside(
    nodeLookup,
    {
      x: props.positionAbsoluteX,
      y: props.positionAbsoluteY,
      width: props.width ?? 0,
      height: props.height ?? 0,
    },
    [viewport.value.x, viewport.value.y, viewport.value.zoom],
  );
  if (nodes.some(n => n.id === node.id && n.id !== props.id)) {
    updateNodeData(node.id, {
      label: `In ${props.id}`,
      group: props.id,
    });
  }
  else if (node.data?.group === props.id) {
    updateNodeData(node.id, {
      group: undefined,
      label: node.id,
    });
  }
});
</script>

<template>
  <div class="vue-flow__group-node">
    <Handle type="target" :position="Position.Top" />

    <strong>Group {{ data.label }}</strong>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style>
.vue-flow__group-node {
  padding: 15px;
  width: 300px;
  height: 300px;
  border: solid 1px black;
}
</style>
