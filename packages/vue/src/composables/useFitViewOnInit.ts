import { onScopeDispose, watch } from 'vue';
import { storeToRefs } from './storeToRefs';
import { useNodesInitialized } from './useNodesInitialized';
import { useVueFlow } from './useVueFlow';
import { useVueFlowStore } from './useVueFlowStore';

/**
 * Drives the `fitView` prop's initial fit. One-shot — later user resizes don't re-fit — but the container
 * can keep resizing right after mount (e.g. the docs REPL), so re-fit on each settle tick and only mark it
 * done once dimensions hold for a frame. A user pan/zoom ends it immediately.
 *
 * Must run in a descendant of the provider (injects the store) — currently `<ZoomPane>`, since `<VueFlow>`
 * can't inject its own `provide`.
 *
 * @internal
 */
export function useFitViewOnInit() {
  const { fitView, onMoveStart } = useVueFlow();
  const { panZoom, dimensions, fitViewOnInit, fitViewOnInitDone, fitViewOptions } = storeToRefs(useVueFlowStore());
  const nodesInitialized = useNodesInitialized();

  // A user pan/zoom hands viewport control to the user — stop auto-fitting. Our own programmatic `fitView`
  // also fires `moveStart` but with a `null` `event`, so gating on `event` ignores it.
  let userControlled = false;
  onMoveStart(({ event }) => {
    if (event) {
      userControlled = true;
    }
  });

  let done = false;
  let settleFrame: number | undefined;

  watch(
    [nodesInitialized, panZoom, () => dimensions.value.width, () => dimensions.value.height],
    () => {
      if (
        done
        || userControlled
        || !fitViewOnInit.value
        || !panZoom.value
        || !nodesInitialized.value
        || !dimensions.value.width
        || !dimensions.value.height
      ) {
        return;
      }

      fitView(fitViewOptions?.value);
      // reveal the pane after the first fit (kept at `opacity: 0` until now, see `Viewport.vue`) to avoid
      // a flash of nodes at their unfit coordinates
      fitViewOnInitDone.value = true;

      if (settleFrame !== undefined) {
        cancelAnimationFrame(settleFrame);
      }
      settleFrame = requestAnimationFrame(() => {
        done = true;
      });
    },
    { immediate: true, flush: 'post' },
  );

  onScopeDispose(() => {
    if (settleFrame !== undefined) {
      cancelAnimationFrame(settleFrame);
    }
  }, true);
}
