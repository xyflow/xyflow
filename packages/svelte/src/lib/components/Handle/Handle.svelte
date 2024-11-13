<script lang="ts">
  import { getContext } from 'svelte';
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
  import type { HandleProps } from '$lib/types';
  import type { ConnectableContext } from '../NodeWrapper/types';

  let {
    id: handleId = null,
    type = 'source',
    position = Position.Top,
    style,
    class: className,
    isConnectable: isConnectableProp,
    isValidConnection: isValidConnectionProp,
    onconnect,
    ondisconnect,
    children
  }: HandleProps = $props();
  // @todo implement connectablestart, connectableend
  // export let isConnectableStart: $$Props['isConnectableStart'] = undefined;
  // export let isConnectableEnd: $$Props['isConnectableEnd'] = undefined;

  const nodeId = getContext<string>('svelteflow__node_id');
  const isConnectableContext = getContext<ConnectableContext>('svelteflow__node_connectable');

  let isTarget = $derived(type === 'target');
  let isConnectable = $derived(
    isConnectableProp !== undefined ? isConnectableProp : isConnectableContext.value
  );

  const {
    connectionMode,
    domNode,
    nodeLookup,
    connectionRadius,
    viewport,
    isValidConnection: isValidConnectionStore,
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
  } = useStore();

  function onPointerDown(event: MouseEvent | TouchEvent) {
    const isMouseTriggered = isMouseEvent(event);

    if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
      XYHandle.onPointerDown(event, {
        handleId,
        nodeId,
        isTarget,
        connectionRadius: $connectionRadius,
        domNode: $domNode,
        nodeLookup: $nodeLookup,
        connectionMode: $connectionMode,
        lib: $lib,
        autoPanOnConnect: $autoPanOnConnect,
        flowId: $flowId,
        isValidConnection: isValidConnectionProp ?? $isValidConnectionStore,
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
        onConnectEnd: (event, connectionState) => {
          $onConnectEndAction?.(event, connectionState);
        },
        getTransform: () => [$viewport.x, $viewport.y, $viewport.zoom],
        getFromHandle: () => $connection.fromHandle
      });
    }
  }

  let prevConnections: Map<string, HandleConnection> | null = null;
  $effect.pre(() => {
    // connectionLookup is not reactive, so we use edges to get notified about updates
    $edges;
    if (onconnect || ondisconnect) {
      let connections = $connectionLookup.get(`${nodeId}-${type}-${handleId}`);

      if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
        const _connections = connections ?? new Map();

        handleConnectionChange(prevConnections, _connections, ondisconnect);
        handleConnectionChange(_connections, prevConnections, onconnect);
      }

      prevConnections = new Map(connections);
    }
  });

  let [connectionInProcess, connectingFrom, connectingTo, isPossibleEndHandle, valid] = $derived.by(
    () => {
      const { fromHandle, toHandle, isValid } = $connection;

      const connectionInProcess = !!fromHandle;

      const connectingFrom =
        fromHandle?.nodeId === nodeId && fromHandle?.type === type && fromHandle?.id === handleId;

      const connectingTo =
        toHandle?.nodeId === nodeId && toHandle?.type === type && toHandle?.id === handleId;

      const isPossibleEndHandle =
        $connectionMode === ConnectionMode.Strict
          ? fromHandle?.type !== type
          : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id;

      const valid = connectingTo && isValid;

      return [connectionInProcess, connectingFrom, connectingTo, isPossibleEndHandle, valid];
    }
  );
</script>

<!--
@component
The Handle component is the part of a node that can be used to connect nodes.
-->
<div
  data-handleid={handleId}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id="{$flowId}-{nodeId}-{handleId}-{type}"
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
  onmousedown={onPointerDown}
  ontouchstart={onPointerDown}
  {style}
  role="button"
  tabindex="-1"
>
  {@render children?.()}
</div>
