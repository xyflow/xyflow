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
  on:mousedown={onPointerDown}
  on:touchstart={onPointerDown}
  {style}
>
  <slot />
</div>

<style>
  .svelte-flow__handle {
    position: absolute;
    pointer-events: none;
    min-width: 5px;
    min-height: 5px;
    width: 6px;
    height: 6px;
    background: var(--handle-background-color, var(--handle-background-color-default));
    border: 1px solid var(--handle-border-color, var(--handle-border-color-default));
    border-radius: 100%;
  }

  .connectable {
    pointer-events: all;
    cursor: crosshair;
  }

  .bottom {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .top {
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
  }

  .left {
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%);
  }

  .right {
    top: 50%;
    left: 100%;
    transform: translate(-50%, -50%);
  }
</style>
