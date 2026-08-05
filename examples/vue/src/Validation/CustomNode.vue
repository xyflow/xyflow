<script lang="ts" setup>
import type { IsValidConnection, Node, NodeProps } from '@xyflow/vue';
import { Handle, Position } from '@xyflow/vue';

type ValidationNode = Node<{ isValidSourcePos: IsValidConnection }, 'customnode'>;

const props = defineProps<NodeProps<ValidationNode>>();
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <Handle type="target" :position="Position.Left" :is-valid-connection="props.data.isValidSourcePos" />
  <div>{{ props.id }}</div>
</template>
