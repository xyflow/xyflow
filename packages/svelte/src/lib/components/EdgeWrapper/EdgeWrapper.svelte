<script lang="ts">
  import { createEventDispatcher, type SvelteComponentTyped } from 'svelte';
  import { Position } from '@reactflow/system';

  import { useStore } from '$lib/store';
  import BezierEdge from '$lib/components/edges/BezierEdge.svelte';
  import type { EdgeProps, EdgeLayouted } from '$lib/types';

  type $$Props = EdgeLayouted;

  export let id: $$Props['id'];
  export let type: $$Props['type'] = 'default';
  export let source: $$Props['source'] = '';
  export let target: $$Props['target'] = '';
  export let sourceX: $$Props['sourceX'] = 0;
  export let sourceY: $$Props['sourceY'] = 0;
  export let targetX: $$Props['targetX'] = 0;
  export let targetY: $$Props['targetY'] = 0;
  export let sourceHandleId: $$Props['sourceHandleId'] = undefined;
  export let targetHandleId: $$Props['targetHandleId'] = undefined;
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;
  export let targetPosition: $$Props['targetPosition'] = Position.Top;
  export let animated: $$Props['animated'] = false;
  export let selected: $$Props['selected'] = false;
  export let label: $$Props['label'] = undefined;

  const { edgeTypes, edges } = useStore();
  const dispatch = createEventDispatcher();

  const edgeComponent: typeof SvelteComponentTyped<EdgeProps> = $edgeTypes[type!] || BezierEdge;

  function onClick() {
    const edge = $edges.find(e => e.id === id);
    dispatch('edge:click', edge);
  }
</script>

<g
  class="svelte-flow__edge"
  class:animated
  data-id={id}
  on:click={onClick}
>
  <svelte:component
    this={edgeComponent}
    {id}
    {source}
    {target}
    {sourceX}
    {sourceY}
    {targetX}
    {targetY}
    {sourcePosition}
    {targetPosition}
    {animated}
    {selected}
    {label}
  />
</g>

<style>
  .svelte-flow__edge {
    pointer-events: visibleStroke;
    cursor: pointer;
  }

  .svelte-flow__edge :global(path) {
    stroke: #ccc;
    stroke-width: 1;
    fill: none;
  }

  .animated :global(path) {
    stroke-dasharray: 5;
    animation: dashdraw 0.5s linear infinite;
  }

  @keyframes dashdraw {
    from {
      stroke-dashoffset: 10;
    }
  }
</style>
