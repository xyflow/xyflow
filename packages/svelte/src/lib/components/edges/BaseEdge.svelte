<script lang="ts">
	import type { SvelteComponentTyped } from 'svelte';
  import { Position } from '@reactflow/system';

	import { useStore } from '$lib/store';
  import BezierEdge from '$lib/components/edges/StraightEdge.svelte';
	import type { EdgeProps } from '$lib/types';

  export let id: string;
  export let type: string = 'default';
  export let sourceX: number = 0;
  export let sourceY: number = 0;
  export let targetX: number = 0;
  export let targetY: number = 0;
  export let sourcePosition: Position = Position.Bottom;
  export let targetPosition: Position = Position.Top;

  const { edgeTypesStore } = useStore();
  const edgeComponent: typeof SvelteComponentTyped<EdgeProps> = $edgeTypesStore[type] || BezierEdge;
</script>

<g
  class="react-flow__edge"
  data-id={id}
>
  <svelte:component
    this={edgeComponent}
    {id}
    {sourceX}
    {sourceY}
    {targetX}
    {targetY}
    {sourcePosition}
    {targetPosition}
  />
</g>

<style>
  .react-flow__edge :global(path) {
    stroke: #ccc;
    stroke-width: 1;
    fill: none;
  }
</style>