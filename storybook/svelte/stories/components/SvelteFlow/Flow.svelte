<script lang="ts">
  import {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    SvelteFlow,
    addEdge,
    type Connection,
    type Edge,
    type Viewport,
  } from '@xyflow/svelte';

  import { baseEdges, baseNodes, type SvelteFlowStoryArgs } from './config';
  import { EVENT_HANDLER_ARG_NAMES, type EventHandlerArgName } from './eventHandlers';

  type Props = SvelteFlowStoryArgs & Partial<Record<EventHandlerArgName, (...args: unknown[]) => unknown>>;

  let props: Props = $props();

  let nodes = $state.raw([...baseNodes]);
  let edges = $state.raw([...baseEdges]);
  let viewport = $state<Viewport>(props.viewport ?? props.initialViewport ?? { x: 0, y: 0, zoom: 1 });

  const useControlledViewport = $derived(props.useControlledViewport ?? false);

  const flowProps = $derived.by(() => {
    const next: Record<string, unknown> = { ...props };

    for (const key of EVENT_HANDLER_ARG_NAMES) {
      delete next[key];
    }

    delete next.useControlledViewport;
    delete next.viewport;

    return next as SvelteFlowStoryArgs;
  });

  const wrapperStyle = $derived({
    width: flowProps.width ? `${flowProps.width}px` : '100%',
    height: flowProps.height ? `${flowProps.height}px` : '100%',
    minHeight: flowProps.height ? undefined : '100%',
  });

  function pickEventHandlers() {
    const handlers: Record<string, unknown> = {};

    for (const key of EVENT_HANDLER_ARG_NAMES) {
      if (key === 'onconnect' || key === 'onreconnect' || key === 'isValidConnection' || key === 'onbeforedelete') {
        continue;
      }

      if (props[key]) {
        handlers[key] = props[key];
      }
    }

    return handlers;
  }

  function handleConnect(connection: Connection) {
    props.onconnect?.(connection);
    edges = addEdge(connection, edges);
  }

  function handleReconnect(oldEdge: Edge, connection: Connection) {
    props.onreconnect?.(oldEdge, connection);
    edges = edges.map((edge) =>
      edge.id === oldEdge.id
        ? {
            ...edge,
            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            targetHandle: connection.targetHandle,
          }
        : edge
    );
  }

  function handleIsValidConnection(connection: Connection) {
    if (props.isValidConnection) {
      return props.isValidConnection(connection);
    }

    return connection.source !== connection.target;
  }

  async function handleBeforeDelete(params: unknown) {
    if (!props.onbeforedelete) {
      return true;
    }

    return props.onbeforedelete(params);
  }
</script>

<div style={wrapperStyle}>
  {#if useControlledViewport}
    <SvelteFlow
      {...flowProps}
      {...pickEventHandlers()}
      bind:nodes
      bind:edges
      bind:viewport
      fitView={false}
      onconnect={handleConnect}
      onreconnect={handleReconnect}
      isValidConnection={handleIsValidConnection}
      onbeforedelete={handleBeforeDelete}
    >
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
      <Controls />
    </SvelteFlow>
  {:else}
    <SvelteFlow
      {...flowProps}
      {...pickEventHandlers()}
      bind:nodes
      bind:edges
      onconnect={handleConnect}
      onreconnect={handleReconnect}
      isValidConnection={handleIsValidConnection}
      onbeforedelete={handleBeforeDelete}
    >
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
      <Controls />
    </SvelteFlow>
  {/if}
</div>

<style>
  div :global(.svelte-flow) {
    width: 100%;
    height: 100%;
  }
</style>
