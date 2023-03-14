<script lang="ts">
  import SvelteFlow, {
    Controls,
    Background,
    BackgroundVariant,
    Minimap,
    useSvelteFlow,
    type Node
  } from '../../lib/index';
  import Sidebar from './Sidebar.svelte';

  const svelteFlow = useSvelteFlow();

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    console.log(event)

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
      y: event.clientY - 40,
    });
    const newNode: Node = {
      id: `${Math.random()}`,
      type,
      position,
      data: { label: `${type} node` },
    };

    svelteFlow.nodes.update(nds => nds.concat(newNode));
  };
</script>

<main>
  <SvelteFlow
    fitView
    on:dragover={onDragOver}
    on:drop={onDrop}
  >
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <Minimap />
  </SvelteFlow>
  <Sidebar />
</main>

<style>
  main {
    height: 100%;
    display: flex;
  }
</style>