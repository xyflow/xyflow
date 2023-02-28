<script lang="ts">
	import type { SvelteComponentTyped } from 'svelte';
  import { Position } from '@reactflow/system';

	import { useStore } from '$lib/store';
  import BezierEdge from '$lib/components/edges/StraightEdge.svelte';
	import type { EdgeProps, WrapEdgeProps } from '$lib/types';

  type $$Props = WrapEdgeProps;

  export let id: $$Props['id'];
  export let type: $$Props['type'] = 'default';
  export let source: $$Props['source'] = '';
  export let target: $$Props['target'] = '';
  export let sourceX: $$Props['sourceX'] = 0;
  export let sourceY: $$Props['sourceY'] = 0;
  export let targetX: $$Props['targetX'] = 0;
  export let targetY: $$Props['targetY'] = 0;
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;
  export let targetPosition:  $$Props['targetPosition'] = Position.Top;
  export let animated: $$Props['animated'] = false;
  export let selected: $$Props['selected'] = false;
  export let label: $$Props['label'] = undefined;

  const { edgeTypes } = useStore();
  const edgeComponent: typeof SvelteComponentTyped<EdgeProps> = $edgeTypes[type!] || BezierEdge;
</script>

<g
  class="react-flow__edge"
  class:animated
  data-id={id}
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
  .react-flow__edge {
    pointer-events: visibleStroke;
    cursor: pointer;
  }

  .react-flow__edge :global(path) {
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
