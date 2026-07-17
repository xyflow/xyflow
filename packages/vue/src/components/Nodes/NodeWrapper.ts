import type { Component } from 'vue';
import type { MouseTouchEvent } from '../../types';
import { getNodeDimensions, getNodesInside, isInputDOMNode, nodeHasDimensions } from '@xyflow/system';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  onMounted,
  provide,
  shallowRef,
  toRef,
  watch,
} from 'vue';
import {
  useDrag,
  useStore,
  useUpdateNodePositions,
  useVueFlow,
} from '../../composables';
import { NodeId, NodeRef, Slots } from '../../context';
import { ARIA_NODE_DESC_KEY, arrowKeyDiffs, elementSelectionKeys, ErrorCode, handleNodeClick, resolveTypeComponent, VueFlowError } from '../../utils';

interface Props {
  id: string;
  resizeObserver: ResizeObserver;
}

const NodeWrapper = defineComponent({
  name: 'Node',
  compatConfig: { MODE: 3 },
  props: ['id', 'resizeObserver'],
  setup(props: Props) {
    const {
      id: vueFlowId,
      emits,
      getInternalNode,
      removeSelectedNodes,
      addSelectedNodes,
      updateNodeDimensions,
      onUpdateNodeInternals,
      getNodeTypes,
      setCenter,
    } = useVueFlow();

    const store = useStore();
    const { parentLookup } = store;

    const nodesSelectionActive = toRef(store, 'nodesSelectionActive');

    const nodeElement = shallowRef<HTMLDivElement | null>(null);
    provide(NodeRef, nodeElement);
    provide(NodeId, props.id);

    const slots = inject(Slots);

    const instance = getCurrentInstance();

    const updateNodePositions = useUpdateNodePositions();

    const internalNode = computed(() => getInternalNode(props.id));

    const isDraggable = toRef(() => {
      const node = internalNode.value;
      return !node || typeof node.draggable === 'undefined' ? store.nodesDraggable : node.draggable;
    });

    const isSelectable = toRef(() => {
      const node = internalNode.value;
      return !node || typeof node.selectable === 'undefined' ? store.elementsSelectable : node.selectable;
    });

    const isConnectable = toRef(() => {
      const node = internalNode.value;
      return !node || typeof node.connectable === 'undefined' ? store.nodesConnectable : node.connectable;
    });

    const isFocusable = toRef(() => {
      const node = internalNode.value;
      return !node || typeof node.focusable === 'undefined' ? store.nodesFocusable : node.focusable;
    });

    const hasPointerEvents = computed(
      () =>
        isSelectable.value
        || isDraggable.value
        || store.hooks.nodeClick.hasListeners()
        || store.hooks.nodeDoubleClick.hasListeners()
        || store.hooks.nodeMouseEnter.hasListeners()
        || store.hooks.nodeMouseMove.hasListeners()
        || store.hooks.nodeMouseLeave.hasListeners(),
    );

    // a node "has dimensions" once measured OR given explicit width/height OR initialWidth/initialHeight (the
    // SSR fallback, no ResizeObserver) — the visibility gate so sized/SSR nodes render immediately
    const isInit = computed(() => (internalNode.value ? nodeHasDimensions(internalNode.value) : false));

    const isParent = computed(() => (parentLookup.get(props.id)?.size ?? 0) > 0);

    const nodeCmp = computed(() => {
      const name = internalNode.value?.type || 'default';

      const cmp = resolveTypeComponent(slots?.[`node-${name}`], getNodeTypes.value[name], name, instance);

      if (cmp) {
        return cmp;
      }

      emits.error(new VueFlowError(ErrorCode.NODE_TYPE_MISSING, name));

      return undefined;
    });

    const dragging = useDrag({
      id: props.id,
      el: nodeElement,
      disabled: () => !isDraggable.value,
      selectable: isSelectable,
      dragHandle: () => internalNode.value?.dragHandle,
      onStart(event) {
        emits.nodeDragStart(event);
      },
      onDrag(event) {
        emits.nodeDrag(event);
      },
      onStop(event) {
        emits.nodeDragStop(event);
      },
      onClick(event) {
        onSelectNode(event);
      },
    });

    const getStyle = computed(() => {
      const node = internalNode.value;
      const styles = { ...node?.style };

      // Vue's `:style` doesn't auto-append `px` to numbers, so coerce numeric width/height to px
      if (typeof styles.width === 'number') {
        styles.width = `${styles.width}px`;
      }
      if (typeof styles.height === 'number') {
        styles.height = `${styles.height}px`;
      }

      // before the node is measured (no handle bounds yet — first paint / SSR) fall back through
      // `initialWidth`/`initialHeight`; once measured, only an explicit `width`/`height` overrides the measured size
      const isMeasured = !!node?.internals.handleBounds;
      const width = node?.width ?? (isMeasured ? undefined : node?.initialWidth);
      const height = node?.height ?? (isMeasured ? undefined : node?.initialHeight);

      if (!styles.width && width != null) {
        styles.width = `${width}px`;
      }

      if (!styles.height && height != null) {
        styles.height = `${height}px`;
      }

      return styles;
    });

    const zIndex = toRef(() => Number(internalNode.value?.zIndex ?? getStyle.value.zIndex ?? 0));

    onUpdateNodeInternals((updateIds) => {
      if (updateIds.includes(props.id)) {
        updateInternals();
      }
    });

    onMounted(() => {
      watch(
        () => internalNode.value?.hidden,
        (isHidden = false, _, onCleanup) => {
          if (!isHidden && nodeElement.value) {
            props.resizeObserver.observe(nodeElement.value);

            onCleanup(() => {
              if (nodeElement.value) {
                props.resizeObserver.unobserve(nodeElement.value);
              }
            });
          }
        },
        { immediate: true, flush: 'post' },
      );
    });

    watch(
      [() => internalNode.value?.type, () => internalNode.value?.sourcePosition, () => internalNode.value?.targetPosition],
      () => {
        updateNodeDimensions([{ id: props.id, nodeElement: nodeElement.value as HTMLDivElement, forceUpdate: true }]);
      },
      { flush: 'post' },
    );

    return () => {
      const node = internalNode.value;

      if (!node || node.hidden) {
        return null;
      }

      return h(
        'div',
        {
          'ref': nodeElement,
          'data-id': node.id,
          'class': [
            'vue-flow__node',
            `vue-flow__node-${nodeCmp.value ? node.type || 'default' : 'default'}`,
            {
              [store.noPanClassName]: isDraggable.value,
              dragging: dragging?.value,
              draggable: isDraggable.value,
              selected: node.selected,
              selectable: isSelectable.value,
              parent: isParent.value,
            },
            node.class,
          ],
          'style': {
            visibility: isInit.value ? 'visible' : 'hidden',
            zIndex: node.internals.z ?? zIndex.value,
            transform: `translate(${node.internals.positionAbsolute.x}px,${node.internals.positionAbsolute.y}px)`,
            pointerEvents: hasPointerEvents.value ? 'all' : 'none',
            ...getStyle.value,
          },
          'tabIndex': isFocusable.value ? 0 : undefined,
          'role': isFocusable.value ? 'group' : undefined,
          'aria-describedby': store.disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${vueFlowId}`,
          'aria-label': node.ariaLabel,
          'aria-roledescription': 'node',
          ...node.domAttributes,
          'onMouseenter': onMouseEnter,
          'onMousemove': onMouseMove,
          'onMouseleave': onMouseLeave,
          'onContextmenu': onContextMenu,
          'onClick': onSelectNode,
          'onDblclick': onDoubleClick,
          'onKeydown': onKeyDown,
          'onFocus': isFocusable.value ? onFocus : undefined,
        },
        [
          h(nodeCmp.value ?? (getNodeTypes.value.default as Component), {
            id: node.id,
            type: node.type,
            data: node.data,
            selected: !!node.selected,
            dragging: dragging.value,
            isConnectable: isConnectable.value,
            positionAbsoluteX: node.internals.positionAbsolute.x,
            positionAbsoluteY: node.internals.positionAbsolute.y,
            ...getNodeDimensions(node),
            parentId: node.parentId,
            zIndex: node.internals.z ?? zIndex.value,
            selectable: isSelectable.value,
            deletable: node.deletable ?? true,
            draggable: isDraggable.value,
            targetPosition: node.targetPosition,
            sourcePosition: node.sourcePosition,
            dragHandle: node.dragHandle,
          }),
        ],
      );
    };

    function updateInternals() {
      if (nodeElement.value) {
        updateNodeDimensions([{ id: props.id, nodeElement: nodeElement.value, forceUpdate: true }]);
      }
    }

    function onMouseEnter(event: MouseEvent) {
      const node = internalNode.value;
      if (node && !dragging?.value) {
        emits.nodeMouseEnter({ event, node: node.internals.userNode });
      }
    }

    function onMouseMove(event: MouseEvent) {
      const node = internalNode.value;
      if (node && !dragging?.value) {
        emits.nodeMouseMove({ event, node: node.internals.userNode });
      }
    }

    function onMouseLeave(event: MouseEvent) {
      const node = internalNode.value;
      if (node && !dragging?.value) {
        emits.nodeMouseLeave({ event, node: node.internals.userNode });
      }
    }

    function onContextMenu(event: MouseEvent) {
      const node = internalNode.value;
      if (node) {
        emits.nodeContextMenu({ event, node: node.internals.userNode });
      }
    }

    function onDoubleClick(event: MouseEvent) {
      const node = internalNode.value;
      if (node) {
        emits.nodeDoubleClick({ event, node: node.internals.userNode });
      }
    }

    function onSelectNode(event: MouseTouchEvent) {
      const node = internalNode.value;
      if (!node) {
        return;
      }

      if (isSelectable.value && (!store.selectNodesOnDrag || !isDraggable.value || store.nodeDragThreshold > 0)) {
        handleNodeClick(
          node,
          store.multiSelectionActive,
          addSelectedNodes,
          removeSelectedNodes,
          nodesSelectionActive,
          false,
          nodeElement.value!,
        );
      }

      emits.nodeClick({ event, node: node.internals.userNode });
    }

    function onKeyDown(event: KeyboardEvent) {
      const node = internalNode.value;
      if (!node || isInputDOMNode(event) || store.disableKeyboardA11y) {
        return;
      }

      if (elementSelectionKeys.includes(event.key) && isSelectable.value) {
        const unselect = event.key === 'Escape';

        handleNodeClick(
          node,
          store.multiSelectionActive,
          addSelectedNodes,
          removeSelectedNodes,
          nodesSelectionActive,
          unselect,
          nodeElement.value!,
        );
      }
      else if (isDraggable.value && node.selected && arrowKeyDiffs[event.key]) {
        // prevent page scrolling
        event.preventDefault();

        store.ariaLiveMessage = store.ariaLabelConfig['node.a11yDescription.ariaLiveMessage']({
          direction: event.key.replace('Arrow', '').toLowerCase(),
          x: ~~node.position.x,
          y: ~~node.position.y,
        });

        updateNodePositions(
          {
            x: arrowKeyDiffs[event.key].x,
            y: arrowKeyDiffs[event.key].y,
          },
          event.shiftKey,
        );
      }
    }

    function onFocus() {
      const node = internalNode.value;
      if (!node || store.disableKeyboardA11y || !store.autoPanOnNodeFocus || !nodeElement.value?.matches(':focus-visible')) {
        return;
      }

      const withinViewport
        = getNodesInside(
          new Map([[node.id, node]]),
          { x: 0, y: 0, width: store.dimensions.width, height: store.dimensions.height },
          store.transform,
          true,
        ).length > 0;

      if (!withinViewport) {
        setCenter(
          node.internals.positionAbsolute.x + (node.measured.width ?? 0) / 2,
          node.internals.positionAbsolute.y + (node.measured.height ?? 0) / 2,
          { zoom: store.transform[2] },
        );
      }
    }
  },
});

export default NodeWrapper;
