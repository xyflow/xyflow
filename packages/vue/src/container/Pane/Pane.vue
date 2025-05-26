<script lang="ts" setup>
import type { XYPosition } from '@xyflow/system';
import type { EdgeChange, NodeChange } from '../../types';
import { areSetsEqual, calcAutoPan, getEventPosition, getNodesInside, pointToRendererPoint, rendererPointToPoint, SelectionMode } from '@xyflow/system';
import { onUnmounted, shallowRef, toRef, watch } from 'vue';
import NodesSelection from '../../components/NodesSelection/NodesSelection.vue';
import UserSelection from '../../components/UserSelection/UserSelection.vue';
import { storeToRefs, useKeyPress, useStore, useVueFlow } from '../../composables';
import { getSelectionChanges } from '../../utils';

const { isSelecting, selectionKeyPressed } = defineProps<{ isSelecting: boolean; selectionKeyPressed: boolean }>();

const { emits, removeSelectedNodes, removeSelectedEdges, resetSelectedElements, getSelectedEdges, getSelectedNodes, deleteElements, panBy } = useVueFlow();

const { edgeLookup, nodeLookup } = useStore();

const {
  vueFlowRef,
  transform,
  userSelectionActive,
  userSelectionRect,
  elementsSelectable,
  nodesSelectionActive,
  selectionMode,
  deleteKeyCode,
  multiSelectionKeyCode,
  multiSelectionActive,
  connectionLookup,
  defaultEdgeOptions,
  connectionStartHandle,
  panOnDrag,
  paneClickDistance,
  autoPanOnSelection,
  autoPanSpeed,
} = storeToRefs(useStore());

const container = shallowRef<HTMLDivElement | null>(null);

const selectedNodeIds = shallowRef<Set<string>>(new Set());

const selectedEdgeIds = shallowRef<Set<string>>(new Set());

const containerBounds = shallowRef<DOMRect | null>(null);

const hasActiveSelection = toRef(() => elementsSelectable.value && (isSelecting || userSelectionActive.value));

const connectionInProgress = toRef(() => connectionStartHandle.value !== null);

// Used to prevent click events when the user lets go of the selectionKey during a selection
let selectionInProgress = false;
let selectionStarted = false;

// Auto-pan while dragging the selection box near the edges of the container
let autoPanId = 0;
let autoPanStarted = false;
let lastPointerPosition: XYPosition = { x: 0, y: 0 };

const deleteKeyPressed = useKeyPress(deleteKeyCode, { actInsideInputWithModifier: false });

const multiSelectKeyPressed = useKeyPress(multiSelectionKeyCode);

watch(deleteKeyPressed, (isKeyPressed) => {
  if (!isKeyPressed) {
    return;
  }

  // routed through `deleteElements` so the `onBeforeDelete` guard (cancel/confirm/filter) is consulted
  deleteElements({
    nodes: [...getSelectedNodes.value],
    edges: [...getSelectedEdges.value],
  });

  nodesSelectionActive.value = false;
});

watch(multiSelectKeyPressed, (isKeyPressed) => {
  multiSelectionActive.value = isKeyPressed;
});

onUnmounted(() => {
  cleanupAutoPan();
});

function wrapHandler(handler: Function, containerRef: HTMLDivElement | null) {
  return (event: MouseEvent) => {
    if (event.target !== containerRef) {
      return;
    }

    handler?.(event);
  };
}

function onClick(event: MouseEvent) {
  if (selectionInProgress || connectionInProgress.value) {
    selectionInProgress = false;
    return;
  }

  emits.paneClick(event);

  // clears the selection, but keeps it while `elementsSelectable` is off (xyflow/react #5217)
  resetSelectedElements();

  nodesSelectionActive.value = false;
}

function onContextMenu(event: MouseEvent) {
  if (Array.isArray(panOnDrag.value) && panOnDrag.value?.includes(2)) {
    event.preventDefault();
    return;
  }

  emits.paneContextMenu(event);
}

function onWheel(event: WheelEvent) {
  emits.paneScroll(event);
}

function onPointerDown(event: PointerEvent) {
  containerBounds.value = vueFlowRef.value?.getBoundingClientRect() ?? null;

  if (
    !elementsSelectable.value
    || !isSelecting
    || event.button !== 0
    || event.target !== container.value
    || !containerBounds.value
  ) {
    return;
  }

  ;(event.target as Element)?.setPointerCapture?.(event.pointerId);

  const { x, y } = getEventPosition(event, containerBounds.value);

  selectionStarted = true;
  selectionInProgress = false;
  autoPanStarted = false;

  // the selection (resetting the current selection + `selectionStart`) only begins once the pointer moves
  // past the click threshold — see `onPointerMove`. Resetting here would clear the selection on a plain
  // click and open a selection box for it (xyflow/react #5593).

  // store the origin in flow coordinates so it stays anchored to the canvas while auto-panning
  const flowStart = pointToRendererPoint({ x, y }, transform.value);

  userSelectionRect.value = {
    width: 0,
    height: 0,
    startX: flowStart.x,
    startY: flowStart.y,
    x,
    y,
  };
}

// Recompute the selection rect (and the selected nodes/edges) from the current pointer position. Called
// both on pointer move and on every auto-pan frame, so the selection keeps growing while the viewport pans.
function commitUserSelectionRect(mouseX: number, mouseY: number) {
  if (!userSelectionRect.value) {
    return;
  }

  // `startX`/`startY` are stored in flow coordinates (so the origin stays put while panning); convert
  // back to screen coordinates to build the rect, which `getNodesInside` and `UserSelection` consume.
  const { startX = 0, startY = 0 } = userSelectionRect.value;
  const screenStart = rendererPointToPoint({ x: startX, y: startY }, transform.value);

  const nextUserSelectRect = {
    startX,
    startY,
    x: mouseX < screenStart.x ? mouseX : screenStart.x,
    y: mouseY < screenStart.y ? mouseY : screenStart.y,
    width: Math.abs(mouseX - screenStart.x),
    height: Math.abs(mouseY - screenStart.y),
  };

  const prevSelectedNodeIds = selectedNodeIds.value;
  const prevSelectedEdgeIds = selectedEdgeIds.value;
  selectedNodeIds.value = new Set(
    getNodesInside(nodeLookup, nextUserSelectRect, transform.value, selectionMode.value === SelectionMode.Partial, true).map(
      node => node.id,
    ),
  );

  selectedEdgeIds.value = new Set();
  // resolution order mirrors EdgeWrapper's isSelectable: edge.selectable ?? defaults ?? global flag
  const edgesSelectable = defaultEdgeOptions.value?.selectable ?? elementsSelectable.value;

  // We look for all edges connected to the selected nodes
  for (const nodeId of selectedNodeIds.value) {
    const connections = connectionLookup.value.get(nodeId);
    if (!connections) {
      continue;
    }
    for (const { edgeId } of connections.values()) {
      const edge = edgeLookup.get(edgeId);
      if (edge && (edge.selectable ?? edgesSelectable)) {
        selectedEdgeIds.value.add(edgeId);
      }
    }
  }

  if (!areSetsEqual(prevSelectedNodeIds, selectedNodeIds.value)) {
    const changes = getSelectionChanges(nodeLookup, selectedNodeIds.value) as NodeChange[];
    emits.nodesChange(changes);
  }

  if (!areSetsEqual(prevSelectedEdgeIds, selectedEdgeIds.value)) {
    const changes = getSelectionChanges(edgeLookup, selectedEdgeIds.value) as EdgeChange[];
    emits.edgesChange(changes);
  }

  userSelectionRect.value = nextUserSelectRect;
  userSelectionActive.value = true;
  nodesSelectionActive.value = false;
}

// rAF loop that pans the viewport while the pointer sits near a container edge during a selection, then
// re-commits the selection rect from the (unchanged) pointer position so it grows toward the new viewport.
function autoPan() {
  if (!autoPanOnSelection.value || !containerBounds.value) {
    return;
  }

  const [xMovement, yMovement] = calcAutoPan(lastPointerPosition, containerBounds.value, autoPanSpeed.value);

  panBy({ x: xMovement, y: yMovement }).then((panned) => {
    if (selectionInProgress && panned) {
      commitUserSelectionRect(lastPointerPosition.x, lastPointerPosition.y);
    }

    autoPanId = requestAnimationFrame(autoPan);
  });
}

function cleanupAutoPan() {
  cancelAnimationFrame(autoPanId);
  autoPanId = 0;
  autoPanStarted = false;
}

function onPointerMove(event: PointerEvent) {
  if (!containerBounds.value || !userSelectionRect.value) {
    return;
  }

  const { x: mouseX, y: mouseY } = getEventPosition(event, containerBounds.value);
  lastPointerPosition = { x: mouseX, y: mouseY };

  // begin the selection only once the pointer has moved past the click threshold — so a plain click
  // neither resets the current selection nor opens a selection box (xyflow/react #5593). Holding the
  // selection key starts immediately (`requiredDistance` 0). `startX`/`startY` are flow coords, so compare
  // against the start in screen space.
  if (!selectionInProgress) {
    const screenStart = rendererPointToPoint({ x: userSelectionRect.value.startX, y: userSelectionRect.value.startY }, transform.value);
    const requiredDistance = selectionKeyPressed ? 0 : paneClickDistance.value;
    const distance = Math.hypot(mouseX - screenStart.x, mouseY - screenStart.y);

    if (distance <= requiredDistance) {
      return;
    }

    removeSelectedNodes();
    removeSelectedEdges();
    emits.selectionStart(event);
  }

  selectionInProgress = true;

  if (!autoPanStarted) {
    autoPan();
    autoPanStarted = true;
  }

  commitUserSelectionRect(mouseX, mouseY);
}

function onPointerUp(event: PointerEvent) {
  if (event.button !== 0 || !selectionStarted) {
    return;
  }

  ;(event.target as Element)?.releasePointerCapture(event.pointerId);

  // We only want to trigger click functions when in selection mode if
  // the user did not move the mouse.
  if (!userSelectionActive.value && userSelectionRect.value && event.target === container.value) {
    onClick(event);
  }

  userSelectionActive.value = false;
  userSelectionRect.value = null;

  // only a real selection drag (not a plain click) updates the selection box / emits `selectionEnd`
  // (xyflow/react #5593)
  if (selectionInProgress) {
    nodesSelectionActive.value = selectedNodeIds.value.size > 0;
    emits.selectionEnd(event);
  }

  // If the user kept holding the selectionKey during the selection,
  // we need to reset the selectionInProgress, so the next click event is not prevented
  if (selectionKeyPressed) {
    selectionInProgress = false;
  }

  selectionStarted = false;

  cleanupAutoPan();
}

function onPointerCancel(event: PointerEvent) {
  ;(event.target as Element)?.releasePointerCapture?.(event.pointerId);
  cleanupAutoPan();
}
</script>

<script lang="ts">
export default {
  name: 'Pane',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <div
    ref="container"
    class="vue-flow__pane vue-flow__container"
    :class="{ selection: isSelecting }"
    @click="(event) => (hasActiveSelection ? undefined : wrapHandler(onClick, container)(event))"
    @contextmenu="wrapHandler(onContextMenu, container)($event)"
    @wheel.passive="wrapHandler(onWheel, container)($event)"
    @pointerenter="(event) => (hasActiveSelection ? undefined : emits.paneMouseEnter(event))"
    @pointerdown="(event) => (hasActiveSelection ? onPointerDown(event) : emits.paneMouseMove(event))"
    @pointermove="(event) => (hasActiveSelection ? onPointerMove(event) : emits.paneMouseMove(event))"
    @pointerup="(event) => (hasActiveSelection ? onPointerUp(event) : undefined)"
    @pointercancel="(event) => (hasActiveSelection ? onPointerCancel(event) : undefined)"
    @pointerleave="emits.paneMouseLeave($event)"
  >
    <slot />
    <UserSelection v-if="userSelectionActive && userSelectionRect" :user-selection-rect="userSelectionRect" />
    <NodesSelection v-if="nodesSelectionActive && getSelectedNodes.length" />
  </div>
</template>
