<script lang="ts">
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import cc from 'classcat';
  import {
    Position,
    XYHandle,
    isMouseEvent,
    type HandleConnection,
    areConnectionMapsEqual,
    handleConnectionChange,
    ConnectionMode
  } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import type { HandleComponentProps } from '$lib/types';

  type $$Props = HandleComponentProps;

  export let id: $$Props['id'] = undefined;
  export let type: $$Props['type'] = 'source';
  export let position: $$Props['position'] = Position.Top;
  export let style: $$Props['style'] = undefined;
  export let isConnectable: $$Props['isConnectable'] = undefined;
  export let onconnect: $$Props['onconnect'] = undefined;
  export let ondisconnect: $$Props['ondisconnect'] = undefined;
  // @todo implement connectablestart, connectableend
  // export let isConnectableStart: $$Props['isConnectableStart'] = undefined;
  // export let isConnectableEnd: $$Props['isConnectableEnd'] = undefined;

  let className: $$Props['class'] = undefined;
  export { className as class };

  const isTarget = type === 'target';
  const nodeId = getContext<string>('svelteflow__node_id');
  const connectable = getContext<Writable<boolean>>('svelteflow__node_connectable');
  $: isConnectable = isConnectable !== undefined ? isConnectable : $connectable;

  const handleId = id || null;

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
    autoPanOnConnect,
    edges,
    connectionLookup,
    onconnect: onConnectAction,
    onconnectstart: onConnectStartAction,
    onconnectend: onConnectEndAction,
    flowId,
    connection
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
        flowId: $flowId,
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
          $onConnectAction?.(connection);
        },
        onConnectStart: (event, startParams) => {
          $onConnectStartAction?.(event, {
            nodeId: startParams.nodeId,
            handleId: startParams.handleId,
            handleType: startParams.handleType
          });
        },
        onConnectEnd: (event) => {
          $onConnectEndAction?.(event);
        },
        getTransform: () => [$viewport.x, $viewport.y, $viewport.zoom],
        getConnectionStartHandle: () => $connection.startHandle
      });
    }
  }

  let prevConnections: Map<string, HandleConnection> | null = null;
  let connections: Map<string, HandleConnection> | undefined;

  $: if (onconnect || ondisconnect) {
    // connectionLookup is not reactive, so we use edges to get notified about updates
    $edges;
    connections = $connectionLookup.get(`${nodeId}-${type}-${id || null}`);
  }

  $: {
    if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
      const _connections = connections ?? new Map();

      handleConnectionChange(prevConnections, _connections, ondisconnect);
      handleConnectionChange(_connections, prevConnections, onconnect);
    }

    prevConnections = connections ?? new Map();
  }

  $: connectionInProcess = !!$connection.startHandle;
  $: connectingFrom =
    $connection.startHandle?.nodeId === nodeId &&
    $connection.startHandle?.type === type &&
    $connection.startHandle?.handleId === handleId;
  $: connectingTo =
    $connection.endHandle?.nodeId === nodeId &&
    $connection.endHandle?.type === type &&
    $connection.endHandle?.handleId === handleId;
  $: isPossibleEndHandle =
    $connectionMode === ConnectionMode.Strict
      ? $connection.startHandle?.type !== type
      : nodeId !== $connection.startHandle?.nodeId ||
        handleId !== $connection.startHandle?.handleId;
  $: valid = connectingTo && $connection.status === 'valid';
</script>

<!--
@component
The Handle component is the part of a node that can be used to connect nodes.
-->
<div
  data-handleid={handleId}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id="{$flowId}-{nodeId}-{id || null}-{type}"
  class={cc([
    'svelte-flow__handle',
    `svelte-flow__handle-${position}`,
    'nodrag',
    'nopan',
    position,
    className
  ])}
  class:valid
  class:connectingto={connectingTo}
  class:connectingfrom={connectingFrom}
  class:source={!isTarget}
  class:target={isTarget}
  class:connectablestart={isConnectable}
  class:connectableend={isConnectable}
  class:connectable={isConnectable}
  class:connectionindicator={isConnectable && (!connectionInProcess || isPossibleEndHandle)}
  on:mousedown={onPointerDown}
  on:touchstart={onPointerDown}
  {style}
  role="button"
  tabindex="-1"
>
  <slot />
</div>
