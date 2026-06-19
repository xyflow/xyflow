import type { Edge, Node } from '@xyflow/vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useStore = defineStore('vue-flow-pinia', () => {
  const nodes = ref<Node[]>([
    {
      id: '1',
      type: 'input',
      data: { label: 'Node 1' },
      position: { x: 250, y: 5 },
      class: 'light',
    },
    {
      id: '2',
      data: { label: 'Node 2' },
      position: { x: 100, y: 100 },
      class: 'light',
    },
    {
      id: '3',
      data: { label: 'Node 3' },
      position: { x: 400, y: 100 },
      class: 'light',
    },
    {
      id: '4',
      data: { label: 'Node 4' },
      position: { x: 400, y: 200 },
      class: 'light',
    },
  ]);

  const edges = ref<Edge[]>([
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
  ]);

  const reset = () => {
    edges.value = [];
    nodes.value = [];
  };

  const log = () => {
    console.log('nodes', nodes.value, 'edges', edges.value);
  };

  const toggleClass = () => {
    nodes.value = nodes.value.map((node) => {
      return {
        ...node,
        class: node.class === 'dark' ? 'light' : 'dark',
      };
    });
  };

  const updatePositions = () => {
    nodes.value = nodes.value.map((node) => {
      return {
        ...node,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
      };
    });
  };

  return {
    nodes,
    edges,
    reset,
    log,
    toggleClass,
    updatePositions,
  };
});

export default useStore;
