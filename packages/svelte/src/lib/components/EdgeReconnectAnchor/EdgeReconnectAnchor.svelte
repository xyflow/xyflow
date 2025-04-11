<script lang="ts">
  import { useStore } from '$lib/store';
  import type { Edge } from '$lib/types';
  import { XYHandle, type HandleType, type XYPosition } from '@xyflow/system';
  import { getContext, type Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { portal } from '$lib/actions/portal';

  let {
    type,
    reconnecting = $bindable(false),
    position,
    class: className,
    size = 25,
    style,
    children,
    asDomNode = false
  }: {
    type: HandleType;
    reconnecting?: boolean;
    style?: string;
    class?: ClassValue;
    position?: XYPosition;
    asDomNode?: boolean;
    size?: number;
    children?: Snippet;
  } = $props();

  const store = useStore();

  let edgeId: string | undefined = getContext('svelteflow__edge_id');

  if (!edgeId) {
    throw new Error('EdgeReconnectAnchor must be used within an Edge component');
  }

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }

    const {
      autoPanOnConnect,
      domNode,
      isValidConnection,
      connectionMode,
      connectionRadius,
      onconnectstart,
      onconnectend,
      onreconnect,
      onreconnectstart,
      onreconnectend,
      onbeforereconnect,
      cancelConnection,
      nodeLookup,
      flowId,
      panBy,
      updateConnection,
      edgeLookup
    } = store;

    let newEdge: Edge | undefined;
    let edge = edgeLookup.get(edgeId)!;

    reconnecting = true;
    onreconnectstart?.(event, edge, type);

    const opposite =
      type === 'target'
        ? { nodeId: edge.source, handleId: edge.sourceHandle ?? null, type: 'source' as HandleType }
        : {
            nodeId: edge.target,
            handleId: edge.targetHandle ?? null,
            type: 'target' as HandleType
          };

    XYHandle.onPointerDown(event, {
      autoPanOnConnect,
      connectionMode,
      connectionRadius,
      domNode,
      handleId: opposite.handleId,
      nodeId: opposite.nodeId,
      nodeLookup,
      isTarget: opposite.type === 'target',
      edgeUpdaterType: opposite.type,
      lib: 'svelte',
      flowId,
      cancelConnection,
      panBy,
      isValidConnection,
      onConnectStart: onconnectstart,
      onConnectEnd: onconnectend,
      onConnect: (connection) => {
        newEdge = { ...edge, ...connection };
        newEdge = onbeforereconnect ? (onbeforereconnect(newEdge, edge) ?? undefined) : newEdge;

        if (newEdge) {
          store.edges = store.edges.map((e) => (e.id === edge.id ? (newEdge as Edge) : e));
        }

        onreconnect?.(edge, connection);
      },
      onReconnectEnd: (event, connectionState) => {
        reconnecting = false;
        onreconnectend?.(event, edge, opposite.type, connectionState);
      },
      updateConnection,
      getTransform: () => [store.viewport.x, store.viewport.y, store.viewport.zoom],
      getFromHandle: () => store.connection.fromHandle
    });
  };

  let offset = $derived(asDomNode ? '-50%' : `-${size * 0.5}px`);
</script>

<svelte:element
  this={asDomNode ? 'div' : 'g'}
  use:portal={asDomNode ? 'edgelabel' : undefined}
  xmlns={asDomNode ? undefined : 'http://www.w3.org/2000/svg'}
  class={['svelte-flow__edgeupdater nopan', `svelte-flow__edgeupdater-${type}`, className]}
  style:position="absolute"
  style:width={`${size}px`}
  style:height={`${size}px`}
  style:transform={position
    ? `translate(calc(${offset} + ${position.x}px), calc(${offset} + ${position.y}px))`
    : `translate(${offset}, ${offset})`}
  {style}
  onpointerdown={onPointerDown}
>
  {#if !reconnecting}
    {#if children}
      {@render children()}
    {:else if !asDomNode}
      <rect
        width={size}
        height={size}
        x={0}
        fill="transparent"
        stroke="transparent"
        pointer-events="all"
      />
    {/if}
  {/if}
</svelte:element>
