import { defineComponent, inject } from 'vue';
import { Slots } from '../../context';

/**
 * Renders the `zoom-pane` slot from the provided {@link Slots} as its own propless component, so it
 * bails out of Viewport's per-frame (transform) re-renders: the slot is invoked once and rides the CSS
 * transform instead of being rebuilt each pan/zoom frame, and its own reactive updates stay contained
 * here rather than re-rendering Viewport. Same reason the node/edge renderers are child components.
 *
 * @internal
 */
export default defineComponent({
  name: 'ZoomPaneSlot',
  compatConfig: { MODE: 3 },
  setup() {
    const slots = inject(Slots);

    return () => slots?.['zoom-pane']?.() ?? null;
  },
});
