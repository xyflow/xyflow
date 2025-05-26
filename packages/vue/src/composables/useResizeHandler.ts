import type { Ref } from 'vue';
import { getDimensions } from '@xyflow/system';
import { onBeforeUnmount, onMounted } from 'vue';
import { ErrorCode, VueFlowError } from '../utils';
import { storeToRefs } from './storeToRefs';
import { useStore } from './useStore';
import { useVueFlow } from './useVueFlow';

/**
 * Composable that handles the resize of the viewport.
 *
 * @internal
 * @param viewportEl
 */
export function useResizeHandler(viewportEl: Ref<HTMLDivElement | null>): void {
  const { emits } = useVueFlow();
  const { dimensions } = storeToRefs(useStore());

  let resizeObserver: ResizeObserver;

  onMounted(() => {
    const updateDimensions = () => {
      if (!viewportEl.value || !(viewportEl.value.checkVisibility?.() ?? true)) {
        return;
      }

      const size = getDimensions(viewportEl.value);

      if (size.width === 0 || size.height === 0) {
        emits.error(new VueFlowError(ErrorCode.MISSING_VIEWPORT_DIMENSIONS));
      }

      dimensions.value = { width: size.width || 500, height: size.height || 500 };
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    if (viewportEl.value) {
      resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(viewportEl.value);
    }

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateDimensions);

      const el = viewportEl.value;
      if (resizeObserver && el) {
        resizeObserver.unobserve(el);
      }
    });
  });
}
