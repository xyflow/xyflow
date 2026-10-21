import type { Connection, FinalConnectionState, HandleType } from '@xyflow/system';
import type { Component } from 'vue';
import type { Edge, EdgeProps, InternalNode, MouseTouchEvent } from '../../types';
import { getEdgePosition, getMarkerId } from '@xyflow/system';
import { computed, defineComponent, getCurrentInstance, h, inject, provide, shallowRef, toRef } from 'vue';
import { useHandle, useVueFlow, useVueFlowStore } from '../../composables';
import { EdgeId, EdgeRef, Slots } from '../../context';
import { ARIA_EDGE_DESC_KEY, defaultEdgeTypes, devWarn, elementSelectionKeys, ErrorCode, getEdgeZIndex, markChangedProps, resolveTypeComponent, VueFlowError } from '../../utils';
import EdgeAnchor from './EdgeAnchor';

interface Props {
  id: string;
}

const EdgeWrapper = defineComponent({
  name: 'Edge',
  compatConfig: { MODE: 3 },
  props: ['id'],
  setup(props: Props) {
    const { id: vueFlowId, addSelectedEdges, emits, removeSelectedEdges, getEdge, getInternalNode } = useVueFlow();

    const store = useVueFlowStore();

    const isValidConnection = toRef(store, 'isValidConnection');

    const storedEdge = computed(() => getEdge(props.id) as Edge);

    const edge = computed(() => {
      const defaults = store.defaultEdgeOptions;
      return defaults ? ({ ...defaults, ...storedEdge.value }) : storedEdge.value;
    });

    const zIndex = computed(() => getEdgeZIndex(edge.value, getInternalNode, store.elevateEdgesOnSelect, store.zIndexMode));

    const slots = inject(Slots);

    const instance = getCurrentInstance();

    const mouseOver = shallowRef(false);

    const updating = shallowRef(false);

    const nodeId = shallowRef('');

    const handleId = shallowRef<string | null>(null);

    const reconnectHandleType = shallowRef<HandleType>('source');

    const edgeEl = shallowRef<SVGElement | null>(null);

    const isSelectable = computed(() =>
      typeof edge.value.selectable === 'undefined' ? store.elementsSelectable : edge.value.selectable,
    );

    const isReconnectable = computed(() =>
      typeof edge.value.reconnectable === 'undefined' ? store.edgesReconnectable : edge.value.reconnectable,
    );

    const isFocusable = computed(() => (typeof edge.value.focusable === 'undefined' ? store.edgesFocusable : edge.value.focusable));

    const hasReconnectListener = toRef(
      () =>
        store.hooks.reconnect.hasListeners()
        || store.hooks.reconnectStart.hasListeners()
        || store.hooks.reconnectEnd.hasListeners(),
    );

    provide(EdgeId, props.id);
    provide(EdgeRef, edgeEl);

    const edgeClass = computed(() => edge.value.class);
    const edgeStyle = computed(() => edge.value.style);

    const edgeCmp = computed(() => {
      const name = edge.value.type || 'default';

      // see NodeWrapper: `getEdgeTypes` derives its registry from `state.edges`, so reading it
      // here subscribes every wrapper to the whole edge array
      const registered = store.edgeTypes?.[name] ?? defaultEdgeTypes[name as keyof typeof defaultEdgeTypes] ?? name;

      const cmp = resolveTypeComponent(slots?.[`edge-${name}`], registered, name, instance);

      if (cmp) {
        return cmp;
      }

      emits.error(new VueFlowError(ErrorCode.EDGE_TYPE_MISSING, name));

      return undefined;
    });

    const { handlePointerDown } = useHandle({
      nodeId,
      handleId,
      type: reconnectHandleType,
      isValidConnection,
      reconnectHandleType,
      onReconnectStart: (event) => {
        updating.value = true;
        emits.reconnectStart({ event, edge: storedEdge.value, handleType: reconnectHandleType.value });
      },
      onReconnect,
      onReconnectEnd,
    });

    let prevEdgeComponentProps: Record<string, unknown> | null = null;

    return () => {
      if (!storedEdge.value) {
        return null;
      }

      // one read: `edge` is a computed, and every `.value` pays a dirty check
      const currentEdge = edge.value;

      const sourceNode = getInternalNode(currentEdge.source);
      const targetNode = getInternalNode(currentEdge.target);
      const pathOptions = 'pathOptions' in currentEdge ? currentEdge.pathOptions : {};

      if (!sourceNode && !targetNode) {
        emits.error(new VueFlowError(ErrorCode.EDGE_SOURCE_TARGET_MISSING, currentEdge.id, currentEdge.source, currentEdge.target));

        return null;
      }

      if (!sourceNode) {
        emits.error(new VueFlowError(ErrorCode.EDGE_SOURCE_MISSING, currentEdge.id, currentEdge.source));

        return null;
      }

      if (!targetNode) {
        emits.error(new VueFlowError(ErrorCode.EDGE_TARGET_MISSING, currentEdge.id, currentEdge.target));

        return null;
      }

      if (!currentEdge || currentEdge.hidden || sourceNode.hidden || targetNode.hidden) {
        return null;
      }

      const edgePosition = getEdgePosition({
        id: props.id,
        sourceNode,
        targetNode,
        sourceHandle: currentEdge.sourceHandle || null,
        targetHandle: currentEdge.targetHandle || null,
        connectionMode: store.connectionMode,
        onError: devWarn,
      });

      if (!edgePosition) {
        return null;
      }

      const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = edgePosition;

      const edgeComponentProps = {
        id: props.id,
        source: currentEdge.source,
        target: currentEdge.target,
        type: currentEdge.type,
        reconnectable: isReconnectable.value,
        selectable: isSelectable.value,
        deletable: currentEdge.deletable,
        selected: currentEdge.selected,
        animated: currentEdge.animated,
        label: currentEdge.label,
        labelStyle: currentEdge.labelStyle,
        labelShowBg: currentEdge.labelShowBg,
        labelBgStyle: currentEdge.labelBgStyle,
        labelBgPadding: currentEdge.labelBgPadding,
        labelBgBorderRadius: currentEdge.labelBgBorderRadius,
        data: currentEdge.data,
        style: edgeStyle.value,
        markerStart: currentEdge.markerStart ? `url('#${getMarkerId(currentEdge.markerStart, vueFlowId)}')` : undefined,
        markerEnd: currentEdge.markerEnd ? `url('#${getMarkerId(currentEdge.markerEnd, vueFlowId)}')` : undefined,
        sourcePosition,
        targetPosition,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceHandleId: currentEdge.sourceHandle,
        targetHandleId: currentEdge.targetHandle,
        interactionWidth: currentEdge.interactionWidth,
      } satisfies EdgeProps;

      let edgeComponent = null;

      if (updating.value) {
        prevEdgeComponentProps = null;
      }
      else {
        const edgeProps = { ...edgeComponentProps, ...pathOptions };
        edgeComponent = h(edgeCmp.value ?? (defaultEdgeTypes.default as Component), edgeProps);

        markChangedProps(edgeComponent, edgeProps, prevEdgeComponentProps);
        prevEdgeComponentProps = edgeProps;
      }

      // flat children: a nested array child makes Vue build and diff a Fragment on every render,
      // for every edge, even when both anchors are null (no reconnect listener)
      const canReconnect = hasReconnectListener.value;

      const sourceAnchor = canReconnect && (isReconnectable.value === 'source' || isReconnectable.value === true)
        ? h(
            'g',
            {
              onMousedown: onReconnectSourceMouseDown,
              onMouseenter: onReconnectMouseEnter,
              onMouseout: onReconnectMouseOut,
            },
            h(EdgeAnchor, {
              'position': sourcePosition,
              'centerX': sourceX,
              'centerY': sourceY,
              'radius': store.reconnectRadius,
              'type': 'source',
              'data-type': 'source',
            }),
          )
        : null;

      const targetAnchor = canReconnect && (isReconnectable.value === 'target' || isReconnectable.value === true)
        ? h(
            'g',
            {
              onMousedown: onReconnectTargetMouseDown,
              onMouseenter: onReconnectMouseEnter,
              onMouseout: onReconnectMouseOut,
            },
            h(EdgeAnchor, {
              'position': targetPosition,
              'centerX': targetX,
              'centerY': targetY,
              'radius': store.reconnectRadius,
              'type': 'target',
              'data-type': 'target',
            }),
          )
        : null;

      return h(
        'svg',
        { style: { zIndex: zIndex.value } },
        h(
          'g',
          {
            'ref': edgeEl,
            'key': props.id,
            'data-id': props.id,
            'class': [
              'vue-flow__edge',
              `vue-flow__edge-${edgeCmp.value ? currentEdge.type || 'default' : 'default'}`,
              store.noPanClassName,
              edgeClass.value,
              {
                updating: mouseOver.value,
                selected: currentEdge.selected,
                animated: currentEdge.animated,
                inactive: !isSelectable.value && !store.hooks.edgeClick.hasListeners(),
                selectable: isSelectable.value,
              },
            ],
            'tabIndex': isFocusable.value ? 0 : undefined,
            'aria-label':
              currentEdge.ariaLabel === null
                ? undefined
                : currentEdge.ariaLabel ?? `Edge from ${currentEdge.source} to ${currentEdge.target}`,
            'aria-describedby': isFocusable.value ? `${ARIA_EDGE_DESC_KEY}-${vueFlowId}` : undefined,
            'aria-roledescription': 'edge',
            'role': isFocusable.value ? 'group' : 'img',
            ...currentEdge.domAttributes,
            'onClick': onEdgeClick,
            'onContextmenu': onEdgeContextMenu,
            'onDblclick': onDoubleClick,
            'onMouseenter': onEdgeMouseEnter,
            'onMousemove': onEdgeMouseMove,
            'onMouseleave': onEdgeMouseLeave,
            'onKeyDown': isFocusable.value ? onKeyDown : undefined,
          },
          [edgeComponent, sourceAnchor, targetAnchor],
        ),
      );
    };

    function onReconnectMouseEnter() {
      mouseOver.value = true;
    }

    function onReconnectMouseOut() {
      mouseOver.value = false;
    }

    function onReconnect(event: MouseTouchEvent, connection: Connection) {
      emits.reconnect({ event, edge: storedEdge.value, connection });
    }

    function onReconnectEnd(event: MouseTouchEvent, connectionState: FinalConnectionState<InternalNode>) {
      emits.reconnectEnd({ event, edge: storedEdge.value, handleType: reconnectHandleType.value, connectionState });
      updating.value = false;
    }

    function handleReconnect(event: MouseEvent, isSourceHandle: boolean) {
      if (event.button !== 0) {
        return;
      }

      nodeId.value = isSourceHandle ? edge.value.target : edge.value.source;
      handleId.value = (isSourceHandle ? edge.value.targetHandle : edge.value.sourceHandle) ?? null;

      reconnectHandleType.value = isSourceHandle ? 'target' : 'source';

      handlePointerDown(event);
    }

    function onEdgeClick(event: MouseEvent) {
      const data = { event, edge: storedEdge.value };

      if (isSelectable.value) {
        store.nodesSelectionActive = false;

        if (edge.value.selected && store.multiSelectionActive) {
          removeSelectedEdges([storedEdge.value]);

          edgeEl.value?.blur();
        }
        else {
          addSelectedEdges([storedEdge.value]);
        }
      }

      emits.edgeClick(data);
    }

    function onEdgeContextMenu(event: MouseEvent) {
      emits.edgeContextMenu({ event, edge: storedEdge.value });
    }

    function onDoubleClick(event: MouseEvent) {
      emits.edgeDoubleClick({ event, edge: storedEdge.value });
    }

    function onEdgeMouseEnter(event: MouseEvent) {
      emits.edgeMouseEnter({ event, edge: storedEdge.value });
    }

    function onEdgeMouseMove(event: MouseEvent) {
      emits.edgeMouseMove({ event, edge: storedEdge.value });
    }

    function onEdgeMouseLeave(event: MouseEvent) {
      emits.edgeMouseLeave({ event, edge: storedEdge.value });
    }

    function onReconnectSourceMouseDown(event: MouseEvent) {
      handleReconnect(event, true);
    }

    function onReconnectTargetMouseDown(event: MouseEvent) {
      handleReconnect(event, false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!store.disableKeyboardA11y && elementSelectionKeys.includes(event.key) && isSelectable.value) {
        const unselect = event.key === 'Escape';

        if (unselect) {
          edgeEl.value?.blur();

          removeSelectedEdges([storedEdge.value]);
        }
        else {
          addSelectedEdges([storedEdge.value]);
        }
      }
    }
  },
});

export default EdgeWrapper;
