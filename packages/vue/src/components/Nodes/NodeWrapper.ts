import type { BuiltInNode, MouseTouchEvent, NodeComponent } from '../../types';
import { getNodesInside, nodeHasDimensions } from '@xyflow/system';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onMounted,
  provide,
  resolveComponent,
  shallowRef,
  toRef,
  watch,
} from 'vue';
import {
  isInputDOMNode,
  useDrag,
  useStore,
  useUpdateNodePositions,
  useVueFlow,
} from '../../composables';
import { NodeId, NodeRef, Slots } from '../../context';
import { ARIA_NODE_DESC_KEY, arrowKeyDiffs, elementSelectionKeys, ErrorCode, handleNodeClick, VueFlowError } from '../../utils';

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

    // read the reactive store directly; `store.x` tracks reactively without projecting every key into refs per node
    const store = useStore();
    const { parentLookup } = store;

    // `handleNodeClick` writes this back, so it needs a writable ref
    const nodesSelectionActive = toRef(store, 'nodesSelectionActive');

    const nodeElement = shallowRef<HTMLDivElement | null>(null);
    provide(NodeRef, nodeElement);
    provide(NodeId, props.id);

    const slots = inject(Slots);

    const instance = getCurrentInstance();

    const updateNodePositions = useUpdateNodePositions();

    // re-resolves to a NEW InternalNode whenever the store re-adopts this node (immutable model) — that ref
    // swap is what re-renders the wrapper. Resolve directly, not via useNode (which allocates unused computeds).
    const nodeRef = computed(() => getInternalNode(props.id));

    const isDraggable = toRef(() => {
      const node = nodeRef.value;
      return !node || typeof node.draggable === 'undefined' ? store.nodesDraggable : node.draggable;
    });

    const isSelectable = toRef(() => {
      const node = nodeRef.value;
      return !node || typeof node.selectable === 'undefined' ? store.elementsSelectable : node.selectable;
    });

    const isConnectable = toRef(() => {
      const node = nodeRef.value;
      return !node || typeof node.connectable === 'undefined' ? store.nodesConnectable : node.connectable;
    });

    const isFocusable = toRef(() => {
      const node = nodeRef.value;
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
    const isInit = computed(() => (nodeRef.value ? nodeHasDimensions(nodeRef.value) : false));

    // computed (not toRef): the value-equality gate keeps the render effect from re-running on every
    // `parentLookup` entry replacement
    const isParent = computed(() => (parentLookup.get(props.id)?.size ?? 0) > 0);

    const nodeCmp = computed(() => {
      const name = nodeRef.value?.type || 'default';

      const slot = slots?.[`node-${name}`];
      if (slot) {
        return slot;
      }

      let nodeType = getNodeTypes.value[name];

      if (typeof nodeType === 'string') {
        if (instance) {
          const components = Object.keys(instance.appContext.components);
          if (components && components.includes(name)) {
            nodeType = resolveComponent(name, false) as NodeComponent;
          }
        }
      }

      if (nodeType && typeof nodeType !== 'string') {
        return nodeType;
      }

      emits.error(new VueFlowError(ErrorCode.NODE_TYPE_MISSING, nodeType));

      return false;
    });

    const dragging = useDrag({
      id: props.id,
      el: nodeElement,
      disabled: () => !isDraggable.value,
      selectable: isSelectable,
      dragHandle: () => nodeRef.value?.dragHandle,
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
      const node = nodeRef.value;
      // clone: never mutate the user's `node.style` (markRaw nodes — an in-place write isn't reactive and
      // would cache stale width/height onto the user object)
      const styles = { ...node?.style };

      // Vue's `:style` doesn't auto-append `px` to numbers, so coerce numeric width/height to px (string
      // values like `'50%'` pass through untouched)
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

    const zIndex = toRef(() => Number(nodeRef.value?.zIndex ?? getStyle.value.zIndex ?? 0));

    onUpdateNodeInternals((updateIds) => {
      // when no ids are passed, update all nodes
      if (updateIds.includes(props.id) || !updateIds.length) {
        updateInternals();
      }
    });

    onMounted(() => {
      watch(
        () => nodeRef.value?.hidden,
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

    watch([() => nodeRef.value?.type, () => nodeRef.value?.sourcePosition, () => nodeRef.value?.targetPosition], () => {
      nextTick(() => {
        updateNodeDimensions([{ id: props.id, nodeElement: nodeElement.value as HTMLDivElement, forceUpdate: true }]);
      });
    });

    return () => {
      const node = nodeRef.value;

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
            `vue-flow__node-${nodeCmp.value === false ? 'default' : node.type || 'default'}`,
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
          h(nodeCmp.value === false ? (getNodeTypes.value.default as NodeComponent<BuiltInNode>) : (nodeCmp.value as any), {
            // exactly the `NodeProps` surface — no legacy duplicates that bloat props and leak onto custom-node DOM as `$attrs`
            id: node.id,
            type: node.type,
            data: node.data,
            selected: !!node.selected,
            dragging: dragging.value,
            isConnectable: isConnectable.value,
            positionAbsoluteX: node.internals.positionAbsolute.x,
            positionAbsoluteY: node.internals.positionAbsolute.y,
            width: node.measured.width,
            height: node.measured.height,
            parentId: node.parentId,
            zIndex: node.internals.z ?? zIndex.value,
            selectable: node.selectable ?? true,
            deletable: node.deletable ?? true,
            draggable: node.draggable ?? true,
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
      const node = nodeRef.value;
      if (node && !dragging?.value) {
        emits.nodeMouseEnter({ event, node: node.internals.userNode });
      }
    }

    function onMouseMove(event: MouseEvent) {
      const node = nodeRef.value;
      if (node && !dragging?.value) {
        emits.nodeMouseMove({ event, node: node.internals.userNode });
      }
    }

    function onMouseLeave(event: MouseEvent) {
      const node = nodeRef.value;
      if (node && !dragging?.value) {
        emits.nodeMouseLeave({ event, node: node.internals.userNode });
      }
    }

    function onContextMenu(event: MouseEvent) {
      const node = nodeRef.value;
      if (node) {
        emits.nodeContextMenu({ event, node: node.internals.userNode });
      }
    }

    function onDoubleClick(event: MouseEvent) {
      const node = nodeRef.value;
      if (node) {
        emits.nodeDoubleClick({ event, node: node.internals.userNode });
      }
    }

    function onSelectNode(event: MouseTouchEvent) {
      const node = nodeRef.value;
      if (!node) {
        return;
      }

      if (isSelectable.value && (!store.selectNodesOnDrag || !isDraggable.value || store.nodeDragThreshold > 0)) {
        // handleNodeClick needs the enriched InternalNode; the event payload gets the user node
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
      const node = nodeRef.value;
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

    // pan the viewport to a node that gets KEYBOARD focus (Tab) but is off-screen, so tabbing never lands
    // off-screen; `:focus-visible` limits this to keyboard focus (not pointer/programmatic)
    function onFocus() {
      const node = nodeRef.value;
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
