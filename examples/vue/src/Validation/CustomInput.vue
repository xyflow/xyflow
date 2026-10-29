<script lang="ts" setup>
import type { IsValidConnection, Node, NodeProps } from '@xyflow/vue';
import { Handle, Position } from '@xyflow/vue';

type ValidationInputNode = Node<{ isValidTargetPos: IsValidConnection }, 'custominput'>;

const props = defineProps<NodeProps<ValidationInputNode>>();
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <div>Only connectable with B</div>
  <Handle type="source" :position="Position.Right" :is-valid-connection="props.data.isValidTargetPos" />
</template>
