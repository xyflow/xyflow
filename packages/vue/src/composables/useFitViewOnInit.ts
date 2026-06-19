import { onScopeDispose, watch } from 'vue';
import { storeToRefs } from './storeToRefs';
import { useNodesInitialized } from './useNodesInitialized';
import { useStore } from './useStore';
import { useVueFlow } from './useVueFlow';

/**
 * Drives the `fitView` prop's initial fit.
 *
 * The fit is **one-shot**, mirroring xyflow — later user resizes don't re-fit. But the container can keep
 * resizing right after mount (e.g. the docs REPL lays out its preview pane after the flow), and a single fit
 * on the first measurement would latch against a too-small container → top-aligned view. So we re-fit on each
 * settle tick and only mark the fit *done* once the dimensions have stayed put for a frame; from then on the
 * watcher is inert. A user pan/zoom also ends it immediately.
 *
 * Must be called from a descendant of the provider (it injects the store) — currently `<ZoomPane>`, not
 * `<VueFlow>` itself (which can't inject its own `provide`).
 *
 * @internal
 */
export function useFitViewOnInit() {
  const { fitView, onMoveStart } = useVueFlow();
  const { panZoom, dimensions, fitViewOnInit, fitViewOnInitDone, fitViewOptions } = storeToRefs(useStore());
  const nodesInitialized = useNodesInitialized();

  // A user pan/zoom hands viewport control to the user — stop auto-fitting from then on. Our own
  // programmatic `fitView` also fires `moveStart`, but with a `null` `event` (no DOM source event), so
  // gating on `event` ignores it.
  let userControlled = false;
  onMoveStart(({ event }) => {
    if (event) {
      userControlled = true;
    }
  });

  // Latched once the container has settled (or the user took over). The initial fit is one-shot: once this
  // flips true the watcher is inert, so a later resize no longer re-fits.
  let done = false;
  // Each fit (re)arms this frame; if no dimension change re-fires the watcher before it runs, the container
  // has settled and we're done. A change cancels it and re-fits, so we always land on the final size.
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
      // reveal the pane after the first fit — it's kept at `opacity: 0` until now (see `Viewport.vue`) to
      // avoid a flash of nodes at their unfit coordinates
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
