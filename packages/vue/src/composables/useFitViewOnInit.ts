import { watch } from 'vue';
import { storeToRefs } from './storeToRefs';
import { useNodesInitialized } from './useNodesInitialized';
import { useStore } from './useStore';
import { useVueFlow } from './useVueFlow';

/**
 * Drives the `fitView` prop's initial fit.
 *
 * Runs once the panZoom is ready AND every (non-hidden) node has been measured, then **re-runs while the
 * container is still settling** (its dimensions keep changing) — until the user takes viewport control.
 * This makes the initial fit deterministic without consumer-side `setTimeout`s, even when the container
 * resizes on mount, e.g. inside the docs REPL sandbox where the preview pane lays out after the flow
 * (a one-shot fit on the first measurement would latch against a too-small container → top-aligned view).
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

  watch(
    [nodesInitialized, panZoom, () => dimensions.value.width, () => dimensions.value.height],
    () => {
      if (
        userControlled
        || !fitViewOnInit.value
        || !panZoom.value
        || !nodesInitialized.value
        || !dimensions.value.width
        || !dimensions.value.height
      ) {
        return;
      }

      fitView(fitViewOptions?.value);
      fitViewOnInitDone.value = true;
    },
    { immediate: true, flush: 'post' },
  );
}
