<script lang="ts">
  import { getContext, createEventDispatcher } from 'svelte';
  import cc from 'classcat';
  import { Position, type Connection } from '@reactflow/system';
  import { isMouseEvent } from '@reactflow/utils';

  import { handlePointerDown } from './handler';
  import { useStore } from '$lib/store';
  import type { HandleComponentProps } from '$lib/types';

  type $$Props = HandleComponentProps;

  export let id: $$Props['id'] = undefined;
  export let type: $$Props['type'] = 'source';
  export let position: $$Props['position'] = Position.Top;
  export let style: $$Props['style'] = undefined;
  let className: $$Props['class'] = undefined;
  export { className as class };

  const isTarget = type === 'target';
  const nodeId = getContext<string>('svelteflow__node_id');
  const connectable = getContext<string>('svelteflow__node_connectable');

  const handleId = id || null;
  const dispatch = createEventDispatcher();

  const {
    connectionMode,
    domNode,
    nodes,
    connectionRadius,
    transform,
    isValidConnection,
    addEdge,
    panBy,
    cancelConnection,
    updateConnection,
  } = useStore();

  function dispatchEvent(eventName: string, params?: Connection) {
    dispatch(eventName, params || { nodeId, handleId, type });
  }

  function onConnectExtended(params: Connection) {
    addEdge(params);
    dispatchEvent('connect', params)
  }

  function onPointerDown(event: MouseEvent | TouchEvent) {
    const isMouseTriggered = isMouseEvent(event);

    if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
      handlePointerDown({
        event,
        handleId,
        nodeId,
        isTarget,
        connectionRadius: $connectionRadius,
        domNode: $domNode,
        nodes,
        connectionMode: $connectionMode,
        transform,
        isValidConnection: $isValidConnection,
        onConnect: onConnectExtended,
        updateConnection,
        cancelConnection,
        panBy,
        onConnectStart: () => dispatchEvent('connect:start'),
        onConnectEnd: () => dispatchEvent('connect:end')
      });
    }
  }
</script>

<div
  data-handleid={handleId}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id={`${nodeId}-${id}-${type}`}
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
  class:connectable
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
    background: #1a192b;
    border: 1px solid white;
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
