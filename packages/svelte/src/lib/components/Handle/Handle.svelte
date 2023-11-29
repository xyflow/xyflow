<script lang="ts">
  import { getContext, createEventDispatcher } from 'svelte';
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
    onedgecreate,
    panBy,
    cancelConnection,
    updateConnection,
    autoPanOnConnect
  } = store;

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
          const edge = $onedgecreate ? $onedgecreate(connection) : connection;

          if (!edge) {
            return;
          }

          addEdge(edge);
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

  // @todo implement connectablestart, connectableend
</script>

<div
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
