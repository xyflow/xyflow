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
  storeToRefs,
  useDrag,
  useNode,
  useNodeHooks,
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
      removeSelectedNodes,
      addSelectedNodes,
      updateNodeDimensions,
      onUpdateNodeInternals,
      getNodeTypes,
      setCenter,
    } = useVueFlow();

    const {
      noPanClassName,
      selectNodesOnDrag,
      nodesSelectionActive,
      multiSelectionActive,
      disableKeyboardA11y,
      ariaLiveMessage,
      ariaLabelConfig,
      nodeDragThreshold,
      nodesDraggable,
      elementsSelectable,
      nodesConnectable,
      nodesFocusable,
      autoPanOnNodeFocus,
      transform,
      dimensions,
      hooks,
    } = storeToRefs(useStore());

    const { parentLookup } = useStore();

    const nodeElement = shallowRef<HTMLDivElement | null>(null);
    provide(NodeRef, nodeElement);
    provide(NodeId, props.id);

    const slots = inject(Slots);

    const instance = getCurrentInstance();

    const updateNodePositions = useUpdateNodePositions();

    // `nodeRef` is a `computed` over the lookup (see useNode): it re-resolves to a NEW InternalNode object
    // whenever the store re-adopts this node (immutable model), which is what re-renders this wrapper.
    const { node: nodeRef } = useNode(props.id);

    const { emit } = useNodeHooks(emits);

    const isDraggable = toRef(() => {
      const node = nodeRef.value;
      return !node || typeof node.draggable === 'undefined' ? nodesDraggable.value : node.draggable;
    });

    const isSelectable = toRef(() => {
      const node = nodeRef.value;
      return !node || typeof node.selectable === 'undefined' ? elementsSelectable.value : node.selectable;
    });

    const isConnectable = toRef(() => {
      const node = nodeRef.value;
      return !node || typeof node.connectable === 'undefined' ? nodesConnectable.value : node.connectable;
    });

    const isFocusable = toRef(() => {
      const node = nodeRef.value;
      return !node || typeof node.focusable === 'undefined' ? nodesFocusable.value : node.focusable;
    });

    const hasPointerEvents = computed(
      () =>
        isSelectable.value
        || isDraggable.value
        || hooks.value.nodeClick.hasListeners()
        || hooks.value.nodeDoubleClick.hasListeners()
        || hooks.value.nodeMouseEnter.hasListeners()
        || hooks.value.nodeMouseMove.hasListeners()
        || hooks.value.nodeMouseLeave.hasListeners(),
    );

    // a node "has dimensions" once it's measured OR carries explicit `width`/`height` OR `initialWidth`/
    // `initialHeight` (the SSR fallback, where there's no ResizeObserver to measure) — mirrors xyflow/react
    // & xyflow/svelte's visibility gate so sized/SSR nodes render immediately instead of staying hidden.
    const isInit = toRef(() => (nodeRef.value ? nodeHasDimensions(nodeRef.value) : false));

    // computed (not toRef): the value-equality gate keeps this node's render effect from re-running on
    // every `parentLookup` entry replacement — an uncached getter read in render tracks the raw map key
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
        emit.dragStart(event);
      },
      onDrag(event) {
        emit.drag(event);
      },
      onStop(event) {
        emit.dragStop(event);
      },
      onClick(event) {
        onSelectNode(event);
      },
    });

    const getClass = computed(() => {
      const node = nodeRef.value;
      if (!node) {
        return undefined;
      }
      return node.class;
    });

    const getStyle = computed(() => {
      const node = nodeRef.value;
      // clone: never mutate the user's `node.style` (nodes are markRaw, so an in-place write isn't
      // reactive AND would cache stale width/height onto the user object across renders)
      const styles = { ...node?.style };

      // mirror xyflow/react's `getNodeInlineStyleDimensions`: before the node is measured (no handle bounds
      // yet — e.g. first paint / SSR) fall back through `initialWidth`/`initialHeight`; once measured, only
      // an explicit `width`/`height` overrides the natural measured size.
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
              [noPanClassName.value]: isDraggable.value,
              dragging: dragging?.value,
              draggable: isDraggable.value,
              selected: node.selected,
              selectable: isSelectable.value,
              parent: isParent.value,
            },
            getClass.value,
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
          'aria-describedby': disableKeyboardA11y.value ? undefined : `${ARIA_NODE_DESC_KEY}-${vueFlowId}`,
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
            // exactly the `NodeProps` surface (xyflow/react parity) — no legacy `connectable`/`position`/
            // `dimensions`/`parent`/`parentNodeId`/`resizing` duplicates, which bloated every node's props
            // and leaked onto custom-node DOM as `$attrs`
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
            onUpdateNodeInternals: updateInternals,
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
        emit.mouseEnter({ event, node: node.internals.userNode });
      }
    }

    function onMouseMove(event: MouseEvent) {
      const node = nodeRef.value;
      if (node && !dragging?.value) {
        emit.mouseMove({ event, node: node.internals.userNode });
      }
    }

    function onMouseLeave(event: MouseEvent) {
      const node = nodeRef.value;
      if (node && !dragging?.value) {
        emit.mouseLeave({ event, node: node.internals.userNode });
      }
    }

    function onContextMenu(event: MouseEvent) {
      const node = nodeRef.value;
      if (node) {
        emit.contextMenu({ event, node: node.internals.userNode });
      }
    }

    function onDoubleClick(event: MouseEvent) {
      const node = nodeRef.value;
      if (node) {
        emit.doubleClick({ event, node: node.internals.userNode });
      }
    }

    function onSelectNode(event: MouseTouchEvent) {
      const node = nodeRef.value;
      if (!node) {
        return;
      }

      if (isSelectable.value && (!selectNodesOnDrag.value || !isDraggable.value || nodeDragThreshold.value > 0)) {
        // handleNodeClick needs the enriched InternalNode; the event payload gets the user node
        handleNodeClick(
          node,
          multiSelectionActive.value,
          addSelectedNodes,
          removeSelectedNodes,
          nodesSelectionActive,
          false,
          nodeElement.value!,
        );
      }

      emit.click({ event, node: node.internals.userNode });
    }

    function onKeyDown(event: KeyboardEvent) {
      const node = nodeRef.value;
      if (!node || isInputDOMNode(event) || disableKeyboardA11y.value) {
        return;
      }

      if (elementSelectionKeys.includes(event.key) && isSelectable.value) {
        const unselect = event.key === 'Escape';

        handleNodeClick(
          node,
          multiSelectionActive.value,
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

        ariaLiveMessage.value = ariaLabelConfig.value['node.a11yDescription.ariaLiveMessage']({
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

    // Pan the viewport to a node that receives KEYBOARD focus (Tab) and isn't currently visible, so
    // tabbing through nodes never lands on an off-screen one. `:focus-visible` keeps this to keyboard
    // focus (not pointer/programmatic).
    function onFocus() {
      const node = nodeRef.value;
      if (!node || disableKeyboardA11y.value || !autoPanOnNodeFocus.value || !nodeElement.value?.matches(':focus-visible')) {
        return;
      }

      const withinViewport
        = getNodesInside(
          new Map([[node.id, node]]),
          { x: 0, y: 0, width: dimensions.value.width, height: dimensions.value.height },
          transform.value,
          true,
        ).length > 0;

      if (!withinViewport) {
        setCenter(
          node.internals.positionAbsolute.x + (node.measured.width ?? 0) / 2,
          node.internals.positionAbsolute.y + (node.measured.height ?? 0) / 2,
          { zoom: transform.value[2] },
        );
      }
    }
  },
});

export default NodeWrapper;
