<script lang="ts">
  import {
    Position,
    XYHandle,
    isMouseEvent,
    isInputDOMNode,
    elementSelectionKeys,
    areConnectionMapsEqual,
    handleConnectionChange,
    ConnectionMode,
    getHostForElement,
    type HandleConnection,
    type Optional,
    type ConnectionState,
    type FinalConnectionState,
    type Connection
  } from '@xyflow/system';

  import { useStore } from '$lib/store/index.js';

  import { ARIA_HANDLE_DESC_KEY } from '../A11yDescriptions/index.js';
  import type { HandleProps } from './types.js';
  import { getNodeConnectableContext, getNodeIdContext } from '$lib/store/context.js';

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
        isValidConnection:
          isValidConnection || ((...args) => store.isValidConnection?.(...args) ?? true),
        updateConnection: store.updateConnection,
        cancelConnection: store.cancelConnection,
        panBy: store.panBy,
        onConnect: onConnectExtended,
        onConnectStart: store.onconnectstart,
        onConnectEnd: (...args) => store.onconnectend?.(...args),
        getTransform: () => [store.viewport.x, store.viewport.y, store.viewport.zoom],
        getFromHandle: () => store.connection.fromHandle,
        dragThreshold: store.connectionDragThreshold,
        handleDomNode: event.currentTarget as HTMLElement
      });
    }
  }

  let isFocusable = $derived(
    isConnectable && store.clickConnect && store.handlesFocusable && !store.disableKeyboardA11y
  );

  let clickConnecting = $derived(
    store.clickConnectStartHandle?.nodeId === nodeId &&
      store.clickConnectStartHandle?.type === type &&
      store.clickConnectStartHandle?.id === handleId
  );

  /*
   * Activating a handle - by clicking it or by pressing enter/space while it is focused -
   * either starts a new connection or completes a pending one.
   */
  function onHandleActivate(event: MouseEvent | KeyboardEvent) {
    if (!nodeId || (!store.clickConnectStartHandle && !isConnectableStart)) {
      return;
    }

    if (!store.clickConnectStartHandle) {
      store.onclickconnectstart?.(event, { nodeId, handleId, handleType: type });
      store.clickConnectStartHandle = { nodeId, type, id: handleId };
      store.ariaLiveMessage = store.ariaLabelConfig['handle.ariaLiveMessage.connectionStarted'];
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
    store.onclickconnectend?.(event, connectionClone as FinalConnectionState);

    store.clickConnectStartHandle = null;
  }

  function onkeydown(event: KeyboardEvent) {
    if (
      isInputDOMNode(event) ||
      !elementSelectionKeys.includes(event.key) ||
      event.key === 'Escape'
    ) {
      return;
    }

    // prevent scrolling the viewport on space and the event from reaching the node wrapper
    event.preventDefault();
    event.stopPropagation();
    onHandleActivate(event);
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
  class:clickconnecting={clickConnecting}
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
  onclick={store.clickConnect ? (event) => onHandleActivate(event) : undefined}
  onkeydown={isFocusable ? onkeydown : undefined}
  {style}
  role="button"
  aria-label={ariaLabelConfig[`handle.ariaLabel`]}
  aria-describedby={isFocusable ? `${ARIA_HANDLE_DESC_KEY}-${store.flowId}` : undefined}
  tabindex={isFocusable ? 0 : -1}
  {...rest}
>
  {@render children?.()}
</div>
