<script lang="ts">
  import { writable } from 'svelte/store';
  import SvelteFlow, {
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    useSvelteFlow,
    type Node
  } from '../../lib/index';
  import Sidebar from './Sidebar.svelte';

  const nodes = writable([
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 150, y: 5 }
    },
    {
      id: '2',
      type: 'default',
      data: { label: 'Node' },
      position: { x: 0, y: 150 }
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Node' },
      position: { x: 300, y: 150 }
    }
  ]);

  const edges = writable([
    {
      id: '1-2',
      type: 'default',
      source: '1',
      target: '2',
      label: 'Edge Text'
    },
    {
      id: '1-3',
      type: 'smoothstep',
      source: '1',
      target: '3'
    }
  ]);

  const svelteFlow = useSvelteFlow();

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    console.log(event);

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (!event.dataTransfer) {
      return null;
    }

    const type = event.dataTransfer.getData('application/svelteflow');
    const position = svelteFlow.project({
      x: event.clientX,
      y: event.clientY - 40
    });
    const newNode: Node = {
      id: `${Math.random()}`,
      type,
      position,
      data: { label: `${type} node` }
    };

    svelteFlow.nodes.update((nds) => nds.concat(newNode));
  };

  $: {
    console.log($nodes);
  }
</script>

<main>
  <SvelteFlow {nodes} {edges} fitView on:dragover={onDragOver} on:drop={onDrop}>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <MiniMap />
  </SvelteFlow>
  <Sidebar />
</main>

<style>
  main {
    height: 100%;
    display: flex;
  }
</style>
