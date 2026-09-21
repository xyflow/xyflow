<script setup lang="ts">
import type { Node, NodeProps } from '@xyflow/vue';
import { Handle, NodeToolbar, Position } from '@xyflow/vue';

type ToolbarData = {
  label: string;
  toolbarPosition?: Position;
  toolbarAlign?: 'start' | 'center' | 'end';
  toolbarVisible?: boolean;
};

const props = defineProps<NodeProps<Node<ToolbarData>>>();
</script>

<template>
  <!-- data-id lets the e2e suite locate the teleported toolbar element and compare it against its node -->
  <NodeToolbar
    v-bind="{ 'data-id': props.id }"
    :is-visible="props.data.toolbarVisible"
    :position="props.data.toolbarPosition"
    :align="props.data.toolbarAlign"
  >
    <button>delete</button>
    <button>copy</button>
    <button>expand</button>
  </NodeToolbar>
  <div>{{ props.data.label }}</div>
  <Handle type="target" :position="Position.Left" />
  <Handle type="source" :position="Position.Right" />
</template>
