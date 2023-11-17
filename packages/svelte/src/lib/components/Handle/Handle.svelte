<script lang="ts">
  import { getContext, createEventDispatcher, onMount, onDestroy } from 'svelte';
  import cc from 'classcat';
  import {
    Position,
    XYHandle,
    isMouseEvent,
    type Connection,
    type HandleType
  } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import type { HandleComponentProps } from '$lib/types';
  import type { Writable } from 'svelte/store';

  type $$Props = HandleComponentProps;

  export let id: $$Props['id'] = undefined;
  export let type: $$Props['type'] = 'source';
  export let position: $$Props['position'] = Position.Top;
  export let style: $$Props['style'] = undefined;
  export let isConnectable: $$Props['isConnectable'] = undefined;
  // export let isConnectableStart: $$Props['isConnectableStart'] = undefined;
  // export let isConnectableEnd: $$Props['isConnectableEnd'] = undefined;

  let className: $$Props['class'] = undefined;
  export { className as class };

  const isTarget = type === 'target';
  const nodeId = getContext<string>('svelteflow__node_id');
  const connectable = getContext<Writable<boolean>>('svelteflow__node_connectable');
  $: handleConnectable = isConnectable !== undefined ? isConnectable : $connectable;

  const handleId = id || null;
  const dispatch = createEventDispatcher<{
    connect: { connection: Connection };
    connectstart: {
      event: MouseEvent | TouchEvent;
      nodeId: string | null;
      handleId: string | null;
      handleType: HandleType | null;
    };
    connectend: {
      event: MouseEvent | TouchEvent;
    };
    disconnect: {};
  }>();

  const store = useStore();
  const {
    connectionMode,
    domNode,
    nodes,
    connectionRadius,
    viewport,
    isValidConnection,
    lib,
    addEdge,
    panBy,
    cancelConnection,
    updateConnection,
    autoPanOnConnect
  } = store;

  let thisHandle: HTMLElement;

  function onPointerDown(event: MouseEvent | TouchEvent) {
    const isMouseTriggered = isMouseEvent(event);

    if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
      XYHandle.onPointerDown(event, {
        handleId,
        nodeId,
        isTarget,
        connectionRadius: $connectionRadius,
        domNode: $domNode,
        nodes: $nodes,
        connectionMode: $connectionMode,
        lib: $lib,
        autoPanOnConnect: $autoPanOnConnect,
        isValidConnection: $isValidConnection,
        updateConnection,
        cancelConnection,
        panBy,
        onConnect: (connection) => {
          addEdge(connection);

          // @todo: should we change/ improve the stuff we are passing here?
          // instead of source/target we could pass fromNodeId, fromHandleId, etc
          dispatch('connect', { connection });
        },
        onConnectStart: (event, startParams) => {
          dispatch('connectstart', {
            event,
            nodeId: startParams.nodeId,
            handleId: startParams.handleId,
            handleType: startParams.handleType
          });
        },
        onConnectEnd: (event) => {
          dispatch('connectend', { event });
        },
        getTransform: () => [$viewport.x, $viewport.y, $viewport.zoom]
      });
    }
  }

  function onTargetConnect(event: CustomEvent) {
    // creating a dummy connection object so this doesn't break the current
    // connection logic when the target is the starting point of the connection
    const connection = {
      source: '',
      target: nodeId,
      sourceHandle: '',
      targetHandle: id as string
    };
    dispatch('connect', { connection });
  }

  function onDisconnect(event: CustomEvent) {
    dispatch('disconnect', {});
  }

  onMount(() => {
    if (thisHandle) {
      // adding a custom event so it can be called from XYHandle's onPointerDown
      // when onPointerUp is triggered (this way allows for it to be called from DOM
      // events and custom events)
      thisHandle.addEventListener('targetConnect', onTargetConnect as EventListener);
      // this is to handle custom events when an edge is deleted
      thisHandle.addEventListener('disconnect', onDisconnect as EventListener);
    }
  });

  onDestroy(() => {
    if (thisHandle) {
      thisHandle.removeEventListener('targetConnect', onTargetConnect as EventListener);
      thisHandle.removeEventListener('disconnect', onDisconnect as EventListener);
    }
  });

  // @todo implement connectablestart, connectableend
</script>

<div
  bind:this={thisHandle}
  data-handleid={handleId}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id="{nodeId}-{id || null}-{type}"
  class={cc([
    'svelte-flow__handle',
    `svelte-flow__handle-${position}`,
    'nodrag',
    'nopan',
    position,
    className
  ])}
  class:source={!isTarget}
  class:target={isTarget}
  class:connectablestart={handleConnectable}
  class:connectableend={handleConnectable}
  class:connectable={handleConnectable}
  class:connectionindicator={handleConnectable}
  on:mousedown={onPointerDown}
  on:touchstart={onPointerDown}
  {style}
  role="button"
  tabindex="-1"
>
  <slot />
</div>
