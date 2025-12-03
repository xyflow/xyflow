<script lang="ts">
  import {
    Position,
    XYHandle,
    isMouseEvent,
    areConnectionMapsEqual,
    handleConnectionChange,
    ConnectionMode,
    getHostForElement,
    type HandleConnection,
    type Optional,
    type ConnectionState,
    type Connection
  } from '@xyflow/system';

  import { useStore } from '$lib/store';

  import type { HandleProps } from './types';
  import { getNodeConnectableContext, getNodeIdContext } from '$lib/store/context';

  let {
    id: handleId = null,
    type = 'source',
    position = Position.Top,
    style,
    class: className,
    isConnectable: isConnectableProp,
    isConnectableStart = true,
    isConnectableEnd = true,
    isValidConnection,
    onconnect,
    ondisconnect,
    children,
    ...rest
  }: HandleProps = $props();

  const nodeId = getNodeIdContext('Handle must be used within a Custom Node component');
  const isConnectableContext = getNodeConnectableContext(
    'Handle must be used within a Custom Node component'
  );

  let isTarget = $derived(type === 'target');
  let isConnectable = $derived(
    isConnectableProp !== undefined ? isConnectableProp : isConnectableContext.value
  );

  let store = useStore();
  let ariaLabelConfig = $derived(store.ariaLabelConfig);

  let prevConnections: Map<string, HandleConnection> | null = null;
  $effect.pre(() => {
    if (onconnect || ondisconnect) {
      // connectionLookup is not reactive, so we use edges to get notified about updates
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      store.edges;
      let connections = store.connectionLookup.get(
        `${nodeId}-${type}${handleId ? `-${handleId}` : ''}`
      );

      if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
        const _connections = connections ?? new Map();

        handleConnectionChange(prevConnections, _connections, ondisconnect);
        handleConnectionChange(_connections, prevConnections, onconnect);
      }

      prevConnections = new Map(connections);
    }
  });

  let [connectionInProgress, connectingFrom, connectingTo, isPossibleTargetHandle, valid] =
    $derived.by(() => {
      if (!store.connection.inProgress) {
        return [false, false, false, false, null];
      }

      const { fromHandle, toHandle, isValid } = store.connection;

      const connectingFrom =
        fromHandle &&
        fromHandle.nodeId === nodeId &&
        fromHandle.type === type &&
        fromHandle.id === handleId;

      const connectingTo =
        toHandle &&
        toHandle.nodeId === nodeId &&
        toHandle.type === type &&
        toHandle.id === handleId;

      const isPossibleTargetHandle =
        store.connectionMode === ConnectionMode.Strict
          ? fromHandle?.type !== type
          : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id;

      const valid = connectingTo && isValid;

      return [true, connectingFrom, connectingTo, isPossibleTargetHandle, valid];
    });

  function onConnectExtended(connection: Connection) {
    const edge = store.onbeforeconnect ? store.onbeforeconnect(connection) : connection;

    if (!edge) {
      return;
    }

    store.addEdge(edge);
    store.onconnect?.(connection);
  }

  function onpointerdown(event: MouseEvent | TouchEvent) {
    const isMouseTriggered = isMouseEvent(event);

    if (event.currentTarget && ((isMouseTriggered && event.button === 0) || !isMouseTriggered)) {
      XYHandle.onPointerDown(event, {
        handleId,
        nodeId,
        isTarget,
        connectionRadius: store.connectionRadius,
        domNode: store.domNode,
        nodeLookup: store.nodeLookup,
        connectionMode: store.connectionMode,
        lib: 'svelte',
        autoPanOnConnect: store.autoPanOnConnect,
        autoPanSpeed: store.autoPanSpeed,
        flowId: store.flowId,
        isValidConnection: isValidConnection ?? store.isValidConnection,
        updateConnection: store.updateConnection,
        cancelConnection: store.cancelConnection,
        panBy: store.panBy,
        onConnect: onConnectExtended,
        onConnectStart: (event, startParams) => {
          store.onconnectstart?.(event, {
            nodeId: startParams.nodeId,
            handleId: startParams.handleId,
            handleType: startParams.handleType
          });
        },
        onConnectEnd: (event, connectionState) => {
          store.onconnectend?.(event, connectionState);
        },
        getTransform: () => [store.viewport.x, store.viewport.y, store.viewport.zoom],
        getFromHandle: () => store.connection.fromHandle,
        dragThreshold: store.connectionDragThreshold,
        handleDomNode: event.currentTarget as HTMLElement
      });
    }
  }

  function onclick(event: MouseEvent) {
    if (!nodeId || (!store.clickConnectStartHandle && !isConnectableStart)) {
      return;
    }

    if (!store.clickConnectStartHandle) {
      store.onclickconnectstart?.(event, { nodeId, handleId, handleType: type });
      store.clickConnectStartHandle = { nodeId, type, id: handleId };
      return;
    }

    const doc = getHostForElement(event.target);
    const isValidConnectionHandler = isValidConnection ?? store.isValidConnection;

    const { connectionMode, clickConnectStartHandle, flowId, nodeLookup } = store;
    const { connection, isValid } = XYHandle.isValid(event, {
      handle: {
        nodeId,
        id: handleId,
        type
      },
      connectionMode,
      fromNodeId: clickConnectStartHandle.nodeId,
      fromHandleId: clickConnectStartHandle.id ?? null,
      fromType: clickConnectStartHandle.type,
      isValidConnection: isValidConnectionHandler,
      flowId,
      doc,
      lib: 'svelte',
      nodeLookup
    });

    if (isValid && connection) {
      onConnectExtended(connection);
    }

    const connectionClone = structuredClone($state.snapshot(store.connection)) as Optional<
      ConnectionState,
      'inProgress'
    >;
    delete connectionClone.inProgress;
    connectionClone.toPosition = connectionClone.toHandle
      ? connectionClone.toHandle.position
      : null;
    store.onclickconnectend?.(event, connectionClone);

    store.clickConnectStartHandle = null;
  }
</script>

<!--
@component
The Handle component is the part of a node that can be used to connect nodes.
-->
<div
  data-handleid={handleId}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id="{store.flowId}-{nodeId}-{handleId ?? 'null'}-{type}"
  class={[
    'svelte-flow__handle',
    `svelte-flow__handle-${position}`,
    store.noDragClass,
    store.noPanClass,
    position,
    className
  ]}
  class:valid
  class:connectingto={connectingTo}
  class:connectingfrom={connectingFrom}
  class:source={!isTarget}
  class:target={isTarget}
  class:connectablestart={isConnectableStart}
  class:connectableend={isConnectableEnd}
  class:connectable={isConnectable}
  class:connectionindicator={isConnectable &&
    (!connectionInProgress || isPossibleTargetHandle) &&
    (connectionInProgress || store.clickConnectStartHandle ? isConnectableEnd : isConnectableStart)}
  onmousedown={onpointerdown}
  ontouchstart={onpointerdown}
  onclick={store.clickConnect ? onclick : undefined}
  onkeypress={() => {}}
  {style}
  role="button"
  aria-label={ariaLabelConfig[`handle.ariaLabel`]}
  tabindex="-1"
  {...rest}
>
  {@render children?.()}
</div>
