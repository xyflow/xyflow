<script lang="ts">
  import { createEventDispatcher, type SvelteComponentTyped } from 'svelte';
  import { Position, getMarkerId } from '@xyflow/system';

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
  export let data: $$Props['data'] = {};
  export let style: $$Props['style'] = undefined;
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;
  export let targetPosition: $$Props['targetPosition'] = Position.Top;
  export let animated: $$Props['animated'] = false;
  export let selected: $$Props['selected'] = false;
  export let selectable: $$Props['selectable'] = true;
  export let label: $$Props['label'] = undefined;
  export let labelStyle: $$Props['labelStyle'] = undefined;
  export let markerStart: $$Props['markerStart'] = undefined;
  export let markerEnd: $$Props['markerEnd'] = undefined;
  export let sourceHandleId: $$Props['sourceHandleId'] = undefined;
  export let targetHandleId: $$Props['targetHandleId'] = undefined;

  // @ todo: support edge updates

  const { edges, edgeTypes, flowId, addSelectedEdges } = useStore();
  const dispatch = createEventDispatcher();

  const edgeComponent: typeof SvelteComponentTyped<EdgeProps> = $edgeTypes[type!] || BezierEdge;

  $: markerStartUrl = markerStart ? `url(#${getMarkerId(markerStart, $flowId)})` : undefined;
  $: markerEndUrl = markerEnd ? `url(#${getMarkerId(markerEnd, $flowId)})` : undefined;

  function onClick() {
    if (selectable) {
      addSelectedEdges([id]);
    }

    const edge = $edges.find((e) => e.id === id);
    dispatch('edge:click', edge);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<g class="svelte-flow__edge" class:animated class:selected data-id={id} on:click={onClick}>
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
    {labelStyle}
    {data}
    {style}
    {sourceHandleId}
    {targetHandleId}
    markerStart={markerStartUrl}
    markerEnd={markerEndUrl}
  />
</g>

<style>
  .svelte-flow__edge {
    pointer-events: visibleStroke;
    cursor: pointer;
  }
</style>
