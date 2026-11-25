<script setup lang="ts">
import type { Node, NodeProps } from '@xyflow/vue';
import type { Operator, OperatorNodeData } from './types';
import { Handle, Position, useVueFlow } from '@xyflow/vue';
import Icon from './Icon.vue';

const props = defineProps<Pick<NodeProps<Node<OperatorNodeData, 'operator'>>, 'id' | 'data'>>();

const operators: Operator[] = ['+', '-', '*', '/'];

const { updateNodeData } = useVueFlow();
</script>

<template>
  <label :for="`${id}-operator`">Operator</label>

  <div class="buttons nodrag">
    <button
      v-for="operator of operators"
      :key="`${id}-${operator}-operator`"
      :class="{ selected: data.operator === operator }"
      @click="updateNodeData(props.id, { operator })"
    >
      <Icon :name="operator" />
    </button>
  </div>

  <Handle type="source" :position="Position.Right" :is-connectable="false" />
  <Handle id="target-a" type="target" :position="Position.Left" :is-connectable="false" />
  <Handle id="target-b" type="target" :position="Position.Left" :is-connectable="false" />
</template>
