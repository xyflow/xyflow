<script lang="ts" setup>
import { Panel, useVueFlow, VueFlow } from '@xyflow/vue';
import Icon from './Icon.vue';
import useStore from './store';

const store = useStore();

const { onConnect, addEdges } = useVueFlow();

onConnect(params => addEdges([params]));
</script>

<template>
  <VueFlow v-model:nodes="store.nodes" v-model:edges="store.edges" class="pinia-flow" fit-view>
    <Panel position="top-right">
      <div class="buttons-panel">
        <button @click="store.updatePositions">
          <Icon name="shuffle" />
        </button>
        <button @click="store.toggleClass">
          <Icon name="moon" />
        </button>
        <button @click="store.log">
          <Icon name="log" />
        </button>
        <button @click="store.reset">
          <Icon name="reset" />
        </button>
      </div>
    </Panel>
  </VueFlow>
</template>

<style>
.pinia-flow {
  background-color: #1a192b;
  height: 100%;
  width: 100%;
}

.buttons-panel {
  display: flex;
  gap: 10px;
}

.vue-flow__panel {
  background-color: #2d3748;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.vue-flow__panel button {
  border: none;
  cursor: pointer;
  background-color: #4a5568;
  border-radius: 8px;
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 40px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vue-flow__panel button:hover {
  background-color: #2563eb;
  transition: background-color 0.2s;
}

.vue-flow__node.dark {
  background-color: #2d3748;
  color: white;
}
</style>
