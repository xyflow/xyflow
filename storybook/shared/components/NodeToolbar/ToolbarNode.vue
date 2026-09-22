<script setup lang="ts">
import { Handle, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/vue';
import type { ToolbarNodeData } from './config';
defineProps<NodeProps<Node<ToolbarNodeData>>>();
</script>
<template>
  <NodeToolbar
    v-if="data.renderMode !== 'external'"
    :is-visible="data.isVisible"
    :position="data.position as Position"
    :offset="data.offset"
    :align="data.align"
  >
    <button>delete</button><button>copy</button><button>expand</button>
  </NodeToolbar>
  <Handle type="target" :position="Position.Top" />
  {{ data.label }}
  <Handle type="source" :position="Position.Bottom" />
</template>
