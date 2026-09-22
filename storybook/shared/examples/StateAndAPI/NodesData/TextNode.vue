<script setup lang="ts">
import { ref } from 'vue';
import { Handle, Position, useVueFlow, type Node, type NodeProps } from '@xyflow/vue';
const props = defineProps<NodeProps<Node<{ text: string }>>>();
const text = ref(props.data.text);
const { updateNodeData } = useVueFlow();
function update(value: string) {
  text.value = value;
  updateNodeData(props.id, { text: value });
}
</script>
<template>
  <div style="background: #eee; color: #222; padding: 10px; font-size: 12px; border-radius: 10px">
    <div>node {{ id }}</div>
    <label
      >ref + updateNodeData<input
        class="nodrag nokey"
        :value="text"
        @input="update(($event.target as HTMLInputElement).value)"
    /></label>
    <label
      >updateNodeData<input
        class="nodrag nokey"
        :value="data.text"
        @input="updateNodeData(id, { text: ($event.target as HTMLInputElement).value })"
    /></label>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
<style scoped>
input {
  display: block;
}
</style>
