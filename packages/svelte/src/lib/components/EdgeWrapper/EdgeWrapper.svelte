<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getMarkerId } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import BezierEdge from '$lib/components/edges/BezierEdge.svelte';
  import type { EdgeLayouted } from '$lib/types';

  type $$Props = EdgeLayouted;

  export let id: $$Props['id'];
  export let type: $$Props['type'] = 'default';
  export let source: $$Props['source'] = '';
  export let target: $$Props['target'] = '';
  export let data: $$Props['data'] = {};
  export let style: $$Props['style'] = undefined;

  export let animated: $$Props['animated'] = false;
  export let selected: $$Props['selected'] = false;
  export let selectable: $$Props['selectable'] = true;
  export let hidden: $$Props['hidden'] = false;
  export let label: $$Props['label'] = undefined;
  export let labelStyle: $$Props['labelStyle'] = undefined;
  export let markerStart: $$Props['markerStart'] = undefined;
  export let markerEnd: $$Props['markerEnd'] = undefined;
  export let sourceHandle: $$Props['sourceHandle'] = undefined;
  export let targetHandle: $$Props['targetHandle'] = undefined;
  export let sourceX: $$Props['sourceX'];
  export let sourceY: $$Props['sourceY'];
  export let targetX: $$Props['targetX'];
  export let targetY: $$Props['targetY'];
  export let sourcePosition: $$Props['sourcePosition'];
  export let targetPosition: $$Props['targetPosition'];
  export let ariaLabel: $$Props['ariaLabel'] = undefined;
  // @ todo: support edge updates

  const { edges, edgeTypes, flowId, addSelectedEdges } = useStore();
  const dispatch = createEventDispatcher();

  $: edgeComponent = $edgeTypes[type!] || BezierEdge;
  $: markerStartUrl = markerStart ? `url(#${getMarkerId(markerStart, $flowId)})` : undefined;
  $: markerEndUrl = markerEnd ? `url(#${getMarkerId(markerEnd, $flowId)})` : undefined;

  function onClick() {
    if (selectable) {
      addSelectedEdges([id]);
    }

    const edge = $edges.find((e) => e.id === id);
    dispatch('edgeclick', edge);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if !hidden}
  <g
    class="svelte-flow__edge"
    class:animated
    class:selected
    data-id={id}
    on:click={onClick}
    aria-label={ariaLabel === null
      ? undefined
      : ariaLabel
      ? ariaLabel
      : `Edge from ${source} to ${target}`}
    role="img"
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
      {labelStyle}
      {data}
      {style}
      sourceHandleId={sourceHandle}
      targetHandleId={targetHandle}
      markerStart={markerStartUrl}
      markerEnd={markerEndUrl}
    />
  </g>
{/if}
