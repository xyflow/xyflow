<script lang="ts" setup>
function onDragStart(event: DragEvent, nodeType: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }
}
</script>

<template>
  <aside>
    <div class="description">
      You can drag these nodes to the pane on the left.
    </div>
    <div class="vue-flow__node-input" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'input')">
      Input Node
    </div>
    <div class="vue-flow__node-default" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'default')">
      Default Node
    </div>
    <div class="vue-flow__node-output" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'output')">
      Output Node
    </div>
  </aside>
</template>
