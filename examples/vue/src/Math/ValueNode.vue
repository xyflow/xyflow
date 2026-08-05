<script setup lang="ts">
import type { Node, NodeProps } from '@xyflow/vue';
import type { ValueNodeData } from './types';
import { Handle, Position, useVueFlow } from '@xyflow/vue';

const props = defineProps<Pick<NodeProps<Node<ValueNodeData, 'value'>>, 'id' | 'data'>>();

const { updateNodeData } = useVueFlow();

const value = computed({
  get: () => props.data.value,
  set: value => updateNodeData(props.id, { value }),
});
</script>

<template>
  <label :for="`${id}-input`">Value</label>
  <input :id="`${id}-input`" v-model="value" type="number" class="nodrag">

  <Handle type="source" :position="Position.Right" :is-connectable="false" />
</template>
