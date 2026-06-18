import type { Connection, FinalConnectionState, HandleType } from '@xyflow/system';
import type { Edge, EdgeComponent, InternalNode, MouseTouchEvent } from '../../types';
import { ConnectionMode, getHandlePosition, getMarkerId, Position } from '@xyflow/system';
import { computed, defineComponent, getCurrentInstance, h, inject, provide, resolveComponent, shallowRef, toRef } from 'vue';
import { useEdgeHooks, useHandle, useStore, useVueFlow } from '../../composables';
import { EdgeId, EdgeRef, Slots } from '../../context';
import { ARIA_EDGE_DESC_KEY, elementSelectionKeys, ErrorCode, getEdgeHandle, getEdgeZIndex, VueFlowError } from '../../utils';
import EdgeAnchor from './EdgeAnchor';

interface Props {
  id: string;
}

// candidate handles for one end of an edge: strict mode = only the matching side; loose mode = both
// sides, matching side first (so `getEdgeHandle` prefers it)
function getNodeHandles(node: InternalNode, side: 'source' | 'target', strict: boolean) {
  const bounds = node.internals.handleBounds;
  if (strict) {
    return bounds?.[side] ?? null;
  }

  const other = side === 'source' ? 'target' : 'source';
  return [...(bounds?.[side] ?? []), ...(bounds?.[other] ?? [])];
}

const EdgeWrapper = defineComponent({
  name: 'Edge',
  compatConfig: { MODE: 3 },
  props: ['id'],
  setup(props: Props) {
    const { id: vueFlowId, addSelectedEdges, emits, getEdgeTypes, removeSelectedEdges, getEdge, getInternalNode } = useVueFlow();

    // Read the reactive store directly (see NodeWrapper) — `store.x` tracks reactively inside
    // computeds/handlers, so there's no need to project the whole state into refs per edge.
    const store = useStore();

    // `isValidConnection` is handed to `useHandle`, which reads it as a ref, so keep it as one.
    const isValidConnection = toRef(store, 'isValidConnection');

    const storedEdge = computed(() => getEdge(props.id) as Edge);

    const edge = computed<Edge>(() => {
      const defaults = store.defaultEdgeOptions;
      return defaults ? ({ ...(defaults as Edge), ...storedEdge.value } as Edge) : storedEdge.value;
    });

    // resolved per edge (value-gated computed) so the z-tracking of BOTH endpoint lookup keys lives in
    // this component's scope — resolving it in EdgeRenderer's v-for made the whole renderer re-render
    // (all edge vnodes) whenever ANY node entry was replaced, i.e. every drag frame
    const zIndex = computed(() => getEdgeZIndex(edge.value, getInternalNode, store.elevateEdgesOnSelect, store.zIndexMode));

    const { emit } = useEdgeHooks(emits);

    const slots = inject(Slots);

    const instance = getCurrentInstance();

    const mouseOver = shallowRef(false);

    const updating = shallowRef(false);

    const nodeId = shallowRef('');

    const handleId = shallowRef<string | null>(null);

    const reconnectHandleType = shallowRef<HandleType>('source');

    const edgeEl = shallowRef<SVGElement | null>(null);

    const isSelectable = toRef(() =>
      typeof edge.value.selectable === 'undefined' ? store.elementsSelectable : edge.value.selectable,
    );

    const isReconnectable = toRef(() =>
      typeof edge.value.reconnectable === 'undefined' ? store.edgesReconnectable : edge.value.reconnectable,
    );

    const isFocusable = toRef(() => (typeof edge.value.focusable === 'undefined' ? store.edgesFocusable : edge.value.focusable));

    provide(EdgeId, props.id);
    provide(EdgeRef, edgeEl);

    const edgeClass = computed(() => edge.value.class);
    const edgeStyle = computed(() => edge.value.style);

    const edgeCmp = computed(() => {
      const name = edge.value.type || 'default';

      const slot = slots?.[`edge-${name}`];
      if (slot) {
        return slot;
      }

      let edgeType = edge.value.template ?? getEdgeTypes.value[name];

      if (typeof edgeType === 'string') {
        if (instance) {
          const components = Object.keys(instance.appContext.components);
          if (components && components.includes(name)) {
            edgeType = resolveComponent(name, false) as EdgeComponent;
          }
        }
      }

      if (edgeType && typeof edgeType !== 'string') {
        return edgeType;
      }

      emits.error(new VueFlowError(ErrorCode.EDGE_TYPE_MISSING, edgeType));

      return false;
    });

    const { handlePointerDown } = useHandle({
      nodeId,
      handleId,
      type: reconnectHandleType,
      isValidConnection,
      reconnectHandleType,
      // xyflow/react + svelte hide the original edge AND emit `reconnectStart` from the system's
      // `onConnectStart` — i.e. once the reconnect drag actually starts (after the drag threshold), not
      // eagerly on pointerdown. A plain click on the anchor then leaves the edge in place and emits nothing.
      onReconnectStart: (event) => {
        updating.value = true;
        emit.reconnectStart({ event, edge: storedEdge.value, handleType: reconnectHandleType.value });
      },
      onReconnect,
      onReconnectEnd,
    });

    return () => {
      // bail if the edge was removed between a lookup update and this wrapper unmounting — otherwise the
      // derefs below throw when no `defaultEdgeOptions` mask the now-undefined edge
      if (!storedEdge.value) {
        return null;
      }

      const sourceNode = getInternalNode(edge.value.source);
      const targetNode = getInternalNode(edge.value.target);
      const pathOptions = 'pathOptions' in edge.value ? edge.value.pathOptions : {};

      if (!sourceNode && !targetNode) {
        emits.error(new VueFlowError(ErrorCode.EDGE_SOURCE_TARGET_MISSING, edge.value.id, edge.value.source, edge.value.target));

        return null;
      }

      if (!sourceNode) {
        emits.error(new VueFlowError(ErrorCode.EDGE_SOURCE_MISSING, edge.value.id, edge.value.source));

        return null;
      }

      if (!targetNode) {
        emits.error(new VueFlowError(ErrorCode.EDGE_TARGET_MISSING, edge.value.id, edge.value.target));

        return null;
      }

      if (!edge.value || edge.value.hidden || sourceNode.hidden || targetNode.hidden) {
        return null;
      }

      // strict mode considers only the matching side's handles; loose mode considers both (matching first)
      const strict = store.connectionMode === ConnectionMode.Strict;
      const sourceHandle = getEdgeHandle(getNodeHandles(sourceNode, 'source', strict), edge.value.sourceHandle);
      const targetHandle = getEdgeHandle(getNodeHandles(targetNode, 'target', strict), edge.value.targetHandle);

      const sourcePosition = sourceHandle?.position || Position.Bottom;

      const targetPosition = targetHandle?.position || Position.Top;

      // positions are render-local — computed each render and passed to the edge component as props,
      // never stored on the edge
      const { x: sourceX, y: sourceY } = getHandlePosition(sourceNode, sourceHandle, sourcePosition);
      const { x: targetX, y: targetY } = getHandlePosition(targetNode, targetHandle, targetPosition);

      // the full-container svg wrapper (one stacking context per edge zIndex) is rendered here rather
      // than in EdgeRenderer's v-for so its node-lookup tracking stays scoped to this edge
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
              `vue-flow__edge-${edgeCmp.value === false ? 'default' : edge.value.type || 'default'}`,
              store.noPanClassName,
              edgeClass.value,
              {
                updating: mouseOver.value,
                selected: edge.value.selected,
                animated: edge.value.animated,
                inactive: !isSelectable.value && !store.hooks.edgeClick.hasListeners(),
              },
            ],
            'tabIndex': isFocusable.value ? 0 : undefined,
            'aria-label':
              edge.value.ariaLabel === null
                ? undefined
                : edge.value.ariaLabel ?? `Edge from ${edge.value.source} to ${edge.value.target}`,
            'aria-describedby': isFocusable.value ? `${ARIA_EDGE_DESC_KEY}-${vueFlowId}` : undefined,
            'aria-roledescription': 'edge',
            'role': isFocusable.value ? 'group' : 'img',
            ...edge.value.domAttributes,
            'onClick': onEdgeClick,
            'onContextmenu': onEdgeContextMenu,
            'onDblclick': onDoubleClick,
            'onMouseenter': onEdgeMouseEnter,
            'onMousemove': onEdgeMouseMove,
            'onMouseleave': onEdgeMouseLeave,
            'onKeyDown': isFocusable.value ? onKeyDown : undefined,
          },
          [
            updating.value
              ? null
              : h(edgeCmp.value === false ? getEdgeTypes.value.default : (edgeCmp.value as any), {
                  // no sourceNode/targetNode (custom edges resolve nodes via `useInternalNode`);
                  // handles passed as sourceHandleId/targetHandleId
                  id: props.id,
                  source: edge.value.source,
                  target: edge.value.target,
                  type: edge.value.type,
                  reconnectable: isReconnectable.value,
                  selectable: isSelectable.value,
                  deletable: edge.value.deletable,
                  selected: edge.value.selected,
                  animated: edge.value.animated,
                  label: edge.value.label,
                  labelStyle: edge.value.labelStyle,
                  labelShowBg: edge.value.labelShowBg,
                  labelBgStyle: edge.value.labelBgStyle,
                  labelBgPadding: edge.value.labelBgPadding,
                  labelBgBorderRadius: edge.value.labelBgBorderRadius,
                  data: edge.value.data,
                  style: edgeStyle.value,
                  // only emit a marker ref when the edge actually has one — `getMarkerId(undefined)`
                  // returns '' (→ `url('#')`), which otherwise writes a bogus marker attr on every edge
                  // path every render (a wasted `setAttribute` per frame for the common marker-less edge)
                  markerStart: edge.value.markerStart ? `url('#${getMarkerId(edge.value.markerStart, vueFlowId)}')` : undefined,
                  markerEnd: edge.value.markerEnd ? `url('#${getMarkerId(edge.value.markerEnd, vueFlowId)}')` : undefined,
                  sourcePosition,
                  targetPosition,
                  sourceX,
                  sourceY,
                  targetX,
                  targetY,
                  sourceHandleId: edge.value.sourceHandle,
                  targetHandleId: edge.value.targetHandle,
                  interactionWidth: edge.value.interactionWidth,
                  ...pathOptions,
                }),
            [
              isReconnectable.value === 'source' || isReconnectable.value === true
                ? [
                    h(
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
                    ),
                  ]
                : null,
              isReconnectable.value === 'target' || isReconnectable.value === true
                ? [
                    h(
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
                    ),
                  ]
                : null,
            ],
          ],
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
      emit.reconnect({ event, edge: storedEdge.value, connection });
    }

    function onReconnectEnd(event: MouseTouchEvent, connectionState: FinalConnectionState<InternalNode>) {
      emit.reconnectEnd({ event, edge: storedEdge.value, handleType: reconnectHandleType.value, connectionState });
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

      emit.click(data);
    }

    function onEdgeContextMenu(event: MouseEvent) {
      emit.contextMenu({ event, edge: storedEdge.value });
    }

    function onDoubleClick(event: MouseEvent) {
      emit.doubleClick({ event, edge: storedEdge.value });
    }

    function onEdgeMouseEnter(event: MouseEvent) {
      emit.mouseEnter({ event, edge: storedEdge.value });
    }

    function onEdgeMouseMove(event: MouseEvent) {
      emit.mouseMove({ event, edge: storedEdge.value });
    }

    function onEdgeMouseLeave(event: MouseEvent) {
      emit.mouseLeave({ event, edge: storedEdge.value });
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
