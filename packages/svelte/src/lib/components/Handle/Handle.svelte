<script lang="ts">
  import { getContext, createEventDispatcher } from 'svelte';
  import cc from 'classcat';
  import { Position, type Connection, XYHandle, isMouseEvent } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import type { HandleComponentProps } from '$lib/types';

  type $$Props = HandleComponentProps;

  export let id: $$Props['id'] = undefined;
  export let type: $$Props['type'] = 'source';
  export let position: $$Props['position'] = Position.Top;
  export let style: $$Props['style'] = undefined;
  export let isConnectable: $$Props['isConnectable'] = true;
  export let isConnectableStart: $$Props['isConnectableStart'] = true;
  export let isConnectableEnd: $$Props['isConnectableEnd'] = true;

  let className: $$Props['class'] = undefined;
  export { className as class };

  const isTarget = type === 'target';
  const nodeId = getContext<string>('svelteflow__node_id');
  // const connectable = getContext<string>('svelteflow__node_connectable');

  const handleId = id || null;
  const dispatch = createEventDispatcher();

  const store = useStore();
  const {
    connectionMode,
    domNode,
    nodes,
    connectionRadius,
    transform,
    isValidConnection,
    lib,
    addEdge,
    panBy,
    cancelConnection,
    updateConnection
  } = store;

  function dispatchEvent(eventName: string, params?: Connection) {
    dispatch(eventName, params || { nodeId, handleId, type });
  }

  function onConnectExtended(params: Connection) {
    addEdge(params);
    dispatchEvent('connect', params);
  }

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
        autoPanOnConnect: true,
        isValidConnection: $isValidConnection,
        updateConnection,
        cancelConnection,
        panBy,
        onConnect: onConnectExtended,
        getTransform: () => $transform
      });
    }
  }
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
  class:connectablestart={isConnectableStart}
  class:connectableend={isConnectableEnd}
  class:connectable={isConnectable}
  class:connectionindicator={isConnectable}
  on:mousedown={onPointerDown}
  on:touchstart={onPointerDown}
  {style}
  role="button"
  tabindex="-1"
>
  <slot />
</div>
