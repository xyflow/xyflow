import { defineComponent, inject } from 'vue';
import { Slots } from '../../context';

/**
 * Renders the `zoom-pane` slot as its own propless component so it bails out of Viewport's per-frame
 * (transform) re-renders — the slot is invoked once and rides the CSS transform instead of rebuilding each
 * frame. Same reason the node/edge renderers are child components.
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
