<script lang="ts" setup>
import { Handle, Position, storeToRefs, useStore } from '@xyflow/vue';
import { computed } from 'vue';

const props = defineProps<{ id: string }>();

const { connectionStartHandle } = storeToRefs(useStore());

const isTarget = computed(() => connectionStartHandle.value && connectionStartHandle.value.nodeId !== props.id);
</script>

<template>
  <div class="customNode">
    <div
      class="customNodeBody"
      :style="{
        borderStyle: isTarget ? 'dashed' : 'solid',
        backgroundColor: isTarget ? '#ffcce3' : '#ccd9f6',
      }"
    >
      <Handle class="targetHandle" style="z-index: 2" :position="Position.Right" type="source" is-connectable />
      <Handle class="targetHandle" :style="{ zIndex: isTarget ? 3 : 1 }" :position="Position.Left" type="target" is-connectable />
      {{ isTarget ? 'Drop here' : 'Drag to connect' }}
    </div>
  </div>
</template>

<style>
.customNodeBody {
  width: 150px;
  height: 80px;
  border: 3px solid black;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.customNode:before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  height: 20px;
  width: 40px;
  transform: translate(-50%, 0);
  background: #d6d5e6;
  z-index: 1000;
  line-height: 1;
  border-radius: 4px;
  color: #fff;
  font-size: 9px;
  border: 2px solid #222138;
}

.sourceHandle {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0;
  transform: none;
  border: none;
  opacity: 0;
}

.targetHandle {
  width: 100%;
  height: 100%;
  background: blue;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0;
  transform: none;
  border: none;
  opacity: 0;
}
</style>
